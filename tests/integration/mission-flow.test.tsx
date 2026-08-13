import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { vi } from "vitest";
import { MissionFlow } from "@/components/mission-flow";
import { getScenario } from "@/content/scenarios";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

describe("G0-01 G0-02 G0-03 G0-04 G0-05 G0-06 G0-08 mission interaction", () => {
  beforeEach(() => {
    sessionStorage.clear();
    push.mockClear();
    Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });
    Object.defineProperty(globalThis.crypto, "randomUUID", {
      value: () => "12345678-1234-4234-8234-123456789abc",
      configurable: true,
    });
  });

  it("keeps AI hidden, completes Mission 1, and preserves distinct evidence", async () => {
    const scenario = getScenario("1");
    expect(scenario).toBeDefined();
    const user = userEvent.setup();
    render(<MissionFlow scenario={scenario!} />);

    await screen.findByText(/anonymous session code/i);
    expect(screen.queryByText(/fixed synthetic output/i)).not.toBeInTheDocument(); // G0-02

    await user.type(screen.getByLabelText("Your initial decision"), "My original answer");
    await user.selectOptions(screen.getByLabelText("Initial confidence"), "medium");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await user.type(
      screen.getByLabelText("What outcome are you trying to achieve?"),
      "A sound choice",
    );
    await user.type(screen.getByLabelText("Who is this decision for?"), "The program owner");
    await user.type(
      screen.getByLabelText("What constraints must not be missed?"),
      "Budget and timing",
    );
    await user.type(screen.getByLabelText("What are you assuming?"), "The summary is accurate");
    await user.type(
      screen.getByLabelText("What information is uncertain or missing?"),
      "Availability",
    );
    await user.click(screen.getByRole("button", { name: "Continue" })); // G0-03

    await user.type(
      screen.getByLabelText("Which steps depend on each other?"),
      "Availability before booking",
    );
    await user.type(screen.getByLabelText("What must remain human-owned?"), "Accountability");
    await user.type(screen.getByLabelText("What can AI assist with?"), "Comparison");
    await user.type(
      screen.getByLabelText("How will you verify the AI-assisted work?"),
      "Check facts",
    );
    await user.click(screen.getByRole("button", { name: "Continue" })); // G0-04

    expect(screen.getByText(/fixed synthetic output/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.type(
      screen.getByLabelText(/what did you verify/i),
      "The arithmetic and constraints",
    );
    await user.type(
      screen.getByLabelText("What did you accept, change, or reject from the AI output?"),
      "Accepted the cost table, rejected the recommendation",
    );
    await user.type(
      screen.getByLabelText("Your final decision and rationale"),
      "My reviewed answer",
    );
    await user.type(
      screen.getByLabelText("What risk remains after this decision?"),
      "Availability could still fail",
    );
    await user.type(
      screen.getByLabelText("Who is accountable, and who do you escalate to?"),
      "Program owner",
    );
    await user.selectOptions(screen.getByLabelText("Final confidence"), "high");
    await user.click(screen.getByRole("button", { name: "Complete mission" }));

    expect(screen.getByRole("heading", { name: "Mission 1 complete" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start Mission 2" })).toBeInTheDocument(); // G0-06

    await act(async () => {});
    const receipt = JSON.parse(sessionStorage.getItem("mindkata-gate0:mission:1") ?? "{}");
    expect(receipt.answers.initialDecision).toBe("My original answer"); // G0-05
    expect(receipt.answers.finalDecision).toBe("My reviewed answer");
    expect(receipt.events.map((event: { name: string }) => event.name)).toEqual([
      "M1_STARTED",
      "M1_COMPLETED",
    ]);

    const accessibility = await axe.run(document.body, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(
      accessibility.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      ),
    ).toEqual([]); // G0-08
  });
});
