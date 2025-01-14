FROM node:18.17.1

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD ["node", "server.js"]

EXPOSE 3000