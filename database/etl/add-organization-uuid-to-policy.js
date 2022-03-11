require('dotenv').config({ path: `../../.env.${process.env.NODE_ENV}` });
const log = require('loglevel');
log.setDefaultLevel('info');


const knex = require('../../server/database/knex');

async function migrate() {
  const thx = await knex.transaction();

  const roles = await thx.table('admin_role').select('*')

  await Promise.all(roles.map(async (row) => {
    let policy = row.policy;
    if(policy.organization){
      log.info(policy);
      const result = await thx.table('entity').where('id', '=', policy.organization.id)
      log.info(result);
      const entity = result[0];
      if(!entity){
        return;
      }
      policy.organization.uuid = entity.stakeholder_uuid;
      log.info(policy); 
      await thx.table('admin_role').update('policy', policy).where('id', '=', policy.organization.id)
    }

  }))
  log.info('DONE');
  thx.commit();
}

migrate();
