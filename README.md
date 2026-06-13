md# AgencyPro — Marketing Agency Management Platform

A modern, production-ready SaaS platform built for marketing agencies to manage leads, track calls, and monitor performance through an intuitive dashboard.

## 🚀 Live Demo
[https://agency-platform-lyart.vercel.app/login](https://agency-platform-lyart.vercel.app/login)

## 📌 Features

- **Authentication** — Secure Login, Signup, and Password Reset
- **Lead Management** — Add, search, filter and delete leads
- **AI Lead Scoring** — Analyze leads with Groq AI (LLaMA 3.3)
- **Call Logging** — Track all client calls with status and notes
- **CRM Pipeline** — Kanban-style board to move leads through stages
- **Analytics Dashboard** — Real-time charts showing leads and calls by month
- **Dark / Light Mode** — Full theme toggle support
- **Responsive Design** — Works on mobile, tablet, and desktop

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database + Auth | Supabase (PostgreSQL) |
| UI Components | shadcn/ui + Tailwind CSS |
| Charts | Recharts |
| AI Scoring | Groq API (LLaMA 3.3 70B) |
| Deployment | Vercel |
| Icons | Lucide React |

## 📁 Project Structure
agency-platform/

├── app/

│   ├── dashboard/

│   │   ├── page.tsx         # Analytics dashboard

│   │   ├── leads/page.tsx   # Lead management

│   │   ├── calls/page.tsx   # Call logging

│   │   ├── crm/page.tsx     # CRM pipeline

│   │   └── layout.tsx       # Dashboard layout

│   ├── login/page.tsx

│   ├── signup/page.tsx

│   ├── reset-password/page.tsx

│   └── api/

│       └── analyze-lead/route.ts  # AI scoring endpoint

├── components/

│   ├── Sidebar.tsx

│   ├── ThemeToggle.tsx

│   └── ThemeProvider.tsx

└── lib/

└── supabase.ts

## 🗄️ Database Schema

```sql
-- Leads table
create table leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  phone text,
  company text,
  status text default 'new',
  source text,
  notes text,
  created_at timestamp default now()
);

-- Calls table
create table calls (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references leads(id),
  lead_name text,
  duration text,
  notes text,
  status text default 'completed',
  created_at timestamp default now()
);
```

## ⚙️ Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/agency-platform.git
cd agency-platform
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables — create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

4. Run the development server
```bash
npm run dev
```

## 🤖 AI Tools Used

- **Claude (Anthropic)** — Code generation, debugging, architecture planning
- **Groq API** — AI lead scoring using LLaMA 3.3 70B model

## 👩‍💻 Built By

Trisita — B.Tech Computer Science (AI/ML), Roorkee Institute of Technology