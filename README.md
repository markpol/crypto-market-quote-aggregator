# crypto-market-quote-aggregator
Node JS app to aggregate and persist crypto currency market prices from 90+ exchanges.  Quotes are persisted to a Postgresql database in a docker container or standalone.

### Build and run with docker-compose:

```bash
docker-compose up --build
```

### Manual
1. Setup the database and edit config.js

2. Run install
```bash
npm install
```

3. Run script
```bash
node main.js USD/BTC
```
