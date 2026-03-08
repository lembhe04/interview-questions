import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DifficultyBadge from '@/components/DifficultyBadge'
import UpvoteButton from '@/components/UpvoteButton'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('questions')
    .select('title, company')
    .eq('id', params.id)
    .single()
  return {
    title: data ? `${data.title} — ${data.company} | Interview Bank` : 'Question | Interview Bank',
  }
}

export default async function QuestionDetailPage({ params }) {
  const supabase = await createClient()

  const { data: question, error } = await supabase
    .from('questions')
    .select(`*, users(username), votes(id)`)
    .eq('id', params.id)
    .single()

  if (error || !question) notFound()

  const voteCount = question.votes?.length || 0
  const formattedDate = new Date(question.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] flex items-center gap-1.5 mb-8">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to questions
      </Link>

      <div className="mb-8 animate-[fadeUp_0.4s_ease_both]">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
            {question.company}
          </span>
          <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-[var(--border)] text-[var(--ink-muted)]">
            {question.topic}
          </span>
          <DifficultyBadge difficulty={question.difficulty} />
        </div>
        <h1 className="section-title text-3xl sm:text-4xl leading-snug mb-3">{question.title}</h1>
        <div className="flex items-center gap-4 text-sm text-[var(--ink-muted)]">
          <span>by <span className="font-semibold text-[var(--ink)]">{question.users?.username || 'Anonymous'}</span></span>
          <span className="text-[var(--border)]">·</span>
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="card p-7 mb-5 animate-[fadeUp_0.4s_0.1s_ease_both]">
        <h2 className="label mb-3">Question</h2>
        <div className="text-[var(--ink)] leading-relaxed whitespace-pre-wrap text-base">{question.question}</div>
      </div>

      <div className="card p-7 mb-8 animate-[fadeUp_0.4s_0.15s_ease_both]">
        <h2 className="label mb-3">Answer / Solution</h2>
        <div className="text-[var(--ink)] leading-relaxed whitespace-pre-wrap font-mono text-sm bg-[var(--bg)] p-5 rounded-xl border border-[var(--border)]">
          {question.answer}
        </div>
      </div>

      <div className="flex items-center justify-between card p-5 animate-[fadeUp_0.4s_0.2s_ease_both]">
        <div>
          <p className="font-semibold text-[var(--ink)] text-sm">Was this helpful?</p>
          <p className="text-xs text-[var(--ink-muted)]">Upvote to help others find great questions</p>
        </div>
        <UpvoteButton questionId={question.id} initialCount={voteCount} />
      </div>
    </div>
  )
}
