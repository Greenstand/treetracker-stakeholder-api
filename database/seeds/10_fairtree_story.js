
const parentId = 'fa0148f2-7bfc-47ba-9152-446b2cfa3f56';
const child1Id = 'e25de784-d8aa-469a-a6b0-702da5a2a980';
const child2Id = 'f5d72a17-3a96-4358-91b0-0171b2db0d67';
const child3Id = 'bab6ad35-8c89-407d-8252-800d1e22a011';

exports.seed = async function (knex) {

  const organization = {
    id: '',
    type: 'Organization',
    org_name: 'Org Name',
    first_name: '',
    last_name: '',
    email: 'hello@greenstand.com',
    phone: '123-123-2122',
    pwd_reset_required: null,
    password: null,
    wallet: null,
    salt: null,
    offering_pay_to_plant: null,
    active_contract_id: null,
    tree_validation_contract_id: null,
    website: 'greenstand',
    logo_url: './logo_192x192.png',
    map: '/greenstandMap',
    organization_id: 1,
    owner_id: null,
  }

  organization.id = parentId;
  organization.org_name = "Fairtree Main";
  await knex('stakeholder').insert(organization);

  organization.id = child1Id;
  organization.org_name = "Pay to Grow";
  await knex('stakeholder').insert(organization);

  organization.id = child2Id;
  organization.org_name = "Pay 2 Grow";
  await knex('stakeholder').insert(organization);

  organization.id = child3Id;
  organization.org_name = "Pay 2 Grow";
  await knex('stakeholder').insert(organization);

  const relation = {
    parent_id: parentId,
    child_id: ''
  }
  
  relation.child_id = child1Id
  await knex('stakeholder_relation').insert(relation);
  
  relation.child_id = child2Id
  await knex('stakeholder_relation').insert(relation);
  
  relation.child_id = child3Id
  await knex('stakeholder_relation').insert(relation);
  
};
