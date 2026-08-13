export const receiptEventNames = [
  "M1_STARTED",
  "M1_COMPLETED",
  "M2_STARTED",
  "M2_COMPLETED",
] as const;

export type ReceiptEventName = (typeof receiptEventNames)[number];

export type ReceiptEvent = {
  name: ReceiptEventName;
  at: string;
};

/**
 * The shape a participant exports from the completion receipt. It matches the record written to
 * `sessionStorage` by MissionFlow, so an exported file parses without transformation. Only the
 * operational fields are declared here — `answers` is deliberately absent, because facilitator
 * aggregation must never read participant text.
 */
export type Receipt = {
  schemaVersion: number;
  sessionCode: string;
  missionId: string;
  startedAt: string;
  completedAt?: string;
  events: ReceiptEvent[];
};

export type ParseResult = { ok: true; receipt: Receipt } | { ok: false; reason: string };

export type MissionSummary = {
  missionId: string;
  receipts: number;
  sessionCodes: number;
  duplicatesCollapsed: number;
  started: number;
  completed: number;
  completionMinutes: number[];
  medianCompletionMinutes: number | null;
};

/**
 * An unambiguous ISO-8601 instant: an explicit `Z` or numeric offset is required.
 *
 * `Date.parse` alone is not safe here. It accepts `"2026-08-10"` (interpreted as UTC) and
 * `"2026-08-10T10:00:00"` (interpreted as LOCAL time), so mixing the two forms silently shifts a
 * duration by the machine's offset — a real ten-minute mission measured as 250 minutes, or as a
 * negative that disappears from the sample. It also accepts `"2026"` and `"August 10, 2026"`.
 * Since these files may be re-saved through editors and spreadsheets that rewrite timestamps, the
 * offset has to be explicit or the number cannot be trusted.
 */
const isoInstantPattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

function parseInstant(value: unknown): number | null {
  if (typeof value !== "string" || !isoInstantPattern.test(value)) return null;
  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds) ? milliseconds : null;
}

/** Treats null and empty string as "absent", which is what a re-serialised receipt often carries. */
function isAbsent(value: unknown): boolean {
  return value === undefined || value === null || value === "";
}

function expectedEventPrefix(missionId: string): "M1" | "M2" {
  return missionId === "1" ? "M1" : "M2";
}

/**
 * Validates one parsed JSON receipt. Returns a reason instead of throwing so that a single
 * malformed export cannot abort a whole facilitator run.
 *
 * Unknown event names are ignored rather than fatal: `docs/data-dictionary/events.md` is a living
 * dictionary, and rejecting a whole receipt because a later slice added an event would silently
 * deflate the counts a gate decision reads.
 */
export function parseReceipt(raw: unknown): ParseResult {
  if (typeof raw !== "object" || raw === null) return { ok: false, reason: "not an object" };
  const candidate = raw as Record<string, unknown>;

  if (candidate.schemaVersion !== 1) {
    return { ok: false, reason: `unsupported schemaVersion ${String(candidate.schemaVersion)}` };
  }
  if (typeof candidate.sessionCode !== "string" || candidate.sessionCode.length === 0) {
    return { ok: false, reason: "missing sessionCode" };
  }
  if (candidate.missionId !== "1" && candidate.missionId !== "2") {
    return { ok: false, reason: `unapproved missionId ${String(candidate.missionId)}` };
  }
  if (parseInstant(candidate.startedAt) === null) {
    return { ok: false, reason: "startedAt is not an ISO instant with an explicit offset" };
  }
  const hasCompletedAt = !isAbsent(candidate.completedAt);
  if (hasCompletedAt && parseInstant(candidate.completedAt) === null) {
    return { ok: false, reason: "completedAt is not an ISO instant with an explicit offset" };
  }
  if (!Array.isArray(candidate.events)) return { ok: false, reason: "missing events" };

  const prefix = expectedEventPrefix(candidate.missionId);
  const events: ReceiptEvent[] = [];
  for (const entry of candidate.events) {
    if (typeof entry !== "object" || entry === null) {
      return { ok: false, reason: "malformed event" };
    }
    const event = entry as Record<string, unknown>;
    if (!receiptEventNames.includes(event.name as ReceiptEventName)) continue;
    const name = event.name as ReceiptEventName;
    if (!name.startsWith(prefix)) {
      return { ok: false, reason: `mission ${candidate.missionId} receipt carries ${name}` };
    }
    if (parseInstant(event.at) === null) {
      return { ok: false, reason: `event ${name} has no ISO instant` };
    }
    events.push({ name, at: event.at as string });
  }

  return {
    ok: true,
    receipt: {
      schemaVersion: 1,
      sessionCode: candidate.sessionCode,
      missionId: candidate.missionId,
      startedAt: candidate.startedAt as string,
      ...(hasCompletedAt ? { completedAt: candidate.completedAt as string } : {}),
      events,
    },
  };
}

