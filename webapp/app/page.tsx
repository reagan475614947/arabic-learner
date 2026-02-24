import Link from "next/link";

export default function Home() {
  return (
    <div className="page-shell home-shell">
      <div>
        <h1>Arabic Learner</h1>
        <p className="subtitle">Simple daily practice for vocabulary, review, and quick quizzes.</p>
        <section className="card-grid">
          <Link href="/learn" className="big-card">
            Learn
          </Link>
          <Link href="/review" className="big-card">
            Review
          </Link>
          <Link href="/quiz" className="big-card">
            Quiz
          </Link>
          <Link href="/progress" className="big-card">
            Progress
          </Link>
        </section>
      </div>
      <p className="home-credit">Developed by Gen @ Feb 2026.</p>
    </div>
  );
}
