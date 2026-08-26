FROM node:26.5-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM node:26.5-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:26.5-alpine AS prod-deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

FROM node:26.5-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle
COPY package.json ./package.json

USER node

EXPOSE 3000

CMD ["node", "dist/main"]