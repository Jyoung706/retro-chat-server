# Build Stage
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Production Stage
FROM node:18-alpine

WORKDIR /usr/src/app

RUN yarn global add pm2

COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=builder /usr/src/app/dist ./dist
COPY ecosystem.config.js .

USER node

EXPOSE 3001

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
