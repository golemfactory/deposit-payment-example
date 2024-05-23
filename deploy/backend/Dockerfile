FROM node:20-alpine
RUN npm install pm2 -g
RUN apk --no-cache add wget curl bash

RUN wget https://github.com/golemfactory/yagna/releases/download/v0.15.0-deposits-beta5/golem-requestor-linux-v0.15.0-deposits-beta5.tar.gz && \
  tar -xf golem-requestor-linux-v0.15.0-deposits-beta5.tar.gz && \
  mv golem-requestor-linux-v0.15.0-deposits-beta5/gftp /usr/bin/gftp && \
  rm -rf golem-requestor-linux-v0.15.0-deposits-beta5.tar.gz golem-requestor-linux-v0.15.0-deposits-beta5

CMD ["pm2-runtime", "./dist/index.js"]
