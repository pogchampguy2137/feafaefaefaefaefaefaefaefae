FROM oven/bun:1.1.18 as build

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .

FROM oven/bun:1.1.18-alpine

WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/bun.lockb ./bun.lockb
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src

EXPOSE 3002

CMD ["bun", "run", "src/index.js"]