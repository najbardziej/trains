FROM node:16.13.1-alpine AS dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

RUN npm run build

COPY . .

FROM node:16.13.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=dev /usr/src/app/dist ./dist

EXPOSE 7000

CMD ["node", "dist/main"]

#CMD [ "npm", "start" ]