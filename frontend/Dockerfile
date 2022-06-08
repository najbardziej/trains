FROM node:16.13.1-alpine as build

ARG app_environment

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm install

COPY . .

RUN npm run build -- --configuration ${app_environment}

RUN npm run test-nowatch 

FROM nginx:1.21.5-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/dist/trains /usr/share/nginx/html

EXPOSE 80
