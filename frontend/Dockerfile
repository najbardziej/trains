FROM node:16.13.1-alpine as build

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.21.5-alpine

COPY --from=build /usr/src/app/dist/trains /usr/share/nginx/html

EXPOSE 80
