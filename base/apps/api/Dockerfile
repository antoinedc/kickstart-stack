FROM node:20-alpine AS base

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY turbo.json ./

# Copy package.json files for all workspaces
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Generate Prisma client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build shared package and api
WORKDIR /app
RUN pnpm --filter @{{PROJECT_NAME}}/shared build
RUN pnpm --filter @{{PROJECT_NAME}}/api build

# Production image
FROM node:20-alpine AS runner

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy built artifacts
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-workspace.yaml ./
COPY --from=base /app/pnpm-lock.yaml ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/api/package.json ./apps/api/
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=base /app/apps/api/prisma ./apps/api/prisma
COPY --from=base /app/packages/shared/package.json ./packages/shared/
COPY --from=base /app/packages/shared/dist ./packages/shared/dist
COPY --from=base /app/packages/shared/node_modules ./packages/shared/node_modules

WORKDIR /app/apps/api

EXPOSE 6001

CMD ["node", "dist/server.js"]
