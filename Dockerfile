FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --pure-lockfile

COPY dist dist

CMD [ "node", "--es-module-specifier-resolution=node", "dist/index.js" ]
