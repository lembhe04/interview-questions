'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const COMPANIES = [
  'Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Netflix',
  'Uber', 'Airbnb', 'Stripe', 'Twilio', 'Shopify', 'LinkedIn',
  'Twitter', 'Snap', 'Coinbase', 'Other'
]

const TOPICS = [
  'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs',
  'Dynamic Programming', 'System Design', 'Behavioral', 'SQL',
  'Recursion', 'Sorting', 'Hashing', 'Other'
]

export default function SubmitPage() {
  const [form, setForm] = useState({
    company: '',
    topic: '',
    difficulty: '',
    title: '',
    question: '',
    answer: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth?redirectTo=/submit')
      return
    }

    const { data, error } = await supabase.from('questions').insert({
      title: form.title,
      question: form.question,
      answer: form.answer,
      company: form.company,
      topic: form.topic,
      difficulty: form.difficulty,
      user_id: user.id,
    }).select().single()

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(`/questions/${data.id}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <Link href="/" className="text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] flex items-center gap-1.5 mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to questions
        </Link>
        <h1 className="section-title text-3xl mb-2">Submit a Question</h1>
        <p className="text-[var(--ink-muted)]">Share an interview question you've encountered. Help others prepare.</p>
      </div>

      <div className="card p-8">
        {error && (
          <div className="mb-6 p-4 bg-[var(--hard-bg)] text-[var(--hard)] rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row: Company + Topic */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Company *</label>
              <select name="company" value={form.company} onChange={handleChange} required className="input">
                <option value="">Select company</option>
                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Topic *</label>
              <select name="topic" value={form.topic} onChange={handleChange} required className="input">
                <option value="">Select topic</option>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="label">Difficulty *</label>
            <div className="flex gap-3">
              {['Easy', 'Medium', 'Hard'].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, difficulty: d }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                    form.difficulty === d
                      ? d === 'Easy'
                        ? 'bg-[var(--easy-bg)] text-[var(--easy)] border-[var(--easy)]'
                        : d === 'Medium'
                        ? 'bg-[var(--medium-bg)] text-[var(--medium)] border-[var(--medium)]'
                        : 'bg-[var(--hard-bg)] text-[var(--hard)] border-[var(--hard)]'
                      : 'border-[var(--border)] text-[var(--ink-muted)] bg-white hover:border-[var(--ink-muted)]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            {/* Hidden required input for difficulty */}
            <input type="text" name="difficulty" value={form.difficulty} required readOnly className="sr-only" />
          </div>

          {/* Title */}
          <div>
            <label className="label">Question Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Two Sum, Design a URL shortener..."
              required
              className="input"
            />
          </div>

          {/* Full Question */}
          <div>
            <label className="label">Full Question *</label>
            <textarea
              name="question"
              value={form.question}
              onChange={handleChange}
              placeholder="Paste or write the full interview question here..."
              required
              rows={5}
              className="input resize-none"
            />
          </div>

          {/* Answer */}
          <div>
            <label className="label">Your Answer / Solution *</label>
            <textarea
              name="answer"
              value={form.answer}
              onChange={handleChange}
              placeholder="Explain the approach, include code if relevant..."
              required
              rows={8}
              className="input resize-none font-mono text-sm"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Question'}
            </button>
            <Link href="/" className="btn-secondary px-6 py-3">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
