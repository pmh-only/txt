FROM alpine:3 AS pnpm

WORKDIR /app

RUN apk add --no-cache nodejs npm
RUN npm i -g pnpm

#-

FROM pnpm AS build

COPY ./package.json ./pnpm-lock.yaml /app/
RUN pnpm i

COPY . /app/
RUN pnpm build

#-

FROM pnpm AS deps

WORKDIR /app

RUN apk add --no-cache nodejs npm
RUN npm i -g pnpm

COPY ./package.json ./pnpm-lock.yaml /app/
RUN pnpm i -P

#-

FROM alpine:3 AS runtime

WORKDIR /app

RUN apk add --no-cache nodejs

USER 1000:1000

COPY --chown=1000:1000 --from=deps /app/node_modules/ /app/node_modules/
COPY --chown=1000:1000 --from=build /app/build/ /app/build/
COPY --chown=1000:1000 ./migrations/ /app/migrations/

CMD ["node", "build"]
