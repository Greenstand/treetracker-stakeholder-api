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
  type: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
}).unknown(false);

const stakeholderDeleteSchema = Joi.object({
  id: Joi.string().uuid(),
  type: Joi.string(),
  linked: Joi.boolean(),
  data: Joi.object({
    id: Joi.string().uuid().required(),
    email: Joi.string().email(),
    first_name: Joi.string(),
    last_name: Joi.string(),
    org_name: Joi.string(),
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
    .xor('org_name', 'last_name'),
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
  const { id } = req.params || req.body.relation_id;

  const stakeholderService = new StakeholderService();
  const result = await stakeholderService.createStakeholder(id, requestObject);

  res.status(201).json(result);
};

const stakeholderDelete = async function (req, res) {
  const requestObject = await stakeholderDeleteSchema.validateAsync(req.body, {
    abortEarly: false,
  });
  const { id } = req.params || req.body.relation_id;

  const stakeholderService = new StakeholderService();
  const result = await stakeholderService.deleteStakeholder(id, requestObject);

  res.status(200).json(result);
};

const stakeholderUpdate = async function (req, res) {
  const requestObject = await updateStakeholderSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  // NOT CURRENTLY IN USE
  // const { id } = req.params;
  const stakeholderService = new StakeholderService();
  const result = await stakeholderService.updateStakeholder(requestObject);

  res.status(200).json(result);
};

// const stakeholderGetRelations = async function (req, res, next) {
//   const { id } = req.params;
//   const session = new Session(false);
//   const repo = new StakeholderRepository(session);

//   const executeGetRelations = getRelations(repo, id);
//   try {
//     const result = await executeGetRelations();
//     res.send(result);
//     res.end();
//   } catch (e) {
//     next(e);
//   }
// };

// const stakeholderCreateRelation = async function (req, res, next) {
//   const { id } = req.params;
//   const session = new Session();
//   const repo = new StakeholderRepository(session);
//   const executeCreateRelation = createRelation(repo, id);

//   const createStakeholderSchema = Joi.object({
//     type: Joi.string().required(),
//     data: Joi.object().required(),
//   });

//   try {
//     const value = await createStakeholderSchema
//       .unknown(true)
//       .validateAsync(req.body, {
//         abortEarly: false,
//       });

//     const result = await executeCreateRelation(value);
//     res.send(result);
//     res.end();
//   } catch (e) {
//     next(e);
//   }
// };

// const stakeholderDeleteRelation = async function (req, res, next) {
//   const { id } = req.params;
//   const session = new Session();
//   const repo = new StakeholderRepository(session);
//   const executeDeleteRelation = deleteRelation(repo, id);
//   const executeDeleteStakeholder = deleteStakeholder(repo, id);

//   const deleteStakeholderSchema = Joi.object({
//     type: Joi.string().required(),
//     data: Joi.object().required(),
//   });

//   try {
//     const value = await deleteStakeholderSchema
//       .unknown(true)
//       .validateAsync(req.body, {
//         abortEarly: false,
//       });

//     await executeDeleteRelation(value);
//     const result = await executeDeleteStakeholder(value);
//     res.send(result);
//     res.end();
//   } catch (e) {
//     next(e);
//   }
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
