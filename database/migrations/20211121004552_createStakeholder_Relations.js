exports.up = function (knex) {
  return knex.schema.createTable('stakeholder_relations', (table) => {
    table.increments('id').primary();
    table.uuid('org_id').notNullable();
    table.enu('relation_type', ['parent', 'child']).notNullable();
    table.uuid('relation_id').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('stakeholder_relations');
};
