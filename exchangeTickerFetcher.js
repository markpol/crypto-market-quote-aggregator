"use strict";

const ccxt = require('ccxt');
const log = require('ololog');

class ExchangeTickerFetcher  {
    constructor(config, promiseLimit) {
        this.includeSymbols = config.includeSymbols;
        this.excludeSymbols = config.excludeSymbols;
        this.includeExchanges = config.includeExchanges;
        this.excludeExchanges = config.excludeExchanges;
        this.exchanges = {};
        this.promiseLimit = promiseLimit;
    }

    init() {
        log.yellow('Initializing exchanges...');

        return Promise.all(
            ccxt.exchanges.filter((exchangeId) => {
                return (!this.includeExchanges.length || this.includeExchanges.indexOf(exchangeId) !== -1)
                    && this.excludeExchanges.indexOf(exchangeId) === -1
            }).map((exchangeId) => {
                return this.promiseLimit(() => this.loadMarketsForExchange(exchangeId))
            })
        ).then(results => {
            log.yellow('Exchange initialization complete...');
            // log.yellow(results)
        });
    }

    /**
     *
     * @param exchangeId
     * @returns {Promise<T>}
     */
    async loadMarketsForExchange(exchangeId) {
        let exchange = new ccxt[exchangeId]();

        log.yellow('Loading markets for ' + exchangeId);
        return exchange.loadMarkets()
            .then((result) => {
                this.exchanges[exchangeId] = {
                    id: exchangeId,
                    enabled: exchange.hasPublicAPI,
                    failures: 0,
                    client: exchange
                };
                log.green(exchangeId + ': markets loaded');
            }).catch((error) => {
                log.error(exchangeId.red, error.toString().red);
            })
    }

    /**
     *
     * @param exchange
     * @returns {Array<{exchange:{}, symbol: String}>}
     */
    getAllFetchableExchangeMarkets() {
        let exchangeMarkets = [];
        for (let exchangeId in this.exchanges) {
            if (this.exchanges.hasOwnProperty(exchangeId) && this.exchanges[exchangeId].enabled) {
                for (let market in this.exchanges[exchangeId].client.markets) {
                    if (this.exchanges[exchangeId].client.markets.hasOwnProperty(market)
                        && (!this.includeSymbols.length || this.includeSymbols.indexOf(market) !== -1)
                        && this.excludeSymbols.indexOf(exchangeId) === -1
                    ) {
                        exchangeMarkets.push({
                            exchange: this.exchanges[exchangeId],
                            symbol: market
                        });
                    }
                }
            }
        }
        // sort by symbols to avoid hitting exchange rate limits
        exchangeMarkets.sort((a, b) => {
            return (a.symbol > b.symbol) ? 1 : ((b.symbol > a.symbol) ? -1 : 0);
        });

        return exchangeMarkets;
    }
}

module.exports = ExchangeTickerFetcher;