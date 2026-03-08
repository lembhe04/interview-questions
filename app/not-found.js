import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl font-bold text-[var(--border)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
        404
      </div>
      <h2 className="section-title text-2xl mb-3">Page not found</h2>
      <p className="text-[var(--ink-muted)] mb-8 max-w-sm">
        The question you're looking for might have been removed or doesn't exist.
      </p>
      <Link href="/" className="btn-primary">Back to Home</Link>
    </div>
  )
}
