import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindKata Gate 0",
  description: "Structured practice for the judgment that makes AI useful.",
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
