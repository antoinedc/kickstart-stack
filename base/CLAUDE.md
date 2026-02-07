# CLAUDE.md

## Project Overview
{{PROJECT_DESCRIPTION}}

## Monorepo Structure

```
{{PROJECT_NAME}}/
├── apps/
│   ├── api/        # Fastify backend
│   └── web/        # Next.js frontend
├── packages/
│   └── shared/     # Shared types and utilities
```

## Commands

### Local Development
```bash
# Start with hot reload (RECOMMENDED for development)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Start production build (no hot reload)
docker-compose up

# Rebuild and restart (only needed for dependency changes)
docker-compose build && docker-compose up -d

# View logs
docker-compose logs -f api       # API only

# Database migrations
docker-compose exec api npx prisma migrate dev --name migration_name
```

**IMPORTANT: Always use Docker for development.** Never run services outside Docker.
- Hot reload mode: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up`
- Changes to `apps/web/src`, `apps/api/src`, `packages/shared/src` reflect instantly (no restart needed)
- API uses tsx watch - auto-restarts on file changes
- Only rebuild when dependencies change (package.json, pnpm-lock.yaml)

### Production Build Check

**IMPORTANT: Before deploying, always verify the build locally:**
```bash
pnpm --filter @{{PROJECT_NAME}}/api build
pnpm --filter @{{PROJECT_NAME}}/web build
```

## Architecture

### Key Technologies
- **Database**: PostgreSQL + Prisma
- **API**: Fastify + TypeScript
- **Web**: Next.js 14, Tailwind CSS, SWR, next-intl (EN/FR/IT)
- **Docker**: Multi-env (dev hot-reload, prod standalone)
- **Reverse Proxy**: Caddy (single port, no CORS)

### Caddy Reverse Proxy Architecture

All traffic goes through Caddy on port 80/443:

| Path | Destination | Description |
|------|-------------|-------------|
| `/` | Next.js | Homepage |
| `/app/*` | Next.js | Dashboard (protected) |
| `/login`, `/signup` | Next.js | Auth pages |
| `/api/*` | Fastify API (6001) | REST API |
| `/ws/*` | Fastify API (6001) | WebSocket connections |

### Internationalization (i18n)

All apps support EN, FR, IT locales.

**Hybrid locale routing (web):**
- **Marketing pages** (`/`): URL-based locale via next-intl for SEO (`/fr/pricing`)
- **App/auth routes** (`/app/*`, `/login`, `/signup`): localStorage-based locale via `LocaleProvider`
- `localeDetection: false` — no auto-redirect based on browser `Accept-Language`
- Default locale (EN) has no URL prefix; FR/IT get `/fr/`, `/it/` prefix

**Usage patterns:**
- Marketing (server): `const t = await getTranslations('namespace')`
- Marketing (client): `const t = useTranslations('namespace')` + `import { Link } from '@/i18n/routing'`
- App/auth (client): `const t = useTranslations('namespace')` + `import Link from 'next/link'`
- App locale access: `const { locale, setLocale } = useAppLocale()`

**API error handling:**
- Shared error codes in `packages/shared/src/errors.ts`
- API returns `{ error: string, code: ErrorCode }` — never hardcoded English strings
- Web frontend maps codes to translations via `errors.json` files: `tErrors(getErrorCode(err))`

**Adding translations:**
1. Add keys to `messages/en/*.json` first
2. Copy structure to `fr/` and `it/` with translated values
3. Use `t('key')` or `t.rich('key', { component: (chunks) => <Tag>{chunks}</Tag> })` for embedded components

## Conventions

### Code Style
- TypeScript strict mode everywhere
- Functional components in React
- Zod for runtime validation
- Keep files small and focused
- **All user-facing text MUST be internationalized** - never hardcode strings in components

### Naming
- Components: PascalCase (`TranscriptFeed.tsx`)
- Utilities: camelCase (`formatTimestamp.ts`)
- Types: PascalCase, no `I` prefix (`Session`, not `ISession`)
- Constants: SCREAMING_SNAKE_CASE

### File Organization
- Group by feature, not by type
- Avoid barrel exports (bundle size)

### Commits
- Format: `type(scope): description`
  - Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
  - Scope: `web`, `api`, `shared`
- Commit early and often
- Push to GitHub after committing

## Testing
- Unit tests: Vitest
- Health endpoint: `/api/health`
