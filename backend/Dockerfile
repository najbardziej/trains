FROM node:16.13.1-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install --only=development
COPY . .
RUN npm run build

FROM node:16.13.1-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 7000
CMD ["node", "dist/main"]
