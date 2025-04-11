FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# RUN npx zenstack generate

EXPOSE 3000

# CMD ["npm", "run", "dev"]

ENTRYPOINT [ "/entrypoint.sh" ]
