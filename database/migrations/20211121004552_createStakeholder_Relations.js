exports.up = function (knex) {
  return knex.schema.createTable('stakeholder_relations', (table) => {
    table.uuid('org_id').notNullable();
    table.enu('relation_type', ['parent', 'child']).notNullable();
    table.uuid('relation_id').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('stakeholder_relations');
};
