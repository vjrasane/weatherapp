FROM node:slim

ARG PORT=5000

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
RUN npm run build

EXPOSE ${PORT}
CMD npm run serve