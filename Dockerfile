FROM oven/bun:1-alpine
WORKDIR /app
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile
COPY . .
RUN apk add --no-cache git
ENV PORT=3000
ENV HOST=0.0.0.0
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "start"]
