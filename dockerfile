FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

RUN npx knex migrate:latest

EXPOSE 8011
CMD ["node", "server.js"]
