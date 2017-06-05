FROM node

RUN apt-get install git

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]