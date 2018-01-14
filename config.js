var config = {};

// Postgres adapter example config
config.db = {
    driver: process.env.DB_DRIVER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'cmqa',
    pass: process.env.DB_PASSWORD || 'cmqa',
    schema: process.env.DB_SCHEMA || 'cmqa'
};

module.exports = config;