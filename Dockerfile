FROM oven/bun:1-alpine
WORKDIR /app
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "start"]
