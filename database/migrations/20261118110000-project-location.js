const fs = require('fs');
const path = require('path');

function runMigration(db, direction) {
  const file = path.join(__dirname, 'sqls', `20261118110000-project-location-${direction}.sql`);
  return fs.promises.readFile(file, 'utf8').then((sql) => db.runSql(sql));
}

exports.up = (db) => runMigration(db, 'up');
exports.down = (db) => runMigration(db, 'down');
exports._meta = { version: 1 };
