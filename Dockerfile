FROM node:20-alpine

WORKDIR /app

COPY package.json .  # Ensure lock file is copied
RUN npm install  # Handle conflicts

COPY . .  

EXPOSE 3050

CMD ["npm", "run", "dev"]
