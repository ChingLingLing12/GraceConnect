FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]