exports.up = function (knex) {
  return knex.schema.createTable('stakeholder', (table) => {
    table.increments('id').primary();
    table.string('type').notNullable();
    table.string('logo_url');
    table.string('org_name');
    table.string('first_name');
    table.string('last_name');
    table.string('map');
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.string('website');
    table.uuid('stakeholder_uuid').notNullable();
    table.timestamps(true, true);
  });
};

// exports.up = function (knex) {
//   return knex.schema.createTable('stakeholder', (table) => {
//     table.uuid('id').primary(); // stakeholder_uuid
//     table.number('org_id');
//     table.string('type').notNullable();
//     table.string('name'); //org_name, combined first & last
//     table.string('first_name');
//     table.string('last_name');
//     table.string('email').notNullable();
//     table.string('phone').notNullable();
//     table.string('logo_url');
//     table.string('map');
//     table.string('website');
//     table.timestamps(true, true);
//   });
// };

exports.down = function (knex) {
  return knex.schema.dropTable('stakeholder');
};
