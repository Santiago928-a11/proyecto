FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

ENV NODE_OPTIONS=--openssl-legacy-provider

RUN apk add --no-cache \
    bash \
    curl \
    git \
    python3 \
    make \
    g++

RUN npm config set strict-ssl true
RUN npm config set registry https://registry.npmjs.org/

RUN npm install -g @angular/cli@16
RUN npm install --legacy-peer-deps xlsx ng2-charts@4.1.1 chart.js@4.4.0

COPY . .

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check", "--poll", "2000"]
