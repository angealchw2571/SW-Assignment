FROM node:latest as builder

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 3001




FROM alpine:latest

RUN apk add --update npm

WORKDIR /root/

COPY --from=builder /app .

CMD [ "node", "server.js" ]

