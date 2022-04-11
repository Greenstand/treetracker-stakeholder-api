const { v4: uuid } = require('uuid');

const stakeholderOne = Object.freeze({
  id: uuid(),
  type: 'Organization',
  org_name: 'name',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  phone: 'phone',
  website: 'website',
  logo_url: 'url',
  map: 'ma,e',
});

const stakeholderTwo = Object.freeze({
  id: uuid(),
  type: 'Person',
  org_name: 'name',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  phone: 'phone',
  website: 'website',
  logo_url: 'url',
  map: 'ma,e',
});

const stakeholderThree = Object.freeze({
  id: uuid(),
  type: 'Organization',
  org_name: 'name',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  phone: 'phone',
  website: 'website',
  logo_url: 'url',
  map: 'ma,e',
});

const seed = async function (knex) {
  await knex('stakeholder').insert([stakeholderOne, stakeholderTwo]);
};

module.exports = {
  seed,
  stakeholderOne,
  stakeholderTwo,
  stakeholderThree,
};
