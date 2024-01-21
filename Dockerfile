FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache \
    npm

COPY package*.json ./
RUN npm install --only=production

COPY dist dist

CMD [ "node", "--es-module-specifier-resolution=node", "dist/index.js" ]
