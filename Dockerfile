# FROM node:latest as builder

# WORKDIR /app

# COPY package.json /app

# RUN npm install

# COPY . /app

# ARG PORT=80

# EXPOSE ${PORT}



# FROM alpine:latest

# RUN apk add --update npm

# WORKDIR /root/

# COPY --from=builder /app .

# CMD [ "node", "server.js" ]


FROM node:18-alpine3.14

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

ARG PORT=80

EXPOSE ${PORT}

CMD [ "node", "server.js" ]
