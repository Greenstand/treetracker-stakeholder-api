exports.up = function (knex) {
  return knex.schema.createTable('stakeholder', (table) => {
    table.number('id').primary().notNullable();
    table.string('type').notNullable();
    table.string('logo');
    table.string('org_name');
    table.string('first_name');
    table.string('last_name');
    table.string('map');
    table.string('email');
    table.string('phone');
    table.string('website');
    table.uuid('stakeholder_uuid').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('stakeholder');
};
