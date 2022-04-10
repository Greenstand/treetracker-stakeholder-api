const Joi = require('joi');
const log = require('loglevel');

const {
  getAllStakeholdersById,
  getAllStakeholders,
  createStakeholder,
  deleteStakeholder,
  updateStakeholder,
  getRelations,
  createRelation,
  deleteRelation,
} = require('../models/Stakeholder');

const Session = require('../models/Session');

const StakeholderRepository = require('../repositories/StakeholderRepository');

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
  children: Joi.array(),
  parents: Joi.array(),
  users: Joi.array(),
  filter: Joi.object(),
}).unknown(false);

const stakeholderPostSchema = Joi.object({
  type: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
}).unknown();

const stakeholderDeleteSchema = Joi.object({
  type: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
}).unknown();

const stakeholderGetAll = async (req, res, next) => {
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  const query = { ...req.query, filter };
  await stakeholderGetQuerySchema.validateAsync(query, {
    abortEarly: false,
  });
  const session = new Session();
  const repo = new StakeholderRepository(session);
  const url = `${req.protocol}://${req.get('host')}/stakeholder`;
  const executeGetAll = getAllStakeholders(repo);
  try {
    const result = await executeGetAll(query, url);
    res.send(result);
    res.end();
  } catch (e) {
    next(e);
  }
};

const stakeholderGetAllById = async function (req, res, next) {
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  const query = { ...req.query, filter };
  await stakeholderGetQuerySchema.validateAsync(query, {
    abortEarly: false,
  });
  const { id } = req.params;
  const session = new Session(false);
  const repo = new StakeholderRepository(session);
  const url = `${req.protocol}://${req.get('host')}/stakeholder`;
  const executeGetById = getAllStakeholdersById(repo, id);
  try {
    const result = await executeGetById(query, url);
    res.send(result);
    res.end();
  } catch (e) {
    next(e);
  }
};

const stakeholderGetRelations = async function (req, res, next) {
  const { id } = req.params;
  const session = new Session(false);
  const repo = new StakeholderRepository(session);

  const executeGetRelations = getRelations(repo, id);
  try {
    const result = await executeGetRelations();
    res.send(result);
    res.end();
  } catch (e) {
    next(e);
  }
};

const stakeholderCreateRelation = async function (req, res, next) {
  const { id } = req.params;
  const session = new Session();
  const repo = new StakeholderRepository(session);
  const executeCreateRelation = createRelation(repo, id);

  const createStakeholderSchema = Joi.object({
    type: Joi.string().required(),
    data: Joi.object().required(),
  });

  try {
    const value = await createStakeholderSchema
      .unknown(true)
      .validateAsync(req.body, {
        abortEarly: false,
      });

    const result = await executeCreateRelation(value);
    res.send(result);
    res.end();
  } catch (e) {
    next(e);
  }
};

const stakeholderDeleteRelation = async function (req, res, next) {
  const { id } = req.params;
  const session = new Session();
  const repo = new StakeholderRepository(session);
  const executeDeleteRelation = deleteRelation(repo, id);
  const executeDeleteStakeholder = deleteStakeholder(repo, id);

  const deleteStakeholderSchema = Joi.object({
    type: Joi.string().required(),
    data: Joi.object().required(),
  });

  try {
    const value = await deleteStakeholderSchema
      .unknown(true)
      .validateAsync(req.body, {
        abortEarly: false,
      });

    await executeDeleteRelation(value);
    const result = await executeDeleteStakeholder(value);
    res.send(result);
    res.end();
  } catch (e) {
    next(e);
  }
};

const stakeholderCreate = async function (req, res, next) {
  const { id } = req.params || req.body.relation_id;
  const session = new Session();
  const repo = new StakeholderRepository(session);
  const url = `${req.protocol}://${req.get('host')}/stakeholder`;

  const executeCreate = createStakeholder(repo, id);
  const executeCreateRelation = createRelation(repo, id);
  const executeGetAll = id
    ? getAllStakeholdersById(repo, id)
    : getAllStakeholders(repo);

  try {
    const value = await stakeholderPostSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    const data = await executeCreate(value);
    await executeCreateRelation({
      type: value.relation,
      data: { ...data, relation_id: value.relation_id },
    });
    const result = await executeGetAll({ filter: {} }, url);

    res.status(201).json(result);
  } catch (e) {
    log.error(e);
    next(e);
  }
};

const stakeholderDelete = async function (req, res, next) {
  const { id } = req.params || req.body.relation_id;
  const session = new Session();
  const repo = new StakeholderRepository(session);

  const executeDelete = deleteStakeholder(repo, id);
  const executeDeleteRelation = deleteRelation(repo, id);
  const executeGetAll = id
    ? getAllStakeholdersById(repo, id)
    : getAllStakeholders(repo);

  try {
    const value = await stakeholderDeleteSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    const url = `${req.protocol}://${req.get('host')}/stakeholder`;
    delete value.data.parents;
    delete value.data.children;
    await executeDelete(value.data);
    await executeDeleteRelation({
      type: value.type,
      data: value.data,
    });
    const result = await executeGetAll({ filter: {} }, url);

    res.status(201).json(result);
  } catch (e) {
    log.error(e);
    next(e);
  }
};

const stakeholderUpdate = async function (req, res, next) {
  const { id } = req.params;
  const session = new Session();
  const repo = new StakeholderRepository(session);
  const executeUpdateStakeholder = updateStakeholder(repo, id);

  const updateStakeholderSchema = Joi.object({
    id: Joi.string().uuid().required(),
    type: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });

  try {
    const value = await updateStakeholderSchema
      .unknown(true)
      .validateAsync(req.body, {
        abortEarly: false,
      });

    const result = await executeUpdateStakeholder(value);

    res.send(result);
    res.end();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  stakeholderGetAllById,
  stakeholderGetAll,
  stakeholderGetRelations,
  stakeholderCreateRelation,
  stakeholderDeleteRelation,
  stakeholderCreate,
  stakeholderDelete,
  stakeholderUpdate,
};
