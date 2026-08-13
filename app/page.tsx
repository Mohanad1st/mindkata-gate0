import Link from "next/link";

export default function Home() {
  return (
    <main id="main-content" className="shell">
      <header className="hero">
        <p className="eyebrow">Gate 0 research prototype</p>
        <h1>Practice the judgment that makes AI useful.</h1>
        <p className="lede">
          Two finite work missions help you frame a decision, choose what to delegate, inspect an AI
          recommendation, verify what matters, and retain decision ownership.
        </p>
      </header>

      <section className="notice" aria-labelledby="boundary-title">
        <h2 id="boundary-title">Before you begin</h2>
        <ul>
          <li>Use only the fictional information shown in the mission.</li>
          <li>
            Do not enter personal, employer, client, employee, patient, government, or confidential
            information.
          </li>
          <li>
            This prototype does not diagnose intelligence, cognitive decline, mental health,
            employability, or job performance.
          </li>
          <li>Your results will not be used for employment decisions.</li>
          <li>Your draft stays in this browser session unless you export it yourself.</li>
        </ul>
      </section>

      <section className="card" aria-labelledby="mission-one-title">
        <p className="step-label">Mission 1 of 2</p>
        <h2 id="mission-one-title">Choose a training delivery plan</h2>
        <p>Expected time: 8–12 minutes. The experience has a visible endpoint and no feed.</p>
        <Link className="button" href="/mission/1">
          Start Mission 1
        </Link>
      </section>

      <footer className="footer">
        Working name only: MindKata. Approved for Gate 0 evidence collection, not product efficacy
        claims.
      </footer>
    </main>
  );
}
