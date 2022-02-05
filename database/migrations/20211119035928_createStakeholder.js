exports.up = function (knex) {
  return knex.schema.createTable('stakeholder', (table) => {
    table.uuid('id').primary();
    table.string('type').notNullable();
    table.string('org_name');
    table.string('first_name');
    table.string('last_name');
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.boolean('pwd_reset_required');
    table.string('password');
    table.string('wallet');
    table.string('salt');
    table.boolean('offering_pay_to_plant');
    table.uuid('active_contract_id');
    table.uuid('tree_validation_contract_id');
    table.string('website');
    table.string('logo_url');
    table.string('map');
    table.integer('organization_id');
    table.uuid('owner_id');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('stakeholder');
};
