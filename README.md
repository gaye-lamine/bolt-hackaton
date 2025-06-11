# NOMAD AI – Local Micro-Business Companion

A complete Progressive Web App (PWA) that allows anyone to launch a local service micro-business in under 5 minutes using a conversational AI assistant.

## Main Features

- Smart onboarding with AI assistant: Chatbot that generates a personalized micro-business profile
- Automatic resource generation: Public profile page, message templates, recommended pricing
- Mobile-first dashboard: Manage services, clients, and availability
- PWA mode: Installable on mobile, works offline
- Passwordless authentication: Magic links via Supabase

## Tech Stack

- Frontend: React + TypeScript, Tailwind CSS, Vite
- Backend: Supabase (auth, database, functions)
- PWA: Service Worker, App Manifest
- Routing: React Router
- Icons: Lucide React

## Installation

1. Clone the project
```bash
git clone <repository-url>
cd nomad-ai-pwa
```

2. Install dependencies
```bash
npm install
```

3. Supabase configuration
   - Create a project on https://supabase.com
   - Copy `.env.example` to `.env`
   - Fill in the Supabase environment variables

4. Create the database schema
   - Go to the Supabase dashboard → SQL Editor
   - Run the content of `supabase/migrations/create_initial_schema.sql`

5. Start the dev server
```bash
npm run dev
```

## Supabase Production Configuration

### IMPORTANT: Redirect URLs Setup

1. Go to Supabase → Authentication → URL Configuration
2. Site URL: `https://hackaton-bolt.netlify.app`
3. Redirect URLs:
   ```
   https://hackaton-bolt.netlify.app/**
   https://hackaton-bolt.netlify.app/dashboard
   https://hackaton-bolt.netlify.app/auth
   https://hackaton-bolt.netlify.app/onboarding
   http://localhost:3000/**
   http://localhost:5173/**
   ```

## PWA Setup

- Installable: Automatic install prompt on mobile
- Offline-ready: Service worker caching
- App-like: Splash screen, icons, standalone mode

## Database Structure

- users: User profiles with skills and availability
- services: Services offered by each user
- clients: Client address book
- ai_conversations: History of AI assistant conversations

## AI Assistant

Uses a Q&A flow to:
- Collect user information
- Automatically generate service listings
- Create the public business profile
- Provide personalized recommendations

## Design System

- Colors: Purple (#8B5CF6), Teal (#14B8A6), Orange (#F97316)
- Typography: Consistent size scale
- Spacing: 8px grid system
- Responsive: Mobile-first with optimized breakpoints

## Security

- Row Level Security (RLS) enabled on all tables
- Authentication via Supabase Auth
- Policies: Users can only access their own data
- Public profiles: Read-only service pages

## Build & Deployment

```bash
npm run build
npm run preview
```

Deployable to:
- Vercel
- Netlify
- Supabase Hosting

## Development

### Component Structure
```
src/
├── components/
│   ├── Layout/
│   ├── UI/
│   └── Chat/
├── contexts/
├── hooks/
├── lib/
├── pages/
└── App.tsx
```

### Adding New Features

- New services: Extend the `services` table
- Analytics: Add a new `analytics` table
- Payments: Integrate Stripe
- Notifications: Add PWA push notifications

## Usage

1. Sign up: Magic link by email
2. Onboarding: AI assistant asks questions (~5 min)
3. Profile generated: Services and public page created
4. Share: Personalized URL at `/profile/username`
5. Manage: Dashboard for clients and services

## Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

## License

MIT License – see the LICENSE file for details.

---

NOMAD AI – Unleash your entrepreneurial potential!
