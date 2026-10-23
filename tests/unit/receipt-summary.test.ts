import {
  completionMinutes,
  median,
  parseReceipt,
  summarize,
  type Receipt,
} from "@/lib/receipt-summary";

function receipt(overrides: Partial<Receipt> & Pick<Receipt, "missionId">): Receipt {
  return {
    schemaVersion: 1,
    sessionCode: "MK-AAAAAAAA",
    startedAt: "2026-08-10T10:00:00.000Z",
    events: [],
    ...overrides,
  };
}

function exported(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    schemaVersion: 1,
    sessionCode: "MK-12AB34CD",
    missionId: "1",
    startedAt: "2026-08-10T10:00:00.000Z",
    completedAt: "2026-08-10T10:10:00.000Z",
    events: [
      { name: "M1_STARTED", at: "2026-08-10T10:00:00.000Z" },
      { name: "M1_COMPLETED", at: "2026-08-10T10:10:00.000Z" },
    ],
    ...overrides,
  };
}

describe("median", () => {
  it("returns null for no data rather than NaN", () => {
    expect(median([])).toBeNull();
  });

  it("sorts numerically, not lexicographically", () => {
    expect(median([9, 10, 8])).toBe(9);
  });

  it("averages the two middle values for an even count", () => {
    expect(median([10, 2, 4, 8])).toBe(6);
  });

  it("does not mutate the caller's array", () => {
    const values = [3, 1, 2];
    median(values);
    expect(values).toEqual([3, 1, 2]);
  });
});

describe("completionMinutes", () => {
  it("measures elapsed minutes between start and completion", () => {
    expect(
      completionMinutes(
        receipt({
          missionId: "1",
          startedAt: "2026-08-10T10:00:00.000Z",
          completedAt: "2026-08-10T10:09:30.000Z",
        }),
      ),
    ).toBe(9.5);
  });

  it("returns null when the mission was never completed", () => {
    expect(completionMinutes(receipt({ missionId: "1" }))).toBeNull();
  });

  it("treats an inverted duration as bad data, not a fast participant", () => {
    expect(
      completionMinutes(
        receipt({
          missionId: "1",
          startedAt: "2026-08-10T10:00:00.000Z",
          completedAt: "2026-08-10T09:50:00.000Z",
        }),
      ),
    ).toBeNull();
  });

  it("refuses timestamps without an explicit offset instead of guessing a zone", () => {
    // Date.parse would read the date as UTC and the naive time as LOCAL, turning a real ten
    // minutes into 250 on a UTC-4 machine. Refusing is the only safe answer.
    expect(
      completionMinutes(
        receipt({
          missionId: "1",
          startedAt: "2026-08-10",
          completedAt: "2026-08-10T00:10:00",
        }),
      ),
    ).toBeNull();
  });
});

