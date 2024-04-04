FROM node:20-bullseye

RUN apt-get update && apt-get install -y vim

# Set the working directory
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app
COPY . /app

RUN pnpm install
RUN pnpm build:all
