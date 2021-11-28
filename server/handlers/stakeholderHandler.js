const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const {
  createStakeholder,
  getStakeholders,
  updateStakeholder,
} = require('../models/Stakeholder');
// const { dispatch } = require('../models/DomainEvent');

const Session = require('../models/Session');
// const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');

// const {
//   StakeholderRepository,
//   EventRepository,
// } = require('../infra/database/PgRepositories');

const StakeholderRepository = require('../repositories/StakeholderRepository');

const stakeholderGetQuerySchema = Joi.object({
  id: Joi.string().uuid(),
  organization_id: Joi.number().integer(),
  limit: Joi.number().integer().greater(0).less(101),
  skip: Joi.number().integer().greater(-1),
  type: Joi.string(),
  logo: Joi.string(),
  name: Joi.string(),
  map: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  website: Joi.string(),
  children: Joi.array(),
  parents: Joi.array(),
  users: Joi.array(),
}).unknown(false);

const stakeholderGet = async (req, res) => {
  await stakeholderGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });
  const session = new Session();
  const stakeholderRepo = new StakeholderRepository(session);

  const url = `${req.protocol}://${req.get('host')}/stakeholder`; // isn't url set on the repository? or is this to override the repository's default url?

  const executeGetStakeholders = getStakeholders(stakeholderRepo);
  console.log('stakeholderHanlder req.query, url -----> ', req.query, url);
  const result = await executeGetStakeholders(req.query, url);
  res.send(result);
  res.end();
};

// const stakeholderGetById = async function (req, res) {
//   console.log('STAKEHOLDER HANDLER get by id', req.params);
//   const { id } = req.params;
//   const session = new Session(false);
//   const stakeholderRepo = new StakeholderRepository(session);
//   const executeGetStakeholder = getStakeholderById(stakeholderRepo, id);
//   const result = await executeGetStakeholder(id);
//   console.log('STAKEHOLDER HANDLER get by id result', result);
//   res.json(result);
//   res.end();
// };

const stakeholderPost = async function (req, res) {
  const session = new Session();
  const stakeholderRepo = new StakeholderRepository(session);
  // const eventRepository = new EventRepository(session);
  const executeCreateStakeholder = createStakeholder(
    stakeholderRepo,
    // eventRepository,
  );

  // const eventDispatch = dispatch(eventRepository, publishMessage);

  try {
    console.log('STAKEHOLDER ROUTER post', req.body, stakeholder);
    const newStakeholder = stakeholderFromRequest({ ...stakeholder });
    await session.beginTransaction();
    const { entity /*raisedEvents*/ } = await executeCreateStakeholder(
      newStakeholder,
    );
    console.log(
      'STAKEHOLDER ROUTER execute create capture',
      entity,
      // raisedEvents,
    );
    await session.commitTransaction();
    // raisedEvents.forEach((domainEvent) =>
    //   eventDispatch('stakeholder-created', domainEvent),
    // );
    res.status(201).json({
      ...entity,
    });
  } catch (e) {
    console.log(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    let result = e;
    res.status(422).json({ ...result });
  }
};

const stakeholderPatch = async function (req, res, next) {
  const { capture_id } = req.params;
  const session = new Session();
  const stakeholderRepo = new StakeholderRepository(session);
  const executeUpdateStakeholder = updateStakeholder(stakeholderRepo);
  const updateStakeholderSchema = Joi.object({
    id: Joi.string().required(),
    type: Joi.string().required(),
    logo: Joi.number().integer().greater(0).less(101),
    name: Joi.number().integer().greater(-1),
    map: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    website: Joi.string().required(),
    children: Joi.array().required(),
    parents: Joi.array().required(),
    users: Joi.array().required(),
    contracts: Joi.array().required(),
  });
  try {
    const value = await updateStakeholderSchema
      .unknown(true)
      .validateAsync(req.body, {
        abortEarly: false,
      });
    const result = await executeUpdateStakeholder({
      id: capture_id,
      ...req.body,
    });
    console.log('STAKEHOLDER ROUTER update result', result);
    res.send(result);
    res.end();
  } catch (e) {
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(e);
  }
};

module.exports = {
  stakeholderGet,
  stakeholderPost,
  stakeholderPatch,
};
