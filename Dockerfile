FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

RUN npm i -g serve

COPY . .

RUN npm run build

ENV NODE_ENV="production" \
    VITE_PORT="" \
    VITE_API_URL=""

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]
