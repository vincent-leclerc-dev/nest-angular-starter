# Base image
FROM node:21.5-alpine3.18

# Install app dependencies
RUN npm i -g @nestjs/cli

# Set user
USER node

# Create app directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

ENTRYPOINT npm install && npm run start:dev

