FROM node:16.15.0-alpine as build

ARG app_environment

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm install

COPY . .

RUN npm run build -- --configuration ${app_environment}

FROM nginx:1.22.0-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/dist/trains /usr/share/nginx/html

EXPOSE 80
