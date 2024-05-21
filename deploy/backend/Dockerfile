FROM node:20-alpine
RUN npm install pm2 -g
RUN apk --no-cache add wget curl bash

RUN wget https://github.com/golemfactory/yagna/releases/download/v0.15.0-deposits-beta5/golem-requestor-linux-v0.15.0-deposits-beta5.tar.gz 

RUN tar -xf golem-requestor-linux-v0.15.0-deposits-beta5.tar.gz
RUN mv golem-requestor-linux-v0.15.0-deposits-beta5/gftp /usr/bin/gftp

CMD ["pm2-runtime", "./dist/index.js"]
