exports.up = function (knex) {
  return knex.schema.createTable('stakeholder', (table) => {
    table.uuid('id').primary();
    table.string('type').notNullable();
    table.string('logo').notNullable();
    table.string('name');
    table.string('map').notNullable();
    table.string('email');
    table.string('phone');
    table.string('website').notNullable();
    table.string('children').notNullable();
    table.string('parents').notNullable();
    table.string('users').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('stakeholder');
};
