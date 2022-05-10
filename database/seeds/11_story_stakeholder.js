const { v4: uuid } = require('uuid');

const stakeholderOne = Object.freeze({
  id: uuid(),
  type: 'Organization',
  org_name: 'name',
  first_name: '',
  last_name: '',
  email: 'email@name.net',
  phone: '123-456-7890',
  website: 'http://website.net',
  logo_url: 'url',
  map: 'mapname',
});

const stakeholderTwo = Object.freeze({
  id: uuid(),
  type: 'Person',
  org_name: '',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email@name.net',
  phone: '123-456-1234',
  website: 'http://website.net',
  logo_url: 'url',
  map: 'mapname',
});

const stakeholderThree = Object.freeze({
  id: uuid(),
  type: 'Organization',
  org_name: 'name',
  first_name: '',
  last_name: '',
  email: 'email@name.net',
  phone: '123-456-0987',
  website: 'http://website.net',
  logo_url: 'url',
  map: 'mapname',
});

const seed = async function (knex) {
  await knex('stakeholder').insert([
    stakeholderOne,
    stakeholderTwo,
    stakeholderThree,
  ]);
};

module.exports = {
  seed,
  stakeholderOne,
  stakeholderTwo,
  stakeholderThree,
};
