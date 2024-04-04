FROM node:20-bullseye

# Set the working directory
RUN npm install -g pnpm


# Set the working directory
WORKDIR /app
COPY . /app

RUN pnpm install
