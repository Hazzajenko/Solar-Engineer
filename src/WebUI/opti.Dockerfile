#FROM node:14-alpine as build
FROM nginx as runtime
WORKDIR /app
COPY /dist/apps/design-app /usr/share/nginx/html
#ENV PORT=80
#EXPOSE ${PORT}
#RUN npm install --production
## dependencies that nestjs needs
#RUN npm install reflect-metadata tslib rxjs @nestjs/platform-express
#CMD node ./main.js


#FROM nginx as runtime
#COPY --from=build /app/dist/apps/design-app /usr/share/nginx/html
#COPY ["./conf/default.conf","/etc/nginx/conf.d/default.conf"]