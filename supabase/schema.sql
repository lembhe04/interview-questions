-- ============================================================
-- Interview Question Bank — Supabase SQL Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Users table (mirrors auth.users with public profile data)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  company TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Votes table (one vote per user per question)
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, question_id)
);

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS questions_user_id_idx ON public.questions(user_id);
CREATE INDEX IF NOT EXISTS questions_company_idx ON public.questions(company);
CREATE INDEX IF NOT EXISTS questions_topic_idx ON public.questions(topic);
CREATE INDEX IF NOT EXISTS questions_difficulty_idx ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS questions_created_at_idx ON public.questions(created_at DESC);
CREATE INDEX IF NOT EXISTS votes_question_id_idx ON public.votes(question_id);
CREATE INDEX IF NOT EXISTS votes_user_id_idx ON public.votes(user_id);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- USERS policies
CREATE POLICY "Users are viewable by everyone"
  ON public.users FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- QUESTIONS policies
CREATE POLICY "Questions are viewable by everyone"
  ON public.questions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert questions"
  ON public.questions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questions"
  ON public.questions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own questions"
  ON public.questions FOR DELETE USING (auth.uid() = user_id);

-- VOTES policies
CREATE POLICY "Votes are viewable by everyone"
  ON public.votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own votes"
  ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- Seed data (optional — remove if not needed)
-- ============================================================
-- NOTE: To use seed data, first create a user via the app,
-- then replace 'YOUR_USER_ID_HERE' with the actual UUID from
-- the auth.users table.

-- Example (uncomment and fill in real UUID after signing up):
/*
INSERT INTO public.questions (title, question, answer, company, topic, difficulty, user_id)
VALUES
(
  'Two Sum',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
  'Use a hash map. For each element, check if (target - element) exists in the map. If yes, return both indices. If not, add the element to the map. Time: O(n), Space: O(n).\n\n```python\ndef twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n```',
  'Google',
  'Hashing',
  'Easy',
  'YOUR_USER_ID_HERE'
),
(
  'Design a URL Shortener',
  'Design a URL shortening service like bit.ly. Cover the API design, database schema, and how you would handle high throughput.',
  'Key components:\n1. API: POST /shorten (returns short_url), GET /{code} (redirects)\n2. DB: urls table with id, original_url, short_code, user_id, created_at, clicks\n3. Short code generation: base62 encode a counter or random 6-char string\n4. Caching: Redis for hot URLs (LRU cache)\n5. Scale: Read-heavy system, use CDN + read replicas\n6. Rate limiting on creation endpoint',
  'Amazon',
  'System Design',
  'Medium',
  'YOUR_USER_ID_HERE'
);
*/
