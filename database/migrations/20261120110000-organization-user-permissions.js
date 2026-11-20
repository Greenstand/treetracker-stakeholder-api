const fs = require('fs');
const path = require('path');

function runMigration(db, direction) {
  const file = path.join(__dirname, 'sqls', `20261120110000-organization-user-permissions-${direction}.sql`);
  return fs.promises.readFile(file, 'utf8').then((sql) => db.runSql(sql));
}

exports.up = (db) => runMigration(db, 'up');
exports.down = (db) => runMigration(db, 'down');
exports._meta = { version: 1 };
