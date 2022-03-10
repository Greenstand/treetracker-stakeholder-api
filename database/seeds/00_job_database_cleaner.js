exports.seed = async function (knex) {
  await knex.raw(`
    DELETE FROM stakeholder;
    DELETE FROM stakeholder_relation;
  `);
};

