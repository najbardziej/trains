FROM node:16.13.1-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install --only=development
COPY . .
RUN npm run build
RUN echo $(ls /usr/src/app/)

FROM node:16.13.1-alpine
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 7000
CMD ["node", "dist/main"]
