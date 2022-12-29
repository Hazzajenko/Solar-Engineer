FROM node:14-alpine as build
WORKDIR /app

RUN npm install -g @angular/cli
RUN npm install -g @nrwl/cli

COPY ./package.json .
RUN npm install
COPY . .
ENV NODE_ENV=production
RUN npx nx build design --configuration=production
# RUN npm run build

FROM nginx as runtime
COPY --from=build /app/dist/apps/design /usr/share/nginx/html
COPY ["./conf/default.conf","/etc/nginx/conf.d/default.conf"]
