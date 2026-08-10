import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="shell">
      <h1>Mission not found</h1>
      <p>This Gate 0 prototype contains only two fixed missions.</p>
      <Link className="button" href="/">
        Return to start
      </Link>
    </main>
  );
}
