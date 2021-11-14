const { v4: uuid } = require('uuid');
const knex = require('../../server/database/knex');

const stakeholderOne = Object.freeze({
  id: 5000000,
  type: 'type',
  name: 'name',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  phone: 'phone',
  pwd_reset_required: true,
  website: 'website',
  wallet: 'wallet@@#',
  password: 'password',
  salt: 'salt',
  active_contract_id: 10,
  offering_pay_to_plant: true,
  tree_validation_contract_id: 11,
  logo_url: 'url',
  map_name: 'ma,e',
  stakeholder_uuid: uuid(),
});
const stakeholderTwo = Object.freeze({
  id: 5000001,
  type: 'type',
  name: 'name',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  phone: 'phone',
  pwd_reset_required: true,
  website: 'website',
  wallet: 'wallet@!#',
  password: 'password',
  salt: 'salt',
  active_contract_id: 10,
  offering_pay_to_plant: true,
  tree_validation_contract_id: 11,
  logo_url: 'url',
  map_name: 'ma,e',
  stakeholder_uuid: uuid(),
});

before(async () => {
  await knex.raw(`
    INSERT INTO public.entity(
         id, type, name, first_name, last_name, email, phone, pwd_reset_required, website, wallet, password, salt, active_contract_id, offering_pay_to_plant, tree_validation_contract_id, logo_url, map_name, stakeholder_uuid)
        VALUES
        ('${stakeholderOne.id}','${stakeholderOne.type}', '${stakeholderOne.name}', '${stakeholderOne.first_name}', '${stakeholderOne.last_name}', '${stakeholderOne.email}', '${stakeholderOne.phone}', '${stakeholderOne.pwd_reset_required}', '${stakeholderOne.website}', '${stakeholderOne.wallet}', '${stakeholderOne.password}', '${stakeholderOne.salt}', '${stakeholderOne.active_contract_id}', '${stakeholderOne.offering_pay_to_plant}', '${stakeholderOne.tree_validation_contract_id}', '${stakeholderOne.logo_url}', '${stakeholderOne.map_name}', '${stakeholderOne.stakeholder_uuid}'),
        ('${stakeholderTwo.id}','${stakeholderTwo.type}', '${stakeholderTwo.name}', '${stakeholderTwo.first_name}', '${stakeholderTwo.last_name}', '${stakeholderTwo.email}', '${stakeholderTwo.phone}', '${stakeholderTwo.pwd_reset_required}', '${stakeholderTwo.website}', '${stakeholderTwo.wallet}', '${stakeholderTwo.password}', '${stakeholderTwo.salt}', '${stakeholderTwo.active_contract_id}', '${stakeholderTwo.offering_pay_to_plant}', '${stakeholderTwo.tree_validation_contract_id}', '${stakeholderTwo.logo_url}', '${stakeholderTwo.map_name}', '${stakeholderTwo.stakeholder_uuid}');
  `);
});

after(async () => {
  await knex.raw(`

    DELETE FROM entity
    WHERE password = '${stakeholderTwo.password}';
  `);
});

module.exports = {
  stakeholderOne,
  stakeholderTwo,
};
