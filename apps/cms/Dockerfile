# syntax=docker/dockerfile:1
# Build context = repo root:  docker build -f apps/cms/Dockerfile -t x-cms .
# Payload CMS: admin + REST/GraphQL API + the chat backend (owns provider keys).

FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

# ---- deps: install the whole workspace (cached on manifest changes) ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/cms/package.json ./apps/cms/
COPY apps/clay/package.json ./apps/clay/
COPY apps/web/package.json ./apps/web/
COPY packages ./packages
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ---- builder: build only the CMS (standalone output) ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .
# Payload reads env at build via fallbacks; no DB connection is needed to build.
RUN pnpm --filter @x/cms build

# ---- runner: minimal standalone server ----
FROM base AS runner
ENV NODE_ENV=production
RUN useradd -m -u 1001 nodejs
COPY --from=builder --chown=nodejs:nodejs /app/apps/cms/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/apps/cms/.next/static ./apps/cms/.next/static
COPY --from=builder --chown=nodejs:nodejs /app/apps/cms/public ./apps/cms/public
USER nodejs
ENV PORT=3000
EXPOSE 3000
CMD ["node", "apps/cms/server.js"]
