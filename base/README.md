# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## Quick Start

```bash
# Start development environment
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Open in browser
open http://localhost
```

## Tech Stack

- **API**: Fastify + TypeScript + Prisma
- **Web**: Next.js 14 + Tailwind CSS
- **Database**: PostgreSQL
- **Proxy**: Caddy (single port, auto-SSL)
- **i18n**: English, French, Italian

## Development

All development happens through Docker. See [CLAUDE.md](./CLAUDE.md) for detailed instructions.

```bash
# Hot reload development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Database migrations
docker compose exec api npx prisma migrate dev --name migration_name

# Rebuild after dependency changes
docker compose build && docker compose up -d
```
