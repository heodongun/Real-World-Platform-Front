# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 14 (App Router) + TypeScript frontend for a real-world coding challenge platform. Communicates with backend API at `coding-platform-backend` for authentication, problem browsing, code submission, and leaderboard features.

## Essential Commands

```bash
# Development
npm install              # Install dependencies (first time)
npm run dev             # Start dev server at http://localhost:3000
npm run lint            # Run ESLint
npm run build           # Production build
npm start               # Start production server

# Docker
docker build -t coding-platform-frontend .
docker run --env-file .env -p 3100:3000 coding-platform-frontend
```

## Environment Configuration

Two environment files control API routing:

- `.env` - Docker/deployment settings (both variables required)
- `.env.local` - Local development overrides

**Required variables:**
- `NEXT_PUBLIC_API_BASE_URL` - Browser-side API calls (client components)
- `SERVER_API_BASE_URL` - Server-side API calls (SSR/SSG)

**Important:** `src/lib/config.ts` resolves API URLs differently for server vs browser contexts using `typeof window === 'undefined'` check.

## Architecture

### API Communication Pattern

All backend communication flows through `src/lib/api.ts` which wraps `fetch` with:
- Automatic Bearer token injection from `token` parameter
- Query string building from `query` object
- JSON parsing and error handling via `ApiError` class
- Next.js caching controls (`next.revalidate`, `cache`)

**Key principle:** Server Components fetch at build/request time with revalidation. Client Components use `useAuth()` token for authenticated requests.

### Authentication Flow

1. User logs in/registers → backend returns `{ token, user }`
2. `AuthProvider` stores session in `localStorage` under `'coding-platform-session'`
3. On mount, `AuthProvider` hydrates from storage and exposes via `useAuth()` hook
4. Protected pages check `useAuth().user` and redirect if null
5. API calls pass `token` from `useAuth()` to `apiFetch()`

**Critical:** All authenticated API functions require `token` as first parameter (see `src/lib/api.ts:125-149`).

### Type System

`src/lib/types.ts` defines all backend DTOs. When backend schema changes:
1. Update type definitions first
2. Update API functions if endpoints changed
3. Update components consuming the data

**Key types:**
- `User`, `Problem`, `Submission` - Core domain models
- `AuthResponse` - Login/register response with token
- `ExecutionResult` - Instant code execution results
- `SubmissionFeedback` - Test results with coverage

### Component Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Landing page
│   ├── problems/          # Problem list + detail pages
│   ├── submissions/       # Submission history
│   ├── dashboard/         # Stats and leaderboard
│   ├── login/            # Auth pages
│   └── register/
├── components/
│   ├── auth/             # Login/register forms
│   ├── editor/           # Monaco Editor wrapper
│   ├── problems/         # Problem cards, detail view, instant execution
│   ├── submissions/      # Submission table
│   ├── dashboard/        # Stats cards, leaderboard
│   ├── layout/           # Navbar, Footer
│   ├── providers/        # AuthProvider context
│   └── ui/               # Reusable components (button, input, textarea)
├── lib/
│   ├── api.ts            # All backend API calls
│   ├── config.ts         # API URL resolution, error classes
│   ├── types.ts          # TypeScript definitions for backend DTOs
│   └── utils.ts          # UI utilities (cn for className merging)
```

**Pattern:** Each feature has a `*-client.tsx` component for client-side logic and page files use Server Components where possible.

### Monaco Editor Integration

`src/components/editor/code-editor.tsx` uses `@monaco-editor/react` with:
- Language-specific syntax highlighting (Python, Java, Kotlin)
- Auto-sizing based on line count
- Two modes: `edit` (with starter code) and `execute` (instant run)
- File support for multi-file submissions via `files` prop

**Important:** Monaco is client-side only - wrap in dynamic import with `ssr: false` if needed elsewhere.

## Common Workflows

### Adding a New API Endpoint

1. Add type definitions to `src/lib/types.ts`
2. Create API function in `src/lib/api.ts` using `apiFetch`
3. Determine if authenticated (needs `token` parameter)
4. Set appropriate cache strategy (`next.revalidate` or `cache: 'no-store'`)
5. Use in component with proper error handling

### Creating a New Page

1. Create route in `src/app/[route]/page.tsx`
2. Use Server Component for initial data fetching if possible
3. Extract client logic to `src/components/[feature]/[feature]-client.tsx`
4. Import and use in page: `import Client from '@/components/[feature]/[feature]-client'`
5. Add navigation link in `src/components/layout/navbar.tsx` if needed

### Working with Protected Routes

Check authentication in page or component:
```tsx
const { user, token } = useAuth();
if (!user) redirect('/login');
```

For API calls requiring auth:
```tsx
const data = await fetchSubmissions(token!);
```

## Testing Backend Connection

1. Ensure backend is running (check with `curl http://localhost:8080/health`)
2. Verify environment variables in `.env.local` point to correct API
3. Check browser DevTools Network tab for API call status
4. Dashboard `/dashboard` page shows health status as quick test
5. Problems page `/problems` displays cards if API connection works

## Key Dependencies

- **Next.js 16** - App Router with React 19 Server Components
- **@monaco-editor/react** - Code editor component
- **Tailwind CSS 4** - Styling with PostCSS plugin
- **TypeScript 5** - Strict mode enabled

## Path Aliases

`@/*` resolves to `src/*` via `tsconfig.json` paths. Always use `@/lib/api` not `../../../lib/api`.

## Development Notes

- All components use React 19's `'use client'` directive where needed
- API base URL resolution handles SSR vs browser contexts automatically
- Monaco Editor requires client-side rendering
- Authentication state persists across page reloads via localStorage
- Form submissions use native FormData where possible for progressive enhancement
