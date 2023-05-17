const Joi = require('joi');

const appConfigPostSchema = Joi.object({
  stakeholder_id: Joi.string().uuid().required(),
  config_code: Joi.string().alphanum().required(),
  capture_flow: Joi.object(),
  capture_setup_flow: Joi.object(),
});

const activateAppConfigSchema = Joi.object({
  wallet: Joi.string().required(),
  config_code: Joi.string().alphanum().required(),
});

const appConfigGetQuerySchema = Joi.object({
  stakeholder_id: Joi.string().uuid(),
  config_code: Joi.string().alphanum(),
  limit: Joi.number().integer().min(1),
  offset: Joi.number().integer().min(0),
});

const appInstallationsGetQuerySchema = Joi.object({
  wallet: Joi.string(),
  stakeholder_id: Joi.string().uuid(),
  config_code: Joi.string().alphanum(),
  limit: Joi.number().integer().min(1),
  offset: Joi.number().integer().min(0),
});

module.exports = {
  appConfigPostSchema,
  activateAppConfigSchema,
  appConfigGetQuerySchema,
  appInstallationsGetQuerySchema,
};
