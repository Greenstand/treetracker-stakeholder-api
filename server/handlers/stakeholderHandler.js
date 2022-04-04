const Joi = require('joi');
const log = require('loglevel');

const {
  getAllStakeholdersById,
  getAllStakeholders,
  createStakeholder,
  updateStakeholder,
  getRelations,
  getNonRelations,
  createRelation,
  deleteRelation,
} = require('../models/Stakeholder');
// const { dispatch } = require('../models/DomainEvent');

const Session = require('../models/Session');
// const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');

const StakeholderRepository = require('../repositories/StakeholderRepository');

const stakeholderGetQuerySchema = Joi.object({
  id: Joi.string().uuid(),
  // organization_id: Joi.number().integer(),
  // owner_id: Joi.string().uuid(),
  limit: Joi.number().integer().greater(0).less(101),
  offset: Joi.number().integer().greater(-1),
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

const stakeholderGetAll = async (req, res, next) => {
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  const query = { ...req.query, filter };
  await stakeholderGetQuerySchema.validateAsync(query, {
    abortEarly: false,
  });
  const session = new Session();
  const stakeholderRepo = new StakeholderRepository(session);

  const url = `${req.protocol}://${req.get('host')}/stakeholder`;

  const executeGetAllStakeholders = getAllStakeholders(stakeholderRepo);
  try {
    const result = await executeGetAllStakeholders(query, url);
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
  const stakeholderRepo = new StakeholderRepository(session);
  const url = `${req.protocol}://${req.get('host')}/stakeholder`;
  const executeGetStakeholders = getAllStakeholdersById(stakeholderRepo, id);
  try {
    const result = await executeGetStakeholders(query, url);
    res.send(result);
    res.end();
  } catch (e) {
    next(e);
  }
};

const stakeholderGetRelations = async function (req, res, next) {
  const { id } = req.params;
  const { isRelation = true, owner_id = null } = req.query;
  const session = new Session(false);
  const stakeholderRepo = new StakeholderRepository(session);

  if (isRelation !== 'false') {
    const executeGetRelations = getRelations(stakeholderRepo, id);
    try {
      const result = await executeGetRelations(owner_id);
      res.send(result);
      res.end();
    } catch (e) {
      next(e);
    }
  } else {
    const executeGetNonRelations = getNonRelations(stakeholderRepo, id);
    try {
      const result = await executeGetNonRelations(owner_id);
      res.send(result);
      res.end();
    } catch (e) {
      next(e);
    }
  }
};

const stakeholderCreateRelation = async function (req, res, next) {
  const { id } = req.params;
  const session = new Session();
  const stakeholderRepo = new StakeholderRepository(session);
  const executeCreateRelation = createRelation(stakeholderRepo, id);

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
  const stakeholderRepo = new StakeholderRepository(session);
  const executeDeleteRelation = deleteRelation(stakeholderRepo, id);

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

    const result = await executeDeleteRelation(value);
    res.send(result);
    res.end();
  } catch (e) {
    next(e);
  }
};

const stakeholderCreate = async function (req, res, next) {
  const { id } = req.params;
  const session = new Session();
  const stakeholderRepo = new StakeholderRepository(session);

  // const eventRepository = new EventRepository(session);
  const executeCreateStakeholder = createStakeholder(
    stakeholderRepo,
    id,
    // eventRepository,
  );

  // const eventDispatch = dispatch(eventRepository, publishMessage);

  const stakeholderPostSchema = Joi.object({
    type: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  }).unknown();

  try {
    const value = await stakeholderPostSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    // await session.beginTransaction();
    const result = await executeCreateStakeholder({
      ...value,
    });

    // await session.commitTransaction();
    // raisedEvents.forEach((domainEvent) =>
    //   eventDispatch('stakeholder-created', domainEvent),
    // );
    res.status(201).json(result);
  } catch (e) {
    log.error(e);
    // if (session.isTransactionInProgress()) {
    //   await session.rollbackTransaction();
    // }
    // res.status(422).json({ ...e });
    next(e);
  }
};

const stakeholderUpdate = async function (req, res, next) {
  const { id } = req.params;
  const session = new Session();
  const stakeholderRepo = new StakeholderRepository(session);
  const executeUpdateStakeholder = updateStakeholder(stakeholderRepo, id);

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

    const result = await executeUpdateStakeholder({
      ...value,
    });

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
  stakeholderUpdate,
};
