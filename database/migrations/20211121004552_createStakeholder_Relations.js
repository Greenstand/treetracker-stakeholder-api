exports.up = function (knex) {
  return knex.schema.createTable('stakeholder_relations', (table) => {
    table.increments('id').primary();
    table.uuid('parent_id').notNullable();
    table.uuid('child_id').notNullable();
    table.string('type').notNullable();
    table.string('role').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('stakeholder_relations');
};
