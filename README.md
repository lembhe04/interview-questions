
# 📚 Interview Question Bank

A full-stack web application for browsing, submitting, searching, and upvoting interview questions from top tech companies. Built with Next.js 14, Supabase, and Tailwind CSS.

## ✨ Features

- **Authentication** — Sign up, log in, log out via Supabase Auth
- **Browse Questions** — Filter by company, topic, and difficulty
- **Search** — Full-text search across question titles
- **Submit Questions** — Authenticated users can share interview questions
- **Question Detail** — Full question and answer with upvoting
- **Upvoting** — One vote per user per question (toggle)
- **User Profile** — Stats and list of submitted questions
- **Responsive** — Works on mobile, tablet, and desktop

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Styling | Tailwind CSS |
| Hosting | Vercel |

## 📁 Project Structure

```
interview-question-bank/
├── app/
│   ├── auth/
│   │   └── page.js              # Sign up / Sign in page
│   ├── questions/
│   │   └── [id]/
│   │       └── page.js          # Question detail page
│   ├── submit/
│   │   └── page.js              # Submit question form
│   ├── profile/
│   │   └── page.js              # User profile page
│   ├── globals.css              # Global styles + design tokens
│   ├── layout.js                # Root layout with Navbar
│   ├── not-found.js             # 404 page
│   └── page.js                  # Home page (browse + filters)
├── components/
│   ├── DifficultyBadge.js       # Colored difficulty pill
│   ├── HomeFilters.js           # Search + filter controls
│   ├── Navbar.js                # Top navigation bar
│   ├── QuestionCard.js          # Question card for grid
│   └── UpvoteButton.js          # Interactive upvote button
├── lib/
│   └── supabase/
│       ├── client.js            # Browser Supabase client
│       ├── middleware.js        # Middleware session helper
│       └── server.js            # Server Supabase client
├── supabase/
│   └── schema.sql               # PostgreSQL schema + RLS policies
├── middleware.js                # Next.js middleware (auth guard)
├── .env.local.example           # Environment variables template
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (optional, for deployment)

---

### Step 1 — Clone and Install

```bash
git clone <your-repo-url>
cd interview-question-bank
npm install
```

---

### Step 2 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Choose your organization, name your project, set a database password

---

### Step 3 — Run the SQL Schema

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it into the editor and click **"Run"**

This creates:
- `users` table
- `questions` table  
- `votes` table
- All indexes
- Row Level Security (RLS) policies

---

### Step 4 — Get Your Supabase Keys

1. In your Supabase project, go to **Settings → API**
2. Copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public key** (long JWT string)

---

### Step 5 — Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### Step 6 — Configure Supabase Auth

1. In Supabase dashboard, go to **Authentication → URL Configuration**
2. Set **Site URL** to:
   - Local development: `http://localhost:3000`
   - Production: `https://your-app.vercel.app`
3. Add to **Redirect URLs**:
   - `http://localhost:3000/**`
   - `https://your-app.vercel.app/**`

---

### Step 7 — Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the home page!

---


## 🔐 Authentication Flow

1. User signs up → Supabase creates `auth.users` entry + we create `public.users` entry with username
2. User signs in → Supabase issues JWT session cookie
3. Middleware refreshes session on every request
4. `/submit` and `/profile` are protected — unauthenticated users are redirected to `/auth`

## 🗄 Database Schema

```sql
users
  id          UUID (FK → auth.users)
  email       TEXT
  username    TEXT (unique)
  created_at  TIMESTAMPTZ

questions
  id          UUID (PK)
  title       TEXT
  question    TEXT
  answer      TEXT
  company     TEXT
  topic       TEXT
  difficulty  TEXT (Easy|Medium|Hard)
  user_id     UUID (FK → users)
  created_at  TIMESTAMPTZ

votes
  id           UUID (PK)
  user_id      UUID (FK → users)
  question_id  UUID (FK → questions)
  created_at   TIMESTAMPTZ
  UNIQUE(user_id, question_id)
```



## 📝 Notes

- The `public.users` table is separate from `auth.users` — it stores the public-facing profile data (username)
- Votes use a `UNIQUE(user_id, question_id)` constraint to enforce one-vote-per-user at the database level
- All tables use Row Level Security (RLS) — public data is readable by everyone, writes require authentication
- The `vote_count` is computed client-side by counting related vote rows (no denormalized counter needed at this scale)


