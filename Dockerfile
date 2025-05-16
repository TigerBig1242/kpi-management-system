FROM node:22-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "node",  "index.ts", "server.ts"]
