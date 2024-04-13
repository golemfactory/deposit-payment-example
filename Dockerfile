FROM node:20-bullseye

RUN apt-get update && apt-get install -y vim

RUN npm install -g pnpm serve pm2
# Set the working directory
WORKDIR /app
