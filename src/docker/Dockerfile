FROM node:20.11-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

FROM node:20.11-alpine as start

WORKDIR /app

COPY --from=build /app /app

EXPOSE 4000

CMD npx prisma migrate dev && npm run start:dev