const j2s = require('joi-to-swagger');
const {
  appConfigPostSchema,
  activateAppConfigSchema,
  appConfigGetQuerySchema,
  appInstallationsGetQuerySchema,
} = require('./schemas');

const { swagger: configPostSchema } = j2s(appConfigPostSchema);
const { swagger: configGetSchema } = j2s(appConfigGetQuerySchema);
const { swagger: installationGetSchema } = j2s(appInstallationsGetQuerySchema);
const { swagger: activateConfigSchema } = j2s(activateAppConfigSchema);

const appConfigResponse = {
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/AppConfig',
      },
    },
  },
};

const appConfigSwagger = {
  '/app_config': {
    get: {
      tags: ['app_config'],
      summary: 'get all app configs',
      parameters: [
        {
          schema: {
            ...configGetSchema,
          },
          in: 'query',
          name: 'query',
          description: 'Allowed query parameters',
        },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  appConfigs: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/AppConfig',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['app_config'],
      summary: 'create a new app config',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...configPostSchema },
          },
        },
      },
      responses: {
        201: appConfigResponse,
      },
    },
  },
  '/app_installation': {
    get: {
      tags: ['app_config'],
      summary: 'get all app installations',
      parameters: [
        {
          schema: {
            ...installationGetSchema,
          },
          in: 'query',
          name: 'query',
          description: 'Allowed query parameters',
        },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  appInstallations: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/AppInstallation',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/activate_app_config': {
    post: {
      tags: ['app_config'],
      summary: 'bind a wallet to an app_config',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...activateConfigSchema },
          },
        },
      },
      responses: {
        201: appConfigResponse,
      },
    },
  },
};

const appConfigComponent = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    config_code: { type: 'string' },
    stakeholder_id: { type: 'string', format: 'uuid' },
    org_name: { type: 'string' },
    capture_flow: { type: 'object' },
    capture_setup_flow: { type: 'object' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
    app_installation_count: { type: 'number' },
  },
};

const appInstallationComponent = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    wallet: { type: 'string' },
    app_config_id: { type: 'string', format: 'uuid' },
    config_code: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' },
    latest_login_at: { type: 'string', format: 'date-time' },
  },
};

module.exports = {
  appConfigComponent,
  appInstallationComponent,
  appConfigSwagger,
};
