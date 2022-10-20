## [1.3.8](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.3.7...v1.3.8) (2022-10-20)


### Bug Fixes

* add entity id migration ([1439f8b](https://github.com/Greenstand/treetracker-stakeholder-api/commit/1439f8b45a4041fb82b0ab19775e7045d3ac2615))

## [1.3.7](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.3.6...v1.3.7) (2022-07-10)


### Bug Fixes

* reduce knexfile max pool ([7575b51](https://github.com/Greenstand/treetracker-stakeholder-api/commit/7575b514b4ba4f4d8aa421e10b01f1c96db808e0))

## [1.3.6](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.3.5...v1.3.6) (2022-07-10)


### Bug Fixes

* seeds ([b7e203b](https://github.com/Greenstand/treetracker-stakeholder-api/commit/b7e203bbb18f280d72664c6a2142914804dba018))

## [1.3.5](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.3.4...v1.3.5) (2022-07-10)


### Bug Fixes

* update max connection ([f7abc7c](https://github.com/Greenstand/treetracker-stakeholder-api/commit/f7abc7cddeb14a5f4efd8d63b1dc66d33b3c4cd1))

## [1.3.4](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.3.3...v1.3.4) (2022-06-29)


### Bug Fixes

* reduce max pool connections ([fbb686c](https://github.com/Greenstand/treetracker-stakeholder-api/commit/fbb686c40f96028db90f2f3ff59357207a16d5cc))

## [1.3.3](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.3.2...v1.3.3) (2022-06-27)


### Bug Fixes

* refactor sql for get stakeholders request ([f9810e0](https://github.com/Greenstand/treetracker-stakeholder-api/commit/f9810e0ae3989bac4716bbd06e8a4a0bc5062956))
* remove extra test ([6ae7886](https://github.com/Greenstand/treetracker-stakeholder-api/commit/6ae788612dc018831557e5f2195ec196119e6d20))

## [1.3.2](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.3.1...v1.3.2) (2022-06-22)


### Bug Fixes

* db url check ([cb3cda2](https://github.com/Greenstand/treetracker-stakeholder-api/commit/cb3cda27240aa85c19051ef758bf4b1b84b1d590))
* remove extra db connection file ([12642c8](https://github.com/Greenstand/treetracker-stakeholder-api/commit/12642c8757074842a7552849bc81179e224ced30))

## [1.3.1](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.3.0...v1.3.1) (2022-06-11)


### Bug Fixes

* typo for applying offset to queries ([d2ff280](https://github.com/Greenstand/treetracker-stakeholder-api/commit/d2ff280688fe90152d385c611d315a18393a2c77))

# [1.3.0](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.2.4...v1.3.0) (2022-05-17)


### Bug Fixes

* add DATABASE_URL_SEEDER to CI ([9ea1f77](https://github.com/Greenstand/treetracker-stakeholder-api/commit/9ea1f776f148f2e05e9716a35518a230da0cc005))
* add seeding as a step for CI ([91117c1](https://github.com/Greenstand/treetracker-stakeholder-api/commit/91117c1a9caad80b375aacca99838878251cb645))
* data for seeds ([f779d2b](https://github.com/Greenstand/treetracker-stakeholder-api/commit/f779d2b30fc7f67c262dbb329927a3e161d53e37))
* lint errors and remove commented code ([ffb193b](https://github.com/Greenstand/treetracker-stakeholder-api/commit/ffb193bc060dcf2031651a2c47f684a6c6a1c84c))
* minor review updates ([73d13da](https://github.com/Greenstand/treetracker-stakeholder-api/commit/73d13daa671f5652854a2fba4c26ca37032f7bc4))
* minor updates ([740a390](https://github.com/Greenstand/treetracker-stakeholder-api/commit/740a390d2afbd748aca85e12c1f23dd6d6e4c650))
* modify update stakeholder schema ([02007b1](https://github.com/Greenstand/treetracker-stakeholder-api/commit/02007b1fe9110b6dfdedf765b96da0968a545423))
* refactor stakeholder ([d46c7ec](https://github.com/Greenstand/treetracker-stakeholder-api/commit/d46c7ec6e68786166cfecedebc80370de4b0cf9c))
* tests ([90d3d53](https://github.com/Greenstand/treetracker-stakeholder-api/commit/90d3d532f0bbe1ac180b3df3096e5efdabceffa6))
* tests ([f4dc14d](https://github.com/Greenstand/treetracker-stakeholder-api/commit/f4dc14dcd3743e11c0a7b771b1fbc95ec1436d74))
* update tests and yaml to match api w/o offset, limit, owner_id, etc ([3d52c7d](https://github.com/Greenstand/treetracker-stakeholder-api/commit/3d52c7dc8da923542d5e54df40d54e1f875d6d87))


### Features

* add active column to stakeholder, remove deleteRelation endpoint ([11ac043](https://github.com/Greenstand/treetracker-stakeholder-api/commit/11ac043ebd53f30a3aeb3b9ca23f0d6b0101e6e9))
* add active column to stakeholder, remove deleteRelation endpoint ([9515d89](https://github.com/Greenstand/treetracker-stakeholder-api/commit/9515d896487350fbef36a95f4d556aa92ea08222))
* add relation when creating, remove when deleting, allow partial search, improve filter ([f4d91a4](https://github.com/Greenstand/treetracker-stakeholder-api/commit/f4d91a40e587f30a04d8a1001d3da69dbe9a2151))
* fix errors with validation, don't delete stakeholder just relation ([5327637](https://github.com/Greenstand/treetracker-stakeholder-api/commit/5327637ff69bb5737fc293303baf973c27a396b3))
* only respond with cols that client needs, not 'active' col ([06b2f01](https://github.com/Greenstand/treetracker-stakeholder-api/commit/06b2f01ad3ee19e5f8c729f5e615a475f2897588))

## [1.2.4](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.2.3...v1.2.4) (2022-03-28)


### Bug Fixes

* remove stakeholder schema reference in migration ([68ca6d3](https://github.com/Greenstand/treetracker-stakeholder-api/commit/68ca6d314b9b9bc3e8bc5a226b4a0ed2be476a9a))
* res.status error ([02bacff](https://github.com/Greenstand/treetracker-stakeholder-api/commit/02bacffae491e5a3b51ba4233e08ea07def545a4))

## [1.2.3](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.2.2...v1.2.3) (2022-03-16)


### Bug Fixes

* linting ([3e68fff](https://github.com/Greenstand/treetracker-stakeholder-api/commit/3e68fff63084ee2f44842abb5013c5ee7ab88080))

## [1.2.2](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.2.1...v1.2.2) (2022-03-11)


### Bug Fixes

* update sealed secrets ([ce655d9](https://github.com/Greenstand/treetracker-stakeholder-api/commit/ce655d95fc03b1bb87dcc02dd2ec85f2833d0411))

## [1.2.1](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.2.0...v1.2.1) (2022-03-11)


### Bug Fixes

* add affinity to database migration job ([8c71336](https://github.com/Greenstand/treetracker-stakeholder-api/commit/8c7133699dfec4c5948be59989ccc4ee6ab0fe9d))
* add production overlay ([766fe1c](https://github.com/Greenstand/treetracker-stakeholder-api/commit/766fe1c6ce0de69b4f74afaf34d340c26c223e53))

# [1.2.0](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.1.6...v1.2.0) (2022-03-11)


### Bug Fixes

* add api tests back in ([7f197ad](https://github.com/Greenstand/treetracker-stakeholder-api/commit/7f197ad97174d5b9eafab4fad2eff81a9be89fec))
* clean up unnecessary configs ([395b38a](https://github.com/Greenstand/treetracker-stakeholder-api/commit/395b38a9296ccf8a6c39e0872282da086e0a87a6))
* database connection file ([95100d2](https://github.com/Greenstand/treetracker-stakeholder-api/commit/95100d2457de07f4f5158bd1b3e52910dbb2672d))
* env ([2c922d2](https://github.com/Greenstand/treetracker-stakeholder-api/commit/2c922d29dee9a2b0fdbb52202183c3e582552d22))
* linting ([cea8247](https://github.com/Greenstand/treetracker-stakeholder-api/commit/cea824740ff37ee53c3afce7483c942198ca731c))
* linting ([c5032a3](https://github.com/Greenstand/treetracker-stakeholder-api/commit/c5032a3d6e8b0bd1c532e2c8f90a2c070ebab57f))
* paths ([7f419a9](https://github.com/Greenstand/treetracker-stakeholder-api/commit/7f419a9e78eeada67d5f6fc33f62f0dce23a9a95))
* remove incorrect NOT NULLs ([353b2cd](https://github.com/Greenstand/treetracker-stakeholder-api/commit/353b2cda4d855b2340db600e8642f6353621bf27))
* remove legacy columns from db table and seed ([4cda88e](https://github.com/Greenstand/treetracker-stakeholder-api/commit/4cda88ec5e88b0883e68ec1e66286ee183258306))
* tests and seeds ([68a4ff3](https://github.com/Greenstand/treetracker-stakeholder-api/commit/68a4ff37972c6d9610c2064fc8545257f86511a9))


### Features

* add children function ([94388c7](https://github.com/Greenstand/treetracker-stakeholder-api/commit/94388c7387640edc2520275bbfc1c4b3437ffa19))

## [1.1.6](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.1.5...v1.1.6) (2022-03-09)


### Bug Fixes

* added children function ([0e22609](https://github.com/Greenstand/treetracker-stakeholder-api/commit/0e226097336bd87734386ee7b4c831720575b2b8))

## [1.1.5](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.1.4...v1.1.5) (2022-03-09)


### Bug Fixes

* prevent knex from doing migrations on startup ([f8f622a](https://github.com/Greenstand/treetracker-stakeholder-api/commit/f8f622ac18d3df0889e6ae770d436ae129e2c7c5))

## [1.1.4](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.1.3...v1.1.4) (2022-03-09)


### Bug Fixes

* add postgres extension uuid-ossp ([97b87c1](https://github.com/Greenstand/treetracker-stakeholder-api/commit/97b87c15c3ea27dd87124a3f2ede8efe3cac0160))
* linting ([2e9020e](https://github.com/Greenstand/treetracker-stakeholder-api/commit/2e9020e78217ef3b3d0fcab94fe725b8f4999e2c))
* update migration script ([f89df5b](https://github.com/Greenstand/treetracker-stakeholder-api/commit/f89df5b8e95a250b66156a05c042d4083cd57163))
* use db-migrate ([7d12e76](https://github.com/Greenstand/treetracker-stakeholder-api/commit/7d12e76c744d5ff78b4cc9d309ff7dd6f718bdd7))

## [1.1.3](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.1.2...v1.1.3) (2022-03-04)


### Bug Fixes

* update migration test env ([aa1eabf](https://github.com/Greenstand/treetracker-stakeholder-api/commit/aa1eabf0ad367ab15cdd57f544b88c840604b315))

## [1.1.2](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.1.1...v1.1.2) (2022-03-04)


### Bug Fixes

* update migration test env ([a61cf6f](https://github.com/Greenstand/treetracker-stakeholder-api/commit/a61cf6f0a378ea60f06728ca4c0a5c88b96c637f))

## [1.1.1](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.1.0...v1.1.1) (2022-03-03)


### Bug Fixes

* update migration in test env ([4423ae5](https://github.com/Greenstand/treetracker-stakeholder-api/commit/4423ae56bb4aa2098966028ae6de8888d658448e))

# [1.1.0](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.0.7...v1.1.0) (2022-02-06)


### Bug Fixes

* comment out failing validation tests ([9ff5bd9](https://github.com/Greenstand/treetracker-stakeholder-api/commit/9ff5bd9d7066b32072be8f62f276869daa430c04))
* incomplete test fixes ([e73b5fa](https://github.com/Greenstand/treetracker-stakeholder-api/commit/e73b5fad335953e411f4f746ed84b08d6321a26d))
* link errors ([222b61b](https://github.com/Greenstand/treetracker-stakeholder-api/commit/222b61b423d313264212a8b468a754dbcba95628))
* link errors ([daf6892](https://github.com/Greenstand/treetracker-stakeholder-api/commit/daf6892aafd37dc98eaac22730ce4ed5a2bb10c5))
* link errors ([c87aec0](https://github.com/Greenstand/treetracker-stakeholder-api/commit/c87aec05470357702501e26344f7b0a4e8c36ae4))
* tests to reference new names from model ([fbf0b01](https://github.com/Greenstand/treetracker-stakeholder-api/commit/fbf0b018db28ff4d7fe9e2b91780eabaec3a5c2b))
* uncomment the database url test ([bdd8a20](https://github.com/Greenstand/treetracker-stakeholder-api/commit/bdd8a207aee7bbc2e3c553548ac30bd1d701e90f))


### Features

* start adding validation, add documentation for migrating ([28c0133](https://github.com/Greenstand/treetracker-stakeholder-api/commit/28c0133f85c083459a7b4a3c17582f5b6e0b5c53))

## [1.0.7](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.0.6...v1.0.7) (2022-02-06)


### Bug Fixes

* point deployment to correct secret name ([17a3d00](https://github.com/Greenstand/treetracker-stakeholder-api/commit/17a3d009447eb8495eccac4412a4fed42e8de5b3))

## [1.0.6](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.0.5...v1.0.6) (2022-02-05)


### Bug Fixes

* reset database passwords ([b24f8d7](https://github.com/Greenstand/treetracker-stakeholder-api/commit/b24f8d7dc0fd89f15b8dca78d1ce997b92093711))

## [1.0.5](https://github.com/Greenstand/treetracker-stakeholder-api/compare/v1.0.4...v1.0.5) (2022-02-05)


### Bug Fixes

* add database migration resources ([85e17d3](https://github.com/Greenstand/treetracker-stakeholder-api/commit/85e17d38ee931a9e8d54658142bf99c32a9faf87))

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
