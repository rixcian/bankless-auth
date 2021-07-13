FROM node:14-slim
EXPOSE 3000 4545

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN npm install

COPY . /home/app

RUN npm run build

CMD ["npm", "start"]
