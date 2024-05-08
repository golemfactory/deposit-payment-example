

FROM alpine:latest

RUN apk --no-cache add curl bash
# Download official installer
RUN curl -L https://join.golem.network/as-requestor --output as-requestor.sh
RUN chmod +x as-requestor.sh

ENV PATH="${PATH}:/root/.local/bin"

# switch yagna version if necessery
ARG YAGNA_VERSION

# yagna installer normally asks for user input, so we need to set some environment variables to avoid that
RUN GOLEM_ACCEPT_TOS=yes BATCH_MODE=yes YA_INSTALLER_CORE=${YAGNA_VERSION} ./as-requestor.sh




