import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Interview Question Bank',
  description: 'Browse, submit, and upvote interview questions from top companies',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="border-t border-[var(--border)] mt-20 py-10 text-center text-sm text-[var(--ink-muted)]">
          <div className="max-w-6xl mx-auto px-4">
            <span style={{ fontFamily: 'var(--font-display)' }} className="font-semibold text-[var(--ink)]">
              Interview Bank
            </span>
            <span className="mx-2 text-[var(--border)]">·</span>
            Built to help you prep smarter
          </div>
        </footer>
      </body>
    </html>
  )
}
