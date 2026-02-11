# kickstart-stack

Full-stack project template for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Scaffolds a complete monorepo with a single command and lets you add features incrementally.

## Tech Stack

- **API**: Fastify + TypeScript + Prisma (PostgreSQL)
- **Web**: Next.js 14 + Tailwind CSS + SWR
- **i18n**: next-intl (EN, FR, IT) with hybrid routing
- **Infrastructure**: Docker Compose + Caddy reverse proxy
- **Monorepo**: pnpm workspaces + Turborepo

## Quick Start

Make sure you have [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed, then:

```
/kickstart
```

Claude will ask you for:
1. **Project name** (kebab-case, e.g. `my-saas-app`)
2. **Description**
3. **Which features** to include (auth, darkmode, jobs, email, upload, hosting)
4. **Variables** for selected features (domain, server IP, etc.)

It then scaffolds the full project, installs dependencies, runs migrations, and starts the dev environment.

## Features

Features are modular add-ons. Pick the ones you need during `/kickstart`, or add them later with `/add-feature`.

| Feature | Description |
|---------|-------------|
| **auth** | JWT email/password authentication with login/signup pages, Zustand state management |
| **darkmode** | Dark mode with system preference detection and manual toggle |
| **jobs** | Background job processing with Redis and BullMQ queues |
| **email** | Transactional email sending via Mailjet |
| **upload** | File upload and storage via S3-compatible object storage |
| **hosting** | Production deployment to a VPS with Docker, Caddy SSL, and deploy script |

### Adding a Feature to an Existing Project

```
/add-feature
```

Claude reads `kickstart.json`, shows available features, applies the selected one (copies files, installs dependencies, applies patches, merges CLAUDE.md instructions).

## How Features Work

Each feature is a self-contained directory under `features/`:

```
features/auth/
├── feature.json    # Manifest: dependencies, files to copy, patches to apply, env vars
├── claude.md       # Instructions merged into project CLAUDE.md
├── api/            # Backend code (copied to apps/api/)
├── web/            # Frontend code (copied to apps/web/)
├── shared/         # Shared types (copied to packages/shared/)
└── messages/       # i18n translations (copied to apps/web/messages/)
```

**`feature.json`** defines:
- **dependencies** — npm packages to install per workspace
- **files.copy** — source → destination file mappings
- **patches** — existing files that need modifications (Claude applies these intelligently)
- **envVars** — environment variables to add to `.env`
- **claudeMd** — instructions appended to the project's CLAUDE.md

## Project Structure

After scaffolding, the generated project looks like:

```
my-project/
├── apps/
│   ├── api/              # Fastify backend
│   │   ├── src/
│   │   │   ├── routes/   # API routes
│   │   │   ├── plugins/  # Fastify plugins
│   │   │   ├── services/ # Business logic
│   │   │   └── server.ts # Entry point
│   │   └── prisma/       # Database schema & migrations
│   └── web/              # Next.js frontend
│       ├── src/
│       │   ├── app/      # App router pages
│       │   ├── components/
│       │   └── hooks/
│       └── messages/     # i18n translations
├── packages/
│   └── shared/           # Shared types and utilities
├── Caddyfile             # Reverse proxy config
├── docker-compose.yml    # Production
├── docker-compose.dev.yml # Development (hot reload)
├── CLAUDE.md             # Agent instructions
└── SPRINT.md             # Task tracking
```

All traffic goes through Caddy on a single port:

| Path | Destination |
|------|-------------|
| `/` | Next.js |
| `/app/*` | Next.js (protected) |
| `/api/*` | Fastify API |
| `/ws/*` | Fastify WebSocket |

## Development

Everything runs in Docker:

```bash
# Start with hot reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Database migrations
docker compose exec api npx prisma migrate dev --name migration_name

# Rebuild after dependency changes
docker compose build && docker compose up -d
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (for `/kickstart` and `/add-feature`)
- [pnpm](https://pnpm.io/) (used inside Docker, optional locally)

## Related

- **[claude-skills](https://github.com/antoinedc/claude-skills)** — Global Claude Code configuration (commands, skills, permissions). Install it for the best experience with kickstart-stack.
