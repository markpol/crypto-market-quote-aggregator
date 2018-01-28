# crypto-market-quote-aggregator
Node JS app to aggregate and persist crypto currency market prices from 90+ exchanges.  Quotes are persisted to a Postgresql database in a docker container or standalone.

see:   https://github.com/ccxt/ccxt for supported exchanges

### Setup configuration file:
Copy config/production.sample.json to config/production.json and modify as required.  default.json values will be overridden by file with same name as NODE_ENV environment variable

#### Configuration parameters:
* __database__ : set database connection parameters below
  * __driver__
  * __host__
  * __user__
  * __pass__
  * __schema__
* __fetcher__
  * __includeExchanges__ : only include these exchanges for price fetching
  * __excludeExchanges__ : blacklist exchanges for price fetching
  * __includeSymbols__ : only include these market symbols for price fetching
  * __excludeSymbols__ : blacklist market symbols for price fetching
* __concurrency__ : maximum number of conncurrent http requests to exchange api endpoints
* __maxExchangeFetchFailures__ : exchange will be purged from include list after this many failed requests
* __waitIntervalSeconds__ : wait this many seconds between each round of api requests

### Build and run with docker-compose:

```bash
docker-compose up --build
```

### Manual
1. Setup the database and edit config json file

2. Run install
```bash
npm install
```

3. Run script
```bash
node main.js
```
