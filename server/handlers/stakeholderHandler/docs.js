const j2s = require('joi-to-swagger');
const {
  stakeholderGetQuerySchema,
  updateStakeholderSchema,
  stakeholderDeleteSchema,
  stakeholderPostSchema,
} = require('./schemas');

const { swagger: getSchema } = j2s(stakeholderGetQuerySchema);
const { swagger: patchSchema } = j2s(updateStakeholderSchema);
const { swagger: deleteSchema } = j2s(stakeholderDeleteSchema);
const { swagger: postSchema } = j2s(stakeholderPostSchema);

const stakeholderResponses = {
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          tags: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Stakeholder',
            },
          },
        },
      },
    },
  },
};

const stakeholderSwagger = {
  '/stakeholders': {
    get: {
      tags: ['stakeholders'],
      summary: 'get all stakeholders',
      parameters: [
        {
          schema: {
            ...getSchema,
          },
          in: 'query',
          name: 'query',
          description: 'Allowed query parameters',
        },
      ],
      responses: {
        200: stakeholderResponses,
      },
    },
    post: {
      tags: ['stakeholders'],
      summary: 'create a new stakeholder',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...postSchema },
          },
        },
      },
      responses: {
        201: stakeholderResponses,
      },
    },
    patch: {
      tags: ['stakeholders'],
      summary: 'update a stakeholder',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...patchSchema },
          },
        },
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Stakeholder',
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ['stakeholders'],
      summary: 'delete a stakeholder',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...deleteSchema },
          },
        },
      },
      responses: {
        200: stakeholderResponses,
      },
    },
  },
  '/stakeholders/{id}': {
    get: {
      tags: ['stakeholders'],
      summary: 'get all stakeholders',
      parameters: [
        {
          schema: {
            ...getSchema,
          },
          in: 'query',
          name: 'query',
          description: 'Allowed query parameters',
        },
      ],
      responses: {
        200: stakeholderResponses,
      },
    },
    post: {
      tags: ['stakeholders'],
      summary: 'create a new stakeholder',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...postSchema },
          },
        },
      },
      responses: {
        201: stakeholderResponses,
      },
    },
    patch: {
      tags: ['stakeholders'],
      summary: 'update a stakeholder',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...patchSchema },
          },
        },
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Stakeholder',
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ['stakeholders'],
      summary: 'delete a stakeholder',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...deleteSchema },
          },
        },
      },
      responses: {
        200: stakeholderResponses,
      },
    },
  },
};

const stakeholder = {
  id: { type: 'string', format: 'uuid' },
  type: { type: 'string' },
  org_name: { type: 'string' },
  first_name: { type: 'string' },
  last_name: { type: 'string' },
  email: { type: 'string', format: 'email' },
  phone: { type: 'string' },
  website: { type: 'string' },
  logo_url: { type: 'string' },
  map: { type: 'string' },
};

const stakeholderComponent = {
  type: 'object',
  properties: {
    ...stakeholder,
    children: {
      type: 'array',
      items: { type: 'object', properties: { ...stakeholder } },
    },
    parents: {
      type: 'array',
      items: { type: 'object', properties: { ...stakeholder } },
    },
  },
};

module.exports = { stakeholderSwagger, stakeholderComponent };
