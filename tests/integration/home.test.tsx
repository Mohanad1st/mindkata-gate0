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

describe("G0-11 provisional-name and no-efficacy-claim disclaimer", () => {
  // The prototype is deployed to a public URL with no authentication
  // (decisions/0009). The scope lock cannot detect an over-claim in prose, so
  // the one thing that distinguishes this from a launched product — the
  // in-product statement that the name is provisional and no efficacy is
  // claimed — is asserted here instead. Removing that footer fails the build.
  it("names the working name as provisional and disclaims efficacy", () => {
    render(<Home />);
    const disclaimer = screen.getByText(/working name only/i);
    expect(disclaimer).toBeInTheDocument();
    expect(disclaimer).toHaveTextContent(/not product efficacy/i);
  });
});
