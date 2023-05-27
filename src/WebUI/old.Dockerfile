FROM node:14-alpine as build
WORKDIR /app

RUN npm install -g @angular/cli
RUN #npm install -g @nrwl/cli

COPY ./package.json .
RUN npm install
COPY . .
ENV NODE_ENV=production
RUN npx nx build design-app --configuration=production
# RUN npm run build

FROM nginx as runtime
COPY --from=build /app/dist/apps/design-app /usr/share/nginx/html
#COPY ["./conf/http.conf","/etc/nginx/conf.d/default.conf"]
COPY ["./conf/default.conf","/etc/nginx/conf.d/default.conf"]
#COPY ["./ssl/solarengineer_app.crt","/etc/ssl/certs/solarengineer_app.crt"]
#COPY ["./ssl/solarengineer_app.key","/etc/ssl/private/solarengineer_app.key"]

