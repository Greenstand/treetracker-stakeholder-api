const path = require('path');
const connection = require('./config/config').connectionString;

console.log('connection', connection);

module.exports = {
  development: {
    client: 'postgresql',
    connection,
    searchPath: [process.env.DATABASE_SCHEMA],
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

  staging: {
    client: 'postgresql',
    connection,
    searchPath: [process.env.DATABASE_SCHEMA],
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
    client: 'postgresql',
    connection,
    searchPath: [process.env.DATABASE_SCHEMA],
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