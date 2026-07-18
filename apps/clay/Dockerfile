# syntax=docker/dockerfile:1
# Build context = repo root:  docker build -f apps/clay/Dockerfile -t x-clay .
# Public site (Next.js). Proxies chat to the CMS; holds NO provider keys.

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

# ---- builder: build only clay (standalone output) ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .
RUN pnpm --filter @x/clay build

# ---- runner: minimal standalone server ----
FROM base AS runner
ENV NODE_ENV=production
RUN useradd -m -u 1001 nodejs
COPY --from=builder --chown=nodejs:nodejs /app/apps/clay/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/apps/clay/.next/static ./apps/clay/.next/static
COPY --from=builder --chown=nodejs:nodejs /app/apps/clay/public ./apps/clay/public
USER nodejs
ENV PORT=3000
EXPOSE 3000
CMD ["node", "apps/clay/server.js"]
