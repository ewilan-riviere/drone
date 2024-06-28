FROM node:20.10.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk update && apk upgrade
RUN apk add git

COPY . /usr/src/app/
RUN npm install
RUN npm run build

ENV HOST=0.0.0.0

EXPOSE 3000

CMD [ "npm", "run", "start" ]