describe("parseReceipt", () => {
  it("accepts a well-formed exported receipt and preserves the fields aggregation needs", () => {
    const result = parseReceipt(exported({ missionId: "2", events: [] }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.receipt).toMatchObject({
      sessionCode: "MK-12AB34CD",
      missionId: "2",
      startedAt: "2026-08-10T10:00:00.000Z",
      completedAt: "2026-08-10T10:10:00.000Z",
    });
  });

  it("keeps known events through the round trip", () => {
    const result = parseReceipt(exported());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.receipt.events.map((event) => event.name)).toEqual([
        "M1_STARTED",
        "M1_COMPLETED",
      ]);
    }
  });

  it("ignores participant answers instead of carrying them into aggregation", () => {
    const result = parseReceipt(
      exported({ answers: { initialDecision: "participant text that must not be aggregated" } }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.receipt).not.toHaveProperty("answers");
  });

  it("rejects a receipt that is not an object", () => {
    expect(parseReceipt("nope")).toEqual({ ok: false, reason: "not an object" });
  });

  it("rejects an unsupported schema version even when everything else is valid", () => {
    expect(parseReceipt(exported({ schemaVersion: 2 }))).toEqual({
      ok: false,
      reason: "unsupported schemaVersion 2",
    });
  });

  it("rejects a mission outside the approved two", () => {
    expect(parseReceipt(exported({ missionId: "3", events: [] }))).toEqual({
      ok: false,
      reason: "unapproved missionId 3",
    });
  });

  it("rejects a timestamp with no explicit offset", () => {
    expect(parseReceipt(exported({ startedAt: "2026-08-10T10:00:00" }))).toEqual({
      ok: false,
      reason: "startedAt is not an ISO instant with an explicit offset",
    });
  });

  it("rejects a receipt whose events belong to the other mission", () => {
    expect(
      parseReceipt(
        exported({
          missionId: "1",
          events: [{ name: "M2_COMPLETED", at: "2026-08-10T10:10:00.000Z" }],
        }),
      ),
    ).toEqual({ ok: false, reason: "mission 1 receipt carries M2_COMPLETED" });
  });

  it("ignores an unknown event rather than discarding the whole receipt", () => {
    const result = parseReceipt(
      exported({
        events: [
          { name: "M1_STARTED", at: "2026-08-10T10:00:00.000Z" },
          { name: "M1_EXPORTED", at: "2026-08-10T10:12:00.000Z" },
          { name: "M1_COMPLETED", at: "2026-08-10T10:10:00.000Z" },
        ],
      }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.receipt.events.map((event) => event.name)).toEqual([
        "M1_STARTED",
        "M1_COMPLETED",
      ]);
    }
  });

  it("treats a null completedAt as not completed instead of losing the receipt", () => {
    const result = parseReceipt(exported({ completedAt: null }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.receipt.completedAt).toBeUndefined();
  });
});

describe("summarize", () => {
  it("reports started, completed, and median minutes per mission", () => {
    const summaries = summarize([
      receipt({
        missionId: "1",
        sessionCode: "MK-AAAA0001",
        completedAt: "2026-08-10T10:08:00.000Z",
        events: [
          { name: "M1_STARTED", at: "2026-08-10T10:00:00.000Z" },
          { name: "M1_COMPLETED", at: "2026-08-10T10:08:00.000Z" },
        ],
      }),
      receipt({
        missionId: "1",
        sessionCode: "MK-AAAA0002",
        completedAt: "2026-08-10T10:12:00.000Z",
        events: [
          { name: "M1_STARTED", at: "2026-08-10T10:00:00.000Z" },
          { name: "M1_COMPLETED", at: "2026-08-10T10:12:00.000Z" },
        ],
      }),
      receipt({
        missionId: "1",
        sessionCode: "MK-AAAA0003",
        events: [{ name: "M1_STARTED", at: "2026-08-10T10:00:00.000Z" }],
      }),
      receipt({
        missionId: "2",
        sessionCode: "MK-BBBB0001",
        events: [{ name: "M2_STARTED", at: "2026-08-10T10:20:00.000Z" }],
      }),
    ]);

    expect(summaries.find((summary) => summary.missionId === "1")).toMatchObject({
      receipts: 3,
      sessionCodes: 3,
      duplicatesCollapsed: 0,
      started: 3,
      completed: 2,
      medianCompletionMinutes: 10,
    });
    expect(summaries.find((summary) => summary.missionId === "2")).toMatchObject({
      receipts: 1,
      started: 1,
      completed: 0,
      medianCompletionMinutes: null,
    });
  });

  it("counts one participant once when a receipt was downloaded twice", () => {
    const duplicate = {
      missionId: "1" as const,
      sessionCode: "MK-AAAA0001",
      completedAt: "2026-08-10T10:10:00.000Z",
      events: [
        { name: "M1_STARTED" as const, at: "2026-08-10T10:00:00.000Z" },
        { name: "M1_COMPLETED" as const, at: "2026-08-10T10:10:00.000Z" },
      ],
    };
    const [missionOne] = summarize([receipt(duplicate), receipt(duplicate)]);
    expect(missionOne).toMatchObject({
      receipts: 2,
      sessionCodes: 1,
      duplicatesCollapsed: 1,
      started: 1,
      completed: 1,
      medianCompletionMinutes: 10,
    });
  });

  it("prefers the completed copy when a participant has both an abandoned and a finished export", () => {
    const abandoned = receipt({
      missionId: "1",
      sessionCode: "MK-AAAA0009",
      events: [{ name: "M1_STARTED", at: "2026-08-10T10:00:00.000Z" }],
    });
    const finished = receipt({
      missionId: "1",
      sessionCode: "MK-AAAA0009",
      completedAt: "2026-08-10T10:07:00.000Z",
      events: [
        { name: "M1_STARTED", at: "2026-08-10T10:00:00.000Z" },
        { name: "M1_COMPLETED", at: "2026-08-10T10:07:00.000Z" },
      ],
    });
    for (const order of [
      [abandoned, finished],
      [finished, abandoned],
    ]) {
      const [missionOne] = summarize(order);
      expect(missionOne).toMatchObject({ sessionCodes: 1, completed: 1 });
    }
  });

  it("aggregates receipts that came through parseReceipt, not just hand-built objects", () => {
    const parsed = [
      exported({ sessionCode: "MK-CCCC0001" }),
      exported({ sessionCode: "MK-CCCC0002" }),
    ]
      .map(parseReceipt)
      .flatMap((result) => (result.ok ? [result.receipt] : []));
    expect(parsed).toHaveLength(2);

    const [missionOne] = summarize(parsed);
    expect(missionOne).toMatchObject({
      sessionCodes: 2,
      started: 2,
      completed: 2,
      medianCompletionMinutes: 10,
    });
  });

  it("always reports both approved missions, even with no receipts at all", () => {
    expect(summarize([]).map((summary) => summary.missionId)).toEqual(["1", "2"]);
  });
});

// ADR 0010. startedAt is written on mount, so page-open time counts the minutes a participant
// spends reading the brief. Mission 1 is scored on a 12-minute median with a STOP floor at 18, so
// the difference between the two intervals can decide a gate. These assert that task time is
// measured from the defined event, that it never silently substitutes for page-open time, and that
// receipts predating this ADR still aggregate rather than being rejected.
describe("G0-12 task time is measured from a defined event", () => {
  const withFirstInput = (overrides: Record<string, unknown> = {}) =>
    exported({
      firstInputAt: "2026-08-10T10:04:00.000Z",
      events: [
        { name: "M1_STARTED", at: "2026-08-10T10:00:00.000Z" },
        { name: "M1_FIRST_INPUT", at: "2026-08-10T10:04:00.000Z" },
        { name: "M1_COMPLETED", at: "2026-08-10T10:10:00.000Z" },
      ],
      ...overrides,
    });

  it("separates the four minutes of reading from the six minutes of work", () => {
    const parsed = parseReceipt(withFirstInput());
    expect(parsed.ok).toBe(true);

    const [missionOne] = summarize(parsed.ok ? [parsed.receipt] : []);
    expect(missionOne).toMatchObject({
      medianCompletionMinutes: 10,
      medianTaskMinutes: 6,
    });
  });

  it("leaves task time unmeasurable rather than zero for a receipt predating ADR 0010", () => {
    const parsed = parseReceipt(exported());
    expect(parsed.ok).toBe(true);
    expect(parsed.ok && parsed.receipt.firstInputAt).toBeUndefined();

    const [missionOne] = summarize(parsed.ok ? [parsed.receipt] : []);
    // A zero here would pull a median down and make the instrument look faster than it is.
    expect(missionOne).toMatchObject({ medianCompletionMinutes: 10, medianTaskMinutes: null });
    expect(missionOne?.taskMinutes).toEqual([]);
  });

  it("rejects a firstInputAt without an explicit offset, like every other instant", () => {
    const parsed = parseReceipt(withFirstInput({ firstInputAt: "2026-08-10T10:04:00" }));
    expect(parsed.ok).toBe(false);
    expect(parsed.ok === false && parsed.reason).toMatch(/firstInputAt/);
  });

  it("discards an inverted interval instead of reporting a negative duration", () => {
    const parsed = parseReceipt(withFirstInput({ firstInputAt: "2026-08-10T10:12:00.000Z" }));
    expect(parsed.ok).toBe(true);
    const [missionOne] = summarize(parsed.ok ? [parsed.receipt] : []);
    expect(missionOne).toMatchObject({ medianTaskMinutes: null });
  });

  it("does not move startedAt or the M1_STARTED event", () => {
    const parsed = parseReceipt(withFirstInput());
    expect(parsed.ok && parsed.receipt.startedAt).toBe("2026-08-10T10:00:00.000Z");
    expect(parsed.ok && parsed.receipt.events.map((event) => event.name)).toEqual([
      "M1_STARTED",
      "M1_FIRST_INPUT",
      "M1_COMPLETED",
    ]);
  });
});
