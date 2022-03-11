require('dotenv').config({ path: `../../.env.${process.env.NODE_ENV}` });
const generate_uuid_v4 = require("uuid").v4;

const knex = require('../../server/database/knex');

async function migrate() {
  thx = await knex.transaction();

  const entities = await thx.table('entity').select('*')
  let entityIdLookup = {}
  entities.forEach( (stakeholderRow) => {
    entityIdLookup[stakeholderRow.id] = stakeholderRow.stakeholder_uuid;
  })

  await Promise.all(entities.map(async (stakeholderRow) => {

    const exists = await thx.table('stakeholder.stakeholder').where('id', '=', stakeholderRow.stakeholder_uuid);
    if(exists.length > 0){
      console.log('stakeholder already exists')
      return;
    }


    let type = 'Person';
    if(stakeholderRow.type == 'o' || stakeholderRow.type == 'O'){
      type = 'Organization';
    }

    const stakeholder = {
      id: stakeholderRow.stakeholder_uuid,
      type: type,
      org_name: stakeholderRow.org_name,
      first_name: stakeholderRow.first_name,
      last_name: stakeholderRow.last_name,
      email: stakeholderRow.email,
      phone: stakeholderRow.phone,
      website: stakeholderRow.website,
      logo_url: stakeholderRow.logo_url,
      map: stakeholderRow.map
    }
    await thx.table('stakeholder.stakeholder').insert(stakeholder);

    const relations = await thx.table('entity_relationship').select('*').where('parent_id', '=', stakeholderRow.id);
    await Promise.all(relations.map(async (relationRow) => {
      const relation = {
        parent_id: stakeholder.id,
        child_id: entityIdLookup[relationRow.child_id],
        type: relationRow.type,
        role: relationRow.role
      }
      await thx.table('stakeholder.stakeholder_relation').insert(relation);
    }))
  }))
  console.log('DONE');
  thx.commit();
}

migrate();
