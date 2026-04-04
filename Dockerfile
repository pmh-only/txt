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

COPY --from=deps /app/node_modules/ /app/node_modules/
COPY --from=build /app/build/ /app/build/

CMD ["node", "build"]
