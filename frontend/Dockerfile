FROM node:slim

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV ENDPOINT=http://${BACKEND_IP}/api
RUN npm run build

EXPOSE 5000

CMD npm run serve