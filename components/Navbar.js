'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="  sticky top-0 z-50 bg-[var(--bg)] border-b border-[var(--border)] backdrop-blur-sm bg-opacity-90">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            IB
          </div>
          <span style={{ fontFamily: 'var(--font-display)' }} className="text-lg font-semibold text-[var(--ink)] hidden sm:block">
            Interview Bank
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/" className="btn-ghost">Browse</Link>
          {user && (
            <>
              <Link href="/submit" className="btn-ghost">Submit</Link>
              <Link href="/profile" className="btn-ghost">Profile</Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-20 h-8 bg-[var(--border)] rounded-lg animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--ink-muted)]">
                {user.email?.split('@')[0]}
              </span>
              <button onClick={handleLogout} className="btn-secondary">
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth" className="btn-ghost">Sign In</Link>
              <Link href="/auth?mode=signup" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[var(--border)] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={`w-5 h-0.5 bg-[var(--ink)] transition-all ${menuOpen ? 'rotate-45 translate-y-1' : ''}`} />
          <div className={`w-5 h-0.5 bg-[var(--ink)] mt-1 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-5 h-0.5 bg-[var(--ink)] mt-1 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3 flex flex-col gap-1">
          <Link href="/" className="btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Browse</Link>
          {user ? (
            <>
              <Link href="/submit" className="btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Submit Question</Link>
              <Link href="/profile" className="btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>My Profile</Link>
              <button onClick={handleLogout} className="btn-ghost w-full text-left text-[var(--hard)]">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth" className="btn-ghost w-full text-left" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link href="/auth?mode=signup" className="btn-primary w-full text-center mt-1" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
