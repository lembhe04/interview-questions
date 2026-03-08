import Link from 'next/link'
import DifficultyBadge from './DifficultyBadge'

export default function QuestionCard({ question }) {
  const { id, title, company, topic, difficulty, vote_count, users } = question

  return (
    <div className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
            {company}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--border)] text-[var(--ink-muted)]">
            {topic}
          </span>
          <DifficultyBadge difficulty={difficulty} />
        </div>
        {/* Upvote count */}
        <div className="flex items-center gap-1.5 text-[var(--ink-muted)] shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          <span className="text-sm font-semibold">{vote_count || 0}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[var(--ink)] font-semibold text-base leading-snug mb-3 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
        {title}
      </h3>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border)]">
        <span className="text-xs text-[var(--ink-muted)]">
          by <span className="font-medium text-[var(--ink)]">{users?.username || 'Anonymous'}</span>
        </span>
        <Link
          href={`/questions/${id}`}
          className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
        >
          View question
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
