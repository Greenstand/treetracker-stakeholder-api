exports.up = function (knex) {
  return knex.schema.createTable('stakeholder_relations', (table) => {
    table.primary(['parent_id', 'child_id']);
    table.uuid('parent_id').notNullable();
    table.uuid('child_id').notNullable();
    table.string('type');
    table.string('role');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('stakeholder_relations');
};
