import process from "node:process";

let input = "";
for await (const chunk of process.stdin) input += chunk;

let command = "";
try {
  const payload = JSON.parse(input);
  command = String(payload?.tool_input?.command ?? payload?.tool_input?.cmd ?? "");
} catch {
  process.exit(0);
}

const blocked = [
  /git\s+push\s+.*(?:--force|-f)\b/i,
  /git\s+reset\s+--hard/i,
  /vercel\s+.*--prod(?:uction)?\b/i,
  /supabase\s+db\s+(?:push|reset)/i,
  /rm\s+-rf\s+(?:\/|~|\$HOME|\$home)\b/i,
  /--dangerously-skip-permissions/i,
];

if (blocked.some((pattern) => pattern.test(command))) {
  console.error(
    "Blocked by the MindKata project safety gate. Use a reviewed, non-destructive alternative or request explicit human approval.",
  );
  process.exit(2);
}
