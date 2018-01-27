"use strict";

const anyDB     = require('any-db')
const log       = require('ololog');

class Persister  {
    constructor(config) {
        this.conn = anyDB.createPool(config.driver+'://'+config.user+':'+config.pass+'@'+config.host+'/' + config.schema, {
            min: 5, max: 15,
            reset: function (conn, done) {
                conn.query('ROLLBACK', done)
            }
        });
        this.init()
    }

    init() {
        const sql = `CREATE TABLE IF NOT EXISTS quotes (
                  id BIGSERIAL PRIMARY KEY,
                  symbol VARCHAR (16) NOT NULL,
                  exchange VARCHAR (64) NOT NULL,
                  high double precision DEFAULT NULL,
                  low double precision DEFAULT NULL,
                  bid double precision DEFAULT NULL,
                  ask double precision DEFAULT NULL,
                  volume double precision DEFAULT NULL,
                  timestamp TIMESTAMP NOT NULL
                );`;
        log(sql);
        this.conn.query(sql, function (error, result) {
            if (error) {
                log.error(error)
            }
        })
    };

    insertQuote(exchange, ticker) {
        if (ticker) {
            let sql = `INSERT INTO quotes (symbol, exchange, high, low, bid, ask, volume, "timestamp") VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
            let data = [ticker.symbol, exchange, ticker.high, ticker.low, ticker.bid, ticker.ask, ticker.baseVolume, ticker.datetime];
            log(sql, data);
            this.conn.query(
                sql,
                data,
                function (error, result) {
                    if (error) {
                        log.error(error, result)
                    }
                }
            );
        }
    }
}

module.exports = Persister;