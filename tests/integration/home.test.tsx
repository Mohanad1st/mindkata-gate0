import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("G0-08 research boundary on the start page", () => {
  it("presents a finite mission and the safety boundary", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /practice the judgment/i })).toBeInTheDocument();
    expect(screen.getByText(/do not enter personal/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /start mission 1/i })).toHaveAttribute(
      "href",
      "/mission/1",
    );
  });
});
