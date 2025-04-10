FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx zenstack generate

EXPOSE 3000
CMD ["npm", "start"]
