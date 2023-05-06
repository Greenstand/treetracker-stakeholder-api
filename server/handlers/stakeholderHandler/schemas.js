const Joi = require('joi');

const stakeholderGetQuerySchema = Joi.object({
  id: Joi.string().uuid(),
  type: Joi.string(),
  logo_url: Joi.string(),
  org_name: Joi.string(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  map: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  website: Joi.string(),
  search: Joi.string(),
}).unknown(false);

const stakeholderPostSchema = Joi.object({
  email: Joi.string().email(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  org_name: Joi.string(),
  logo_url: Joi.string().uri(),
  map: Joi.string(),
  phone: Joi.string(),
  website: Joi.string().uri(),
  image_url: Joi.string().allow('').uri(),
  type: Joi.string().valid('Organization', 'Person'),
  offering_pay_to_plant: Joi.boolean(),
  relation: Joi.string().valid('parents', 'children'),
  relation_id: Joi.string().uuid(),
}).unknown(false);

const stakeholderDeleteSchema = Joi.object({
  id: Joi.string().uuid(),
  type: Joi.string(),
  linked: Joi.boolean(),
  relation_id: Joi.string().uuid(),
}).unknown(false);

const updateStakeholderSchema = Joi.object({
  id: Joi.string().uuid().required(),
  email: Joi.string().email(),
  org_name: Joi.string(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  logo_url: Joi.string(),
  map: Joi.string(),
  phone: Joi.string(),
  website: Joi.string().uri(),
  children: Joi.array().items(Joi.object()),
  parents: Joi.array().items(Joi.object()),
  image_url: Joi.string().allow(''),
  type: Joi.string(),
  created_at: Joi.string(),
  updated_at: Joi.string(),
})
  .unknown(false)
  .xor('org_name', 'first_name')
  .xor('org_name', 'last_name');

module.exports = {
  stakeholderGetQuerySchema,
  updateStakeholderSchema,
  stakeholderDeleteSchema,
  stakeholderPostSchema,
};
