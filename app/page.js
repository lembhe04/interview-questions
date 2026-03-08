import { createClient } from '@/lib/supabase/server'
import QuestionCard from '@/components/QuestionCard'
import HomeFilters from '@/components/HomeFilters'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HomePage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const search = searchParams?.search || ''
  const company = searchParams?.company || ''
  const topic = searchParams?.topic || ''
  const difficulty = searchParams?.difficulty || ''

  let query = supabase
    .from('questions')
    .select(`
      id, title, company, topic, difficulty, created_at,
      users(username),
      votes(id)
    `)
    .order('created_at', { ascending: false })

  if (search) query = query.ilike('title', `%${search}%`)
  if (company) query = query.eq('company', company)
  if (topic) query = query.eq('topic', topic)
  if (difficulty) query = query.eq('difficulty', difficulty)

  const { data: questions } = await query

  const questionsWithCounts = (questions || []).map(q => ({
    ...q,
    vote_count: q.votes?.length || 0,
  }))

  const { data: companies } = await supabase
    .from('questions').select('company').order('company')
  const { data: topics } = await supabase
    .from('questions').select('topic').order('topic')

  const uniqueCompanies = [...new Set((companies || []).map(c => c.company))]
  const uniqueTopics = [...new Set((topics || []).map(t => t.topic))]

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-10 py-12">
      <div className="mb-12 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--accent-light)] text-[var(--accent)] rounded-full text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
          Community-driven prep
        </div>
        <h1 className="section-title text-4xl sm:text-5xl mb-4 leading-tight">
          Interview questions,<br />
          <em>from real interviews.</em>
        </h1>
        <p className="text-[var(--ink-muted)] text-base mb-6">
          Browse {questionsWithCounts.length}+ questions from top companies. Submit yours, upvote the best.
        </p>
        {!user && (
          <div className="flex gap-3">
            <Link href="/auth?mode=signup" className="btn-primary">Join for free</Link>
            <Link href="/auth" className="btn-secondary">Sign in</Link>
          </div>
        )}
        {user && (
          <Link href="/submit" className="btn-primary inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Submit a Question
          </Link>
        )}
      </div>

      <HomeFilters
        companies={uniqueCompanies}
        topics={uniqueTopics}
        currentSearch={search}
        currentCompany={company}
        currentTopic={topic}
        currentDifficulty={difficulty}
      />

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[var(--ink-muted)]">
          {questionsWithCounts.length === 0
            ? 'No questions found'
            : `Showing ${questionsWithCounts.length} question${questionsWithCounts.length !== 1 ? 's' : ''}`}
        </p>
        {(search || company || topic || difficulty) && (
          <Link href="/" className="text-xs text-[var(--accent)] hover:underline font-medium">Clear filters</Link>
        )}
      </div>

      {questionsWithCounts.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="font-semibold text-[var(--ink)] mb-2">No questions found</h3>
          <p className="text-[var(--ink-muted)] text-sm mb-6">Try adjusting your filters or search terms.</p>
          {user && <Link href="/submit" className="btn-primary">Submit the first one</Link>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
          {questionsWithCounts.map(question => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}
    </div>
  )
}
