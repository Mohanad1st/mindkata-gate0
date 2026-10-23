import type { Metadata, Viewport } from "next";
import "./globals.css";

// metadataBase is required for Next to emit absolute og:image URLs. Without it the card
// renders as a bare link with no title and no image when the URL is shared.
export const metadata: Metadata = {
  metadataBase: new URL("https://mindkata-gate0.vercel.app"),
  title: "MindKata Gate 0",
  description:
    "A research-ethics scope lock a build can check: CI enforcement that fails the build when work drifts outside approved Gate 0 scope.",
  applicationName: "MindKata Gate 0",
  openGraph: {
    type: "website",
    siteName: "MindKata Gate 0",
    title: "It refuses to build the product. That is the point.",
    description:
      "A Gate 0 research prototype whose scope boundary is a file the build reads. Two finite synthetic missions; nothing is collected.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "It refuses to build the product. That is the point.",
    description:
      "A research-ethics scope lock a build can check. Gate 0 research prototype — two synthetic missions, nothing collected.",
  },
  robots: {
    // A research instrument under a provisional name. Reachable by link, per
    // decisions/0009, but it should not accumulate search presence for a name that
    // docs/scope-lock.md still forbids relying on.
    index: false,
    follow: true,
  },
};

// Matches --paper in each theme so the mobile browser chrome does not sit as a bright
// band above a dark page, or vice versa.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3eb" },
    { media: "(prefers-color-scheme: dark)", color: "#101614" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
