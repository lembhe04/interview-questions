'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'

export default function HomeFilters({ companies, topics, currentSearch, currentCompany, currentTopic, currentDifficulty }) {
  const router = useRouter()
  const [search, setSearch] = useState(currentSearch)

  const updateFilters = useCallback((updates) => {
    const params = new URLSearchParams()
    const current = {
      search: currentSearch,
      company: currentCompany,
      topic: currentTopic,
      difficulty: currentDifficulty,
      ...updates,
    }
    Object.entries(current).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    router.push(`/?${params.toString()}`)
  }, [currentSearch, currentCompany, currentTopic, currentDifficulty, router])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    updateFilters({ search })
  }

  const difficulties = ['Easy', 'Medium', 'Hard']

  return (
    <div className="mb-8 space-y-4">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button type="submit" className="btn-primary px-6">Search</button>
      </form>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {/* Company filter */}
        <select
          value={currentCompany}
          onChange={e => updateFilters({ company: e.target.value })}
          className="input w-auto min-w-[130px] text-sm py-2 cursor-pointer"
        >
          <option value="">All Companies</option>
          {companies.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Topic filter */}
        <select
          value={currentTopic}
          onChange={e => updateFilters({ topic: e.target.value })}
          className="input w-auto min-w-[120px] text-sm py-2 cursor-pointer"
        >
          <option value="">All Topics</option>
          {topics.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Difficulty pills */}
        <div className="flex gap-1.5">
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => updateFilters({ difficulty: currentDifficulty === d ? '' : d })}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                currentDifficulty === d
                  ? d === 'Easy'
                    ? 'bg-[var(--easy-bg)] text-[var(--easy)] border-[var(--easy)]'
                    : d === 'Medium'
                    ? 'bg-[var(--medium-bg)] text-[var(--medium)] border-[var(--medium)]'
                    : 'bg-[var(--hard-bg)] text-[var(--hard)] border-[var(--hard)]'
                  : 'bg-white border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--ink-muted)]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
