FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# npm install 시간 초과 방지
RUN npm config set fetch-timeout 600000
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
ENV REACT_APP_API_URL=http://backend:8080