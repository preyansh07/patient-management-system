FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --registry https://registry.npmjs.org

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
