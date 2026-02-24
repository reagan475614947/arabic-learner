import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arabic Learner",
  description: "A simple shell for an Arabic learning web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav className="site-nav">
            <Link href="/">Home</Link>
            <Link href="/learn">Learn</Link>
            <Link href="/review">Review</Link>
            <Link href="/quiz">Quiz</Link>
            <Link href="/progress">Progress</Link>
          </nav>
        </header>
        <main className="site-content">
          <div className="site-panel">{children}</div>
        </main>
      </body>
    </html>
  );
}
