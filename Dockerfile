FROM node:20-bullseye

RUN apt-get update && apt-get install -y vim

RUN npm install -g pnpm serve

# Set the working directory
WORKDIR /app
COPY . /app

ENV VITE_BACKEND_URL=http://127.0.0.1:5174

RUN mkdir /app/temp

RUN pnpm install
RUN pnpm build:all
