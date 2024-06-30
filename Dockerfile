FROM node:20.10.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk update && apk upgrade

COPY . /usr/src/app/
RUN rm -rf node_modules
RUN npm install pm2 -g
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
RUN /root/.local/share/pnpm/pnpm install
RUN /root/.local/share/pnpm/pnpm run build

ENV HOST=0.0.0.0

CMD ["pm2-runtime", "start", "./dist/index.js"]
