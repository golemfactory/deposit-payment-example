ARG BACKEND_URL=http://127.0.0.1:5174

FROM node:20-bullseye

RUN apt-get update && apt-get install -y vim

RUN npm install -g pnpm serve

# Set the working directory
WORKDIR /app
COPY . /app

ARG BACKEND_URL
ENV VITE_BACKEND_URL=$BACKEND_URL
RUN echo "The backend URL is $BACKEND_URL"
RUN mkdir /app/temp

RUN pnpm install
RUN rm -rf /app
