FROM node:slim

ARG COMMAND=start
ARG APPID=5b6368533d84d93971b4a3bd8db47475
ARG PORT=9000

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV APPID=${APPID}
ENV PORT=${PORT}

EXPOSE ${PORT}
CMD [ "npm", "run", ${COMMAND} ]