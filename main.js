"use strict";

const log = require('ololog');
const config = require('config');
require('ansicolor').nice;
const ExchangeTicketFetcher = require('./exchangeTickerFetcher');
const Persister = require('./persister');
const PromiseLimit = require('promise-limit');

let promiseLimit = new PromiseLimit(config.concurrency);

let sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
};

let processExchanges = (fetcher, persister) => {
    return Promise.all(
        fetcher.getAllFetchableExchangeMarkets().map((exchangeMarket) => {
            return promiseLimit(() => processExchangeMarket(exchangeMarket.exchange, exchangeMarket.symbol, persister))
        })
    ).then(results => {
        log.yellow('Fetched exchange prices complete...');
        // log.yellow(results)
    });
};

let processExchangeMarket = (exchange, symbol, persister) => {
    log.yellow('Fetching "' + symbol + '" quotes on ' + exchange.id);
    return exchange.client.fetchTicker(symbol)
        .then((result) => {
            //log.dim(result);
            persister.insertQuote(exchange.id, result);

        }).catch((error) => {
            log.error(exchange.id.red, error.toString().red);
            exchange.failures++;
            if (exchange.failures > config.maxExchangeFetchFailures) {
                exchange.enabled = false
            }
        })
};

(async function main () {

    let persister = new Persister(config.database);
    await persister.init();

    let fetcher = new ExchangeTicketFetcher(config.fetcher, promiseLimit);
    await fetcher.init();

    while(true) {
        await processExchanges(fetcher, persister);
        log.yellow('Waiting ' + config.waitIntervalSeconds + ' seconds');
        await sleep(config.waitIntervalSeconds * 1000);
    }

}) ();

