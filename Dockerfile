FROM node:9.4

WORKDIR /crypto-market-quote-aggregator

COPY . /crypto-market-quote-aggregator

RUN npm install

CMD ["node", "main.js"]
