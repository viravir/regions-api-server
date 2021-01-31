FROM node:12-alpine

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN npm i

COPY . /home/app

RUN npm run build

ARG mode
ENV mode=$mode
CMD npm run start:$mode