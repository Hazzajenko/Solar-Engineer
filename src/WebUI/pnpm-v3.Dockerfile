FROM node:16-alpine AS base
ARG PNPM_VERSION=6.14.3
RUN npm --global install pnpm@${PNPM_VERSION}
WORKDIR /app

FROM base AS dev
COPY ./pnpm-lock.yaml .
RUN pnpm fetch
COPY . .
RUN pnpm update
RUN pnpm install --frozen-lockfile --unsafe-perm
RUN pnpm m run build
#RUN pnpm build --filter "@mono/api^..."
#RUN pnpm test --if-present --filter "@mono/api"
#RUN pnpm build --filter "@mono/api"

#WORKDIR /app/apps/api
#ENTRYPOINT ["pnpm", "build:start"]

FROM nginx as runtime
COPY --from=base /app/dist/apps/design-app /usr/share/nginx/html
COPY ["./conf/default.conf","/etc/nginx/conf.d/default.conf"]