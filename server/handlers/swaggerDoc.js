const {
  stakeholderSwagger,
  stakeholderComponent,
} = require('./stakeholderHandler/docs');

const { version } = require('../../package.json');

const paths = {
  ...stakeholderSwagger,
};

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Treetracker API',
    version,
  },
  paths,
  components: {
    schemas: {
      Stakeholder: { ...stakeholderComponent },
    },
  },
};

module.exports = swaggerDefinition;
