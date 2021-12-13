const path = require('path');
const connection = require('./config/config').connectionString;

module.exports = {
  development: {
    client: 'pg',
    connection,
    searchPath: [process.env.DATABASE_SCHEMA, 'public'],
    pool: {
      min: 1,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds'),
    },
  },

  test: {
    client: 'pg',
    connection,
    searchPath: [process.env.DATABASE_SCHEMA, 'public'],
    pool: {
      min: 1,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds'),
    },
  },

  production: {
    client: 'pg',
    connection,
    searchPath: [process.env.DATABASE_SCHEMA, 'public'],
    pool: {
      min: 1,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, 'database', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'database', 'seeds'),
    },
  },
};
