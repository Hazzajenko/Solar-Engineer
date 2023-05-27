FROM node:14-buster AS pnpm-installed
ARG PNPM_VERSION=6.9.1
RUN npm install -g pnpm@${PNPM_VERSION}
WORKDIR /app

FROM pnpm-installed AS prod-deps-installed
COPY ./pnpm-lock.yaml .npmrc ./
RUN pnpm fetch --prod

FROM prod-deps-installed AS dev
RUN pnpm fetch
COPY . ./
RUN pnpm update
RUN pnpm recursive install --offline --frozen-lockfile
RUN pnpm m run build
ENTRYPOINT ["/bin/bash", "-c"]
CMD ["node"]

FROM dev AS assets
RUN pnpm recursive exec -- rm -rf ./node_modules

FROM nginx as runtime
COPY --from=assets /app/dist/apps/design-app /usr/share/nginx/html
COPY ["./conf/default.conf","/etc/nginx/conf.d/default.conf"]

#FROM prod-deps-installed
#COPY --from=assets /app .