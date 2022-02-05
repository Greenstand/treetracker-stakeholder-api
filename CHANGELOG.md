## [1.0.4](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.0.3...v1.0.4) (2022-02-05)


### Bug Fixes

* add database migration resources ([191b124](https://github.com/Greenstand/treetracker-stakeholder-api/commit/191b124872592eb24a57053c0ada8b667378a570))

## [1.0.3](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.0.2...v1.0.3) (2022-02-05)


### Bug Fixes

* add database migration resources ([ed6d490](https://github.com/Greenstand/treetracker-stakeholder-api/commit/ed6d49098591f1c10dd6d1c12905468b6a5e968e))
* add database migration resources ([b72215e](https://github.com/Greenstand/treetracker-stakeholder-api/commit/b72215ee3fbcb45e6d521f670f66238fea121f97))

## [1.0.2](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.0.1...v1.0.2) (2022-02-05)


### Bug Fixes

* seal secrets with correct namespace ([e40820c](https://github.com/Greenstand/treetracker-stakeholder-api/commit/e40820c68b445d621e8db133d2625aed1d681162))

## [1.0.1](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.0.0...v1.0.1) (2022-02-05)


### Bug Fixes

* add database migration sealed secret ([9e5db76](https://github.com/Greenstand/treetracker-stakeholder-api/commit/9e5db7627428484c0f854b36d5f897d5d12fb41b))
* add service to mapping ([e5316de](https://github.com/Greenstand/treetracker-stakeholder-api/commit/e5316de06b6c0062b73ab3c0a0104ccd9ff9a256))

# 1.0.0 (2022-02-05)


### Bug Fixes

* add env for database to example ([6804e77](https://github.com/Greenstand/treetracker-stakeholder-api/commit/6804e77efd3b464a92559db59bd08925f478fd5c))
* add offset to baseRepository getByFilter ([561f463](https://github.com/Greenstand/treetracker-stakeholder-api/commit/561f463598abc516c7975ab4da21ea3bbe806d9f))
* improve defaults for dev env CORS ([26801a2](https://github.com/Greenstand/treetracker-stakeholder-api/commit/26801a220e0dc6d2557636014301123e8af15e89))
* linking bugs, renameing fields in snakeCase ([80c61fc](https://github.com/Greenstand/treetracker-stakeholder-api/commit/80c61fc0d99f451080442a402d18bcd7c20c6fd4))
* make tests work with current implmentation ([03a7627](https://github.com/Greenstand/treetracker-stakeholder-api/commit/03a7627940c255bd5ce941e4b9dda91493d0f309))
* move to database folder to run db-migrate ([1a54491](https://github.com/Greenstand/treetracker-stakeholder-api/commit/1a544915b7fbfc250a090a0b48f5ab91e4ef0bca))
* removed references to co-mocha ([32f8458](https://github.com/Greenstand/treetracker-stakeholder-api/commit/32f845870ee5262eb426099ef71c2300e2592245))
* resolved dependency mismatches ([eb092d3](https://github.com/Greenstand/treetracker-stakeholder-api/commit/eb092d3431029cb9983736de2d9a36ecca2a693c))
* some id bugs, lint errors ([32130fd](https://github.com/Greenstand/treetracker-stakeholder-api/commit/32130fd073321542494bc97aac431decc75b620f))
* udpate yml and pakage.json to call knex migrate instead of db-migrate ([5a4ca0d](https://github.com/Greenstand/treetracker-stakeholder-api/commit/5a4ca0d9b5a5cf09545dcadc9f1d754b8c151d0c))
* update knexfile and package.json for test env ([b97160b](https://github.com/Greenstand/treetracker-stakeholder-api/commit/b97160b774f3dd3987f5e69fb0c1d2dd7e564b92))
* update repo url in package.json ([d594100](https://github.com/Greenstand/treetracker-stakeholder-api/commit/d594100e861065ec4386a9d063d434ca41f5e473))
* updated knex to fix vulnerability ([2cf2157](https://github.com/Greenstand/treetracker-stakeholder-api/commit/2cf215742a434f292911e9a4e712a7dc1304fd73))


### Features

* /stakeholders get routes added along with tests ([92b718f](https://github.com/Greenstand/treetracker-stakeholder-api/commit/92b718f57de3515039051410b63e7bfa9fe18830))
* configure dev deployment ([93df268](https://github.com/Greenstand/treetracker-stakeholder-api/commit/93df2686309796a5a7a4acb4a6fd67158421f26a))
* creating tables and queries ([c1f7d76](https://github.com/Greenstand/treetracker-stakeholder-api/commit/c1f7d767a78fbd963fcb0674151250258e3e562b))
* link stakeholders ([7e94e3c](https://github.com/Greenstand/treetracker-stakeholder-api/commit/7e94e3c1a977b83c351a3d623d47ad1d15ee6891))
* move to node 14 and update package versions for db-migrate ([b131c5b](https://github.com/Greenstand/treetracker-stakeholder-api/commit/b131c5ba94508ef0ec757bfbc1730624e84597fc))
* query entity tables for data and insert it, account for null owner_id ([28ee409](https://github.com/Greenstand/treetracker-stakeholder-api/commit/28ee4091f40aa455e7262ed196b9a6be05356d4f))
* updating and filtering stakeholders ([5ef4152](https://github.com/Greenstand/treetracker-stakeholder-api/commit/5ef41525def8376652221f0e8561e0158ca31b87))
* use limit & offset values, get StakeholderTrees for admin, add owner_id to queries ([eca60d0](https://github.com/Greenstand/treetracker-stakeholder-api/commit/eca60d0b2921b1b3572fad6a70dce8fc680feb97))
