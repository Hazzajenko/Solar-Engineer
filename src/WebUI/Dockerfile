FROM node:14-alpine as build
WORKDIR /app

#RUN #npm install -g @angular/cli
#RUN #npm install -g @nrwl/cli

COPY ./package.json .
RUN npm install
COPY . .
ENV NODE_ENV=production
#RUN #npx nx run design-app:build:production
RUN npx nx build design-app --configuration=production
# RUN npm run build

FROM nginx as runtime
COPY --from=build /app/dist/apps/design-app /usr/share/nginx/html
#COPY ["./conf/http.conf","/etc/nginx/conf.d/default.conf"]
COPY ["./conf/default.conf","/etc/nginx/conf.d/default.conf"]

## Use an official Node.js runtime as a parent image
##FROM node:14-alpine AS builder
##FROM node:18.16.0-alpine AS builder
#FROM node:14-alpine AS builder
#
##18.16.0
##
#
## Set the working directory to /app
#WORKDIR /app
#
## Install PNPM
##RUN #npm install -g pnpm
#RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
#
## Set the SHELL environment variable to /bin/bash
##SHELL ["/bin/bash", "-c"]
##RUN #wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
##RUN #wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
#
## Set the SHELL environment variable to /bin/bash
##SHELL ["/bin/bash", "-c"]
#
## Run pnpm setup to create the global bin directory
##RUN #pnpm setup
#
##RUN #pnpm add -g @angular/cli
## RUN pnpm install -g @nrwl/cli
#
## Copy the package.json and pnpm-lock.yaml files to the container
##COPY package*.json pnpm-lock.yaml ./
#COPY package.json pnpm-lock.yaml ./
#
## Install dependencies
##RUN #pnpm install
##RUN #pnpm install --frozen-lockfile --prod
#
## Copy the rest of the application code to the container
##COPY . .
#
#RUN pnpm fetch --prod
#ADD . ./
#RUN pnpm install -r --offline --prod
#
##ENV NODE_ENV=production
#RUN npx nx build design-app --configuration=production
#
#FROM nginx as runtime
#COPY --from=builder /app/dist/apps/design-app /usr/share/nginx/html
#COPY ["./conf/default.conf","/etc/nginx/conf.d/default.conf"]
#
##EXPOSE 80
#
#
## Tag the image with the version number
## For example, "mycompany/myimage:1.0.0"
##LABEL version="1.0.1"

LABEL version="1.0.0"
LABEL git_commit="abc123"