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
    website: 'http://greenstand.com',
    logo_url: './logo_192x192.png',
    map: 'greenstandMap',
  };

  organization.id = parentId;
  organization.org_name = 'Fairtree Main';
  await knex('stakeholder').insert(organization);

  organization.id = child1Id;
  organization.org_name = 'Pay 2 Grow 1';
  await knex('stakeholder').insert(organization);

  organization.id = child2Id;
  organization.org_name = 'Pay 2 Grow 2';
  await knex('stakeholder').insert(organization);

  organization.id = child3Id;
  organization.org_name = 'Pay 2 Grow 3';
  await knex('stakeholder').insert(organization);

  const relation = {
    parent_id: parentId,
    child_id: '',
  };

  relation.child_id = child1Id;
  await knex('stakeholder_relation').insert(relation);

  relation.child_id = child2Id;
  await knex('stakeholder_relation').insert(relation);

  relation.child_id = child3Id;
  await knex('stakeholder_relation').insert(relation);
};
