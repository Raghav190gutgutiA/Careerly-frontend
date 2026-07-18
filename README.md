# Careerly - Frontend

React + Vite + Tailwind + Framer Motion chat UI for the Careerly AI Career Assistant. Pairs with
the standalone [backend repo](../backend) (Express/MongoDB/Socket.IO) - connected only via REST +
Socket.IO, no shared code or build step between them.

## Features

- ChatGPT-style chat: real token-by-token streaming, Markdown + syntax highlighting, chat
  history, multiple conversations, quick actions with staged progress.
- Auth pages (login/register/guest) with premium animated UI.
- Resume upload with live progress, automatic AI analysis on completion.
- Rich animated result panels: job cards (with a real Apply Now link + Save), course cards
  (fully clickable through to the course), ATS score gauges, an interview question bank
  (labeled job-specific vs. generic role-based), a career roadmap timeline, a job prep plan, and
  a cover letter view.
- "Never a dead end" UX: role-dependent Quick Actions open a modal to pick a saved job, provide a
  job description (paste/upload/URL), or skip with just a target role - never a hard error for
  missing context.

## Prerequisites

- Node.js 18+
- The [backend](../backend) running (locally or deployed)

## Setup

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`. `VITE_API_BASE_URL`/`VITE_SOCKET_URL` are left unset by default
(see `.env.example`) - the app derives the backend URL from whatever host the page was loaded
from (`src/utils/constants.js`), so it works unmodified from `localhost`, `127.0.0.1`, or a
phone/tablet on the same WiFi hitting a LAN IP (pairs with the backend's CORS config, which
allows private LAN IPs in development). Set the env vars explicitly only when frontend and
backend live on different hosts - i.e. production.

## Deploying to Vercel

1. Vercel dashboard -> **Add New** -> **Project** -> import this repo (Vercel auto-detects the
   Vite preset; `vercel.json` adds the SPA rewrite React Router needs).
2. Add two environment variables (Project Settings -> Environment Variables) pointing at your
   deployed backend - these override the dev-only host auto-detection, which only works when
   frontend and backend share a host:
   - `VITE_API_BASE_URL` = `https://<your-backend>.onrender.com/api/v1`
   - `VITE_SOCKET_URL` = `https://<your-backend>.onrender.com`
3. Deploy. Then set the backend's `CLIENT_URL` env var (in Render) to this Vercel URL.

## Verifying it end-to-end

1. Open the deployed (or local) URL - lands on the Login page, no console CORS errors.
2. Click **Continue as Guest**.
3. Upload a resume (paperclip icon, or Sidebar -> Manage Resume) - watch live progress followed
   by an automatic resume analysis reply in chat.
4. Try the Quick Actions (Find Jobs, ATS Review, Improve Resume, Recommend Courses, Interview
   Prep, Cover Letter, Career Roadmap, Prep Plan) and free-text chat.
5. Reload the page - chat history, saved jobs, and your active resume persist.
