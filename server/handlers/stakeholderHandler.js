const Joi = require('joi');
const StakeholderService = require('../services/StakeholderService');
const {
  getFilterAndLimitOptions,
  generatePrevAndNext,
} = require('../utils/helper');

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
  email: Joi.string(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  org_name: Joi.string(),
  logo_url: Joi.string(),
  map: Joi.string(),
  phone: Joi.string(),
  website: Joi.string().uri(),
  image_url: Joi.string().allow(''),
  type: Joi.string(),
  offering_pay_to_plant: Joi.boolean(),
  relation: Joi.string(),
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

const stakeholderGetAll = async (req, res) => {
  await stakeholderGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);
  const stakeholderService = new StakeholderService();

  const { stakeholders, totalCount } =
    await stakeholderService.getAllStakeholders(filter, limitOptions);

  const url = 'stakeholders';

  const links = generatePrevAndNext({
    url,
    count: totalCount,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    stakeholders,
    links,
    totalCount,
    query: { ...limitOptions, ...filter },
  });
};

const stakeholderGetAllById = async (req, res) => {
  await stakeholderGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });
  const { id } = req.params;

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);
  const stakeholderService = new StakeholderService();

  const { stakeholders, totalCount } =
    await stakeholderService.getAllStakeholdersById(id, filter, limitOptions);

  const url = `stakeholders/${id}`;

  const links = generatePrevAndNext({
    url,
    count: totalCount,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    stakeholders,
    links,
    totalCount,
    query: { ...limitOptions, ...filter },
  });
};

const stakeholderCreate = async function (req, res) {
  const requestObject = await stakeholderPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });
  const { id } = req.params;

  const stakeholderService = new StakeholderService();
  const result = await stakeholderService.createStakeholder(id, requestObject);

  res.status(201).json(result);
};

const stakeholderDelete = async function (req, res) {
  const requestObject = await stakeholderDeleteSchema.validateAsync(req.body, {
    abortEarly: false,
  });
  const { id } = req.params;

  const stakeholderService = new StakeholderService();
  const result = await stakeholderService.deleteStakeholder(id, requestObject);

  res.status(200).json(result);
};

const stakeholderUpdate = async function (req, res) {
  const requestObject = await updateStakeholderSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const stakeholderService = new StakeholderService();
  const result = await stakeholderService.updateStakeholder(requestObject);

  res.status(200).json(result);
};

// const stakeholderDeleteRelation = async function (req, res) {
//   const requestObject = await stakeholderDeleteSchema.validateAsync(req.body, {
//     abortEarly: false,
//   });
//   const { id } = req.params;

//   const stakeholderService = new StakeholderService();
//   const result = await stakeholderService.deleteRelation(id, requestObject);

//   res.status(200).json(result);
// };

module.exports = {
  stakeholderGetAllById,
  stakeholderGetAll,
  // stakeholderGetRelations,
  // stakeholderCreateRelation,
  // stakeholderDeleteRelation,
  stakeholderCreate,
  stakeholderDelete,
  stakeholderUpdate,
};
