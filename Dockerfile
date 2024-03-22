FROM node as base

FROM base as production
WORKDIR /app
RUN apt-get update && apt-get install -y sqlite3
COPY package.json . 
COPY ./src/nginx .
RUN npm install 
COPY ./src/catalog-service .
EXPOSE 8001
CMD ["npm","run","start-catalog"]


FROM base as production1
WORKDIR /app
RUN apt-get update && apt-get install -y sqlite3
COPY package.json . 
COPY ./src/nginx .
RUN npm install 
COPY ./src/order-service .
EXPOSE 8002
CMD ["npm","run","start-order"]




FROM base as client
WORKDIR /app
COPY package.json .
COPY ./src/nginx .
RUN npm install
COPY ./src/client-service .
CMD ["npm", "run" , "start-client"]