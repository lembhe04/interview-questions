import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DifficultyBadge from '@/components/DifficultyBadge'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'My Profile | Interview Bank' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth?redirectTo=/profile')

  const { data: profile } = await supabase
    .from('users').select('*').eq('id', user.id).single()

  const { data: questions } = await supabase
    .from('questions')
    .select(`id, title, company, topic, difficulty, created_at, votes(id)`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const questionsWithCounts = (questions || []).map(q => ({
    ...q,
    vote_count: q.votes?.length || 0,
  }))

  const totalUpvotes = questionsWithCounts.reduce((sum, q) => sum + q.vote_count, 0)
  const username = profile?.username || user.email?.split('@')[0] || 'User'

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="card p-8 mb-8 animate-[fadeUp_0.4s_ease_both]">
        <div className="flex items-start gap-5">
          <div
            className="w-16 h-16 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white font-bold text-2xl shrink-0"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {username[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="section-title text-2xl mb-1">{username}</h1>
            <p className="text-sm text-[var(--ink-muted)]">{user.email}</p>
            <p className="text-xs text-[var(--ink-muted)] mt-1">
              Joined {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[var(--border)]">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
              {questionsWithCounts.length}
            </div>
            <div className="text-xs text-[var(--ink-muted)] font-medium mt-1">Questions</div>
          </div>
          <div className="text-center border-x border-[var(--border)]">
            <div className="text-3xl font-bold text-[var(--accent)]" style={{ fontFamily: 'var(--font-display)' }}>
              {totalUpvotes}
            </div>
            <div className="text-xs text-[var(--ink-muted)] font-medium mt-1">Total Upvotes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
              {questionsWithCounts.length > 0
                ? Math.round(totalUpvotes / questionsWithCounts.length * 10) / 10
                : 0}
            </div>
            <div className="text-xs text-[var(--ink-muted)] font-medium mt-1">Avg. Upvotes</div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[var(--ink)] text-lg">My Questions</h2>
          <Link href="/submit" className="btn-primary text-xs px-4 py-2">+ Submit new</Link>
        </div>

        {questionsWithCounts.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-3xl mb-3">📝</div>
            <p className="font-semibold text-[var(--ink)] mb-1">No questions yet</p>
            <p className="text-sm text-[var(--ink-muted)] mb-5">Share your interview experiences with the community.</p>
            <Link href="/submit" className="btn-primary">Submit your first question</Link>
          </div>
        ) : (
          <div className="space-y-3 stagger">
            {questionsWithCounts.map(q => (
              <Link
                key={q.id}
                href={`/questions/${q.id}`}
                className="card p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-[var(--accent)]">{q.company}</span>
                    <span className="text-xs text-[var(--ink-muted)]">·</span>
                    <span className="text-xs text-[var(--ink-muted)]">{q.topic}</span>
                    <DifficultyBadge difficulty={q.difficulty} />
                  </div>
                  <p className="font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors text-sm leading-snug truncate">
                    {q.title}
                  </p>
                  <p className="text-xs text-[var(--ink-muted)] mt-1">
                    {new Date(q.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--ink-muted)] shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span className="text-sm font-semibold">{q.vote_count}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
