"use strict";

const log = require('ololog');

require('ansicolor').nice

const ExchangeTicketFetcher = require('./exchangeTickerFetcher');
const Persister = require('./persister');
const wait = process.env.INTERVAL_SECONDS || 30000;

let printUsage = () => {
    log('Usage: node', process.argv[1], 'symbol'.green)
};

let sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
};

let processExchanges = async (fetcher, persister) => {
    for (let id in fetcher.exchanges) {
        let exchange = fetcher.exchanges[id];
        if (exchange.enabled) {
            try {
                log.yellow(id);
                let ticker = await fetcher.fetchExchangeTicker(exchange.client);
                log.dim(ticker);
                if (ticker) {
                    persister.insertQuote(id, ticker);
                }

            } catch (e) {
                log.error(id.red, e.toString ().red);
                exchange.enabled = false
            }
        }
    }
};

(async function main () {

        if (process.argv.length > 2) {

            let symbol = process.argv[2].toUpperCase();
            let fetcher = new ExchangeTicketFetcher(symbol);
            await fetcher.init();

            let persister = new Persister();

            while(true) {
                await processExchanges(fetcher, persister);
                log.yellow('Waiting ' + wait/1000 + 'seconds');
                await sleep(wait);
            }

        } else {
            printUsage ()
        }

    //process.exit();

}) ();

