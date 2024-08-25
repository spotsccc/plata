FROM node:20.16.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run generate-migrations
RUN npm run run-migrations
RUN npm run build

CMD [ "npm", "run", "start" ]
