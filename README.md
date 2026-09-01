# MarkAI — AI Social Media Content Generator & Instagram Auto-Poster

> **Hackathon MVP for College Pitch Competition (September 9, 2026)**
> Single end-to-end flow: **Business Profile -> Anthropic Claude Generation -> Branded Creative Graphic -> 1-Click Instagram Posting -> Supabase History**

---

## 🚀 Live Demo & Presentation Quick Start

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Pitch Demo Walkthrough (1-Minute Flow)
1. **Instant Demo Login**: On the `/login` screen, click **"Instant Pitch Demo Login"** (bypasses credential setup for instant evaluator testing).
2. **Select Demo Preset**: On `/dashboard`, click **"☕ Brew & Bean"** (or FitPulse / GlowLab) to instantly populate realistic small business parameters.
3. **Generate Post**: Click **"Generate AI Post & Branded Graphic"** (Claude API crafts copy, hashtags, and visual concept).
4. **Preview & Edit**: On `/preview`, observe the generated copy, live character count, theme headline, and interact with the **HTML5 Canvas Graphic Generator** to test color themes.
5. **Post to Instagram**: Click **"Post to Instagram"** — watch container creation, publishing, and celebratory confetti effect.
6. **Track History**: Click **"View Post History"** to verify the post logged in Supabase with status `Posted` and Instagram Media ID.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js (Pages Router) + Tailwind CSS | Fast SSR/CSR, sleek dark modern UI, responsive cockpit |
| **Auth** | Firebase Auth (Email/Password) | Secure authentication with instant demo session fallback |
| **Database** | Supabase (Postgres) | Stores `business_profiles` and `posts` history table |
| **AI Content** | Anthropic Claude API (`claude-3-5-sonnet-20241022`) | System + user prompt for caption, hashtags, and hooks |
| **Creative Graphic** | HTML5 Canvas Client-Side Engine | 1080x1080 high-res branded text-overlay graphics (no external image API required) |
| **Social Posting** | Meta Graph API (Instagram Content Publishing) | Publishes image + caption to Instagram Business account |

---

## ⚙️ Environment Variables & Manual Setup Guide

Create a `.env.local` file in the root directory:

```env
# Anthropic API (Server-side)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Firebase Auth (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:12345:web:abcd

# Supabase Postgres
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Meta Graph API (Instagram Content Publishing)
META_ACCESS_TOKEN=EAA...
INSTAGRAM_ACCOUNT_ID=1784140...
```

### Manual Service Setup Instructions:

#### A. Anthropic API
1. Sign up at [console.anthropic.com](https://console.anthropic.com).
2. Generate an API Key with model access to `claude-3-5-sonnet-20241022` or `claude-3-haiku-20240307`.
3. Set `ANTHROPIC_API_KEY` in `.env.local`.

#### B. Firebase Auth
1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication** -> **Sign-in method** -> **Email/Password**.
3. Register a Web App and copy the config into `.env.local`.

#### C. Supabase Postgres
1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to **SQL Editor** and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
3. Copy the Project URL & Anon Key into `.env.local`.

#### D. Meta Graph API (Instagram Business)
1. Go to [developers.facebook.com](https://developers.facebook.com) and create a Business App.
2. Connect your Facebook Page and linked **Instagram Professional/Business Account**.
3. Request standard permissions: `pages_show_list`, `instagram_basic`, `instagram_content_publish`.
4. In Graph API Explorer, generate a **Page/User Access Token** and copy the `INSTAGRAM_ACCOUNT_ID`.
5. Set `META_ACCESS_TOKEN` and `INSTAGRAM_ACCOUNT_ID` in `.env.local`.

---

## 🛡 Pitch Competition Sandbox & Fallback Design

To guarantee **100% demo reliability** during live presentation without fear of network errors, rate limits, or Meta token expirations:
- **Zero-Crash Demo Fallbacks**: If any API key is unset or unavailable, MarkAI automatically switches to its **Smart Sandbox Mode** with realistic latency and authentic output structures.
- **Health Monitor**: Click the **"Services"** button in the navigation bar to inspect real-time connection state for all 4 external integrations.
- **Client Canvas Graphics**: Generates 1080x1080 crisp PNGs locally without relying on expensive/slow external image generation APIs.
