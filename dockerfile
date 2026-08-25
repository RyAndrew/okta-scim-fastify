FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

ENV PORT=8011
EXPOSE 8011
CMD ["sh", "-c", "npx knex migrate:latest && node server.js"]
