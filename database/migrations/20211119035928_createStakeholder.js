exports.up = function (knex) {
  return knex.schema.createTable('stakeholder', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('type').notNullable();
    table.string('logo_url').notNullable();
    table.string('org_name');
    table.string('first_name');
    table.string('last_name');
    table.string('map_name');
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.string('website').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('stakeholder');
};
