FROM node:21 as builder

WORKDIR /app

COPY my-app/ ./

WORKDIR /app/my-app
RUN npm install --force

CMD ["npm", "start"]