/** Returns null for an empty set rather than NaN, so callers must handle "no data" explicitly. */
export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[middle] as number;
  return ((sorted[middle - 1] as number) + (sorted[middle] as number)) / 2;
}

/**
 * Elapsed minutes from mission start to the recorded completion. Returns null when the mission was
 * not completed, or when the timestamps are inverted — a negative duration is bad data, not a fast
 * participant.
 *
 * This is wall-clock time from when the mission page mounted. It includes any idle or interrupted
 * time, because `sessionStorage` survives a reload within the session.
 */
export function completionMinutes(receipt: Receipt): number | null {
  const started = parseInstant(receipt.startedAt);
  const completed = parseInstant(receipt.completedAt);
  if (started === null || completed === null) return null;
  const elapsed = completed - started;
  if (elapsed < 0) return null;
  return elapsed / 60_000;
}

/**
 * One participant-mission is one data point. Two files carrying the same session code are the same
 * participant — a second click on Download, or a copy saved as "… (1).json" — so counting both
 * would report two participants and weight one duration twice in the median.
 *
 * Of a duplicate set, the record showing a completion wins; otherwise the earliest start wins, on
 * the basis that it is the original export.
 */
function dedupeBySessionCode(receipts: Receipt[]): { unique: Receipt[]; collapsed: number } {
  const bySessionCode = new Map<string, Receipt>();
  let collapsed = 0;

  for (const receipt of receipts) {
    const existing = bySessionCode.get(receipt.sessionCode);
    if (existing === undefined) {
      bySessionCode.set(receipt.sessionCode, receipt);
      continue;
    }
    collapsed += 1;
    const existingCompleted = completionMinutes(existing) !== null;
    const candidateCompleted = completionMinutes(receipt) !== null;
    if (candidateCompleted && !existingCompleted) {
      bySessionCode.set(receipt.sessionCode, receipt);
      continue;
    }
    if (candidateCompleted === existingCompleted) {
      const existingStart = parseInstant(existing.startedAt) ?? 0;
      const candidateStart = parseInstant(receipt.startedAt) ?? 0;
      if (candidateStart < existingStart) bySessionCode.set(receipt.sessionCode, receipt);
    }
  }

  return { unique: [...bySessionCode.values()], collapsed };
}

function summarizeMission(missionId: string, missionReceipts: Receipt[]): MissionSummary {
  const startedEvent = missionId === "1" ? "M1_STARTED" : "M2_STARTED";
  const completedEvent = missionId === "1" ? "M1_COMPLETED" : "M2_COMPLETED";
  const { unique, collapsed } = dedupeBySessionCode(missionReceipts);
  const durations: number[] = [];

  let started = 0;
  let completed = 0;
  for (const receipt of unique) {
    if (receipt.events.some((event) => event.name === startedEvent)) started += 1;
    if (receipt.events.some((event) => event.name === completedEvent)) {
      completed += 1;
      const minutes = completionMinutes(receipt);
      if (minutes !== null) durations.push(minutes);
    }
  }

  return {
    missionId,
    receipts: missionReceipts.length,
    sessionCodes: unique.length,
    duplicatesCollapsed: collapsed,
    started,
    completed,
    completionMinutes: durations,
    medianCompletionMinutes: median(durations),
  };
}

/**
 * Operational counts only, grouped by mission and de-duplicated per participant. This reports
 * evidence; it does not compare anything against the Gate 0A thresholds and does not produce a GO,
 * PIVOT, or STOP verdict — those are human decisions recorded in `docs/scope-lock.md`.
 */
export function summarize(receipts: Receipt[]): MissionSummary[] {
  return ["1", "2"].map((missionId) =>
    summarizeMission(
      missionId,
      receipts.filter((receipt) => receipt.missionId === missionId),
    ),
  );
}
