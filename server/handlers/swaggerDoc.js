const {
  stakeholderSwagger,
  stakeholderComponent,
} = require('./stakeholderHandler/docs');
const {
  appConfigSwagger,
  appConfigComponent,
  appInstallationComponent,
} = require('./appConfigHandler/docs');

const { version } = require('../../package.json');

const paths = {
  ...stakeholderSwagger,
  ...appConfigSwagger,
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
      AppConfig: { ...appConfigComponent },
      Stakeholder: { ...stakeholderComponent },
      AppInstallation: { ...appInstallationComponent },
    },
  },
};

module.exports = swaggerDefinition;
