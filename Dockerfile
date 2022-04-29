FROM node:12-buster-slim

RUN npm install -g nodemon

WORKDIR /app

# copy package.json as seprate layer so i can run nmp install after
COPY package.json .

# run nmp install before copy source code so i can benefit with cashed npm install
RUN npm install -g --verbose

COPY . .

EXPOSE 8000
# required for docker desktop port mapping

CMD ["npm", "start", "dev"]