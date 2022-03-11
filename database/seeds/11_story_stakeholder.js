const { v4: uuid } = require('uuid');

const stakeholderOne = Object.freeze({
  id: uuid(),
  type: 'type',
  org_name: 'name',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  phone: 'phone',
  pwd_reset_required: true,
  website: 'website',
  wallet: 'wallet@@#',
  password: 'password',
  salt: 'salt',
  active_contract_id: uuid(),
  offering_pay_to_plant: true,
  tree_validation_contract_id: uuid(),
  logo_url: 'url',
  map: 'ma,e',
  owner_id: uuid(),
  organization_id: 5000000,
});

const stakeholderTwo = Object.freeze({
  id: uuid(),
  type: 'type',
  org_name: 'name',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  phone: 'phone',
  pwd_reset_required: true,
  website: 'website',
  wallet: 'wallet@!#',
  password: 'password',
  salt: 'salt',
  active_contract_id: uuid(),
  offering_pay_to_plant: true,
  tree_validation_contract_id: uuid(),
  logo_url: 'url',
  map: 'ma,e',
  owner_id: uuid(),
  organization_id: 5000001,
});

const seed = async function (knex) {

  await knex('stakeholder').insert([stakeholderOne, stakeholderTwo]);

}

module.exports = {
  seed,
  stakeholderOne,
  stakeholderTwo
}

