'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function UpvoteButton({ questionId, initialCount }) {
  const [count, setCount] = useState(initialCount || 0)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('votes')
          .select('id')
          .eq('user_id', user.id)
          .eq('question_id', questionId)
          .maybeSingle()
        if (data) setVoted(true)
      }
    }
    init()
  }, [questionId])

  const handleVote = async () => {
    if (!user || loading) return
    setLoading(true)

    if (voted) {
      // Remove vote
      await supabase
        .from('votes')
        .delete()
        .eq('user_id', user.id)
        .eq('question_id', questionId)

      setCount(c => c - 1)
      setVoted(false)
    } else {
      // Add vote
      const { error } = await supabase
        .from('votes')
        .insert({ user_id: user.id, question_id: questionId })

      if (!error) {
        setCount(c => c + 1)
        setVoted(true)
      }
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <a
        href="/auth"
        className="flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all text-sm font-medium"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
        Sign in to upvote · {count}
      </a>
    )
  }

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 font-semibold transition-all active:scale-95 ${
        voted
          ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]'
          : 'border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
      }`}
    >
      <svg
        className={`w-5 h-5 transition-transform ${voted ? '-translate-y-0.5' : ''}`}
        fill={voted ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
      <span>{count}</span>
      {voted && <span className="text-xs font-normal">Upvoted</span>}
    </button>
  )
}
