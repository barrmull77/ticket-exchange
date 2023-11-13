FROM node:16.17.0-alpine

RUN apk add --no-cache libc6-compat

ENV PORT 8080
EXPOSE 8080

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG APP_VERSION
ENV APP_VERSION $APP_VERSION
ENV REACT_APP_VERSION $APP_VERSION

ENV BUILD_PATH build

WORKDIR /usr/src/app
COPY package.json .
RUN npm install
RUN npm install serve
COPY . .
RUN npm run build
RUN npm run build:staging

CMD ["sh", "-c", "node_modules/.bin/serve -s ${BUILD_PATH}"]
