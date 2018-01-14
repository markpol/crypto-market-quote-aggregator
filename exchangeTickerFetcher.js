"use strict";

const ccxt      = require('ccxt');
const log       = require('ololog');
const maxNumber = 100;

class ExchangeTickerFetcher  {
    constructor(symbol) {
        this.symbol = symbol;
        this.exchanges = {};
    }

    async init() {
        log.yellow('Initializing exchanges...');
        for (let i = 0; i < ccxt.exchanges.length; i++) {
            let id = ccxt.exchanges[i];
            let exchange = new ccxt[id]();

            if (i < maxNumber) {
                try {
                    await exchange.load_markets();

                    if (exchange.hasPublicAPI && exchange.symbols.includes(this.symbol)) {
                        this.exchanges[id] = {
                            id: id,
                            enabled: true,
                            failures: 0,
                            client: new ccxt[id]()
                        }
                    }
                } catch (e) {
                    log.error(id.red, e.toString().red);
                }

                log.green(id + ': OK');
            }
        }
    }

    async fetchExchangeTicker(exchange) {
        return exchange.fetchTicker(this.symbol)
    }
}

module.exports = ExchangeTickerFetcher;