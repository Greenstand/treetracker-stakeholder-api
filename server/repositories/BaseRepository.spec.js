const { expect } = require('chai');
const mockKnex = require('mock-knex');
const BaseRepository = require('./BaseRepository');
const knex = require('../../database/connection');

const tracker = mockKnex.getTracker();
const Session = require('../models/Session');

describe('BaseRepository', () => {
  let baseRepository;

  beforeEach(() => {
    mockKnex.mock(knex);
    tracker.install();
    const session = new Session();
    baseRepository = new BaseRepository('testTable', session);
  });

  afterEach(() => {
    tracker.uninstall();
    mockKnex.unmock(knex);
  });

  it('getById', async () => {
    tracker.uninstall();
    tracker.install();
    tracker.on('query', (query) => {
      expect(query.sql).match(/select.*testTable.*/);
      query.response([{ id: 1 }]);
    });
    const entity = await baseRepository.getById(1);
    expect(entity).property('id').eq(1);
  });

  // TODO
  // it.skip('getById can not find result, should throw 404', () => {});

  describe('getByFilter', () => {
    it('getByFilter', async () => {
      tracker.uninstall();
      tracker.install();
      tracker.on('query', (query) => {
        expect(query.sql).match(/select.*testTable.*name.*/) ||
          expect(query.sql).match(/select.*.count.*entity.*/);
        const response = query.sql.includes('count')
          ? [{ count: 1 }]
          : [{ id: 1 }];
        query.response(response);
      });
      const { result, count } = await baseRepository.getByFilter({
        name: 'testName',
      });
      expect(result).lengthOf(1);
      expect(count).eql(1);
      expect(result[0]).property('id').eq(1);
    });

    it('getByFilter with limit', async () => {
      tracker.uninstall();
      tracker.install();
      tracker.on('query', (query) => {
        let bool = query.sql.match(/select.*.count.*testTable.*/);
        if (!bool) bool = query.sql.match(/select.*testTable.*limit.*/);
        expect(bool);
        const response = query.sql.includes('count')
          ? [{ count: 1 }]
          : [{ id: 1 }];
        query.response(response);
      });
      const { result, count } = await baseRepository.getByFilter(
        {
          name: 'testName',
        },
        {
          limit: 1,
        },
      );
      expect(result).lengthOf(1);
      expect(count).eql(1);
      expect(result[0]).property('id').eq(1);
    });

    it('getByFilter with offset', async () => {
      tracker.uninstall();
      tracker.install();
      tracker.on('query', (query) => {
        let bool = query.sql.match(/select.*.count.*testTable.*/);
        if (!bool) bool = query.sql.match(/select.*testTable.*offset.*/);
        expect(bool);
        const response = query.sql.includes('count')
          ? [{ count: 1 }]
          : [{ id: 1 }];
        query.response(response);
      });
      const { result, count } = await baseRepository.getByFilter(
        {
          name: 'testName',
        },
        {
          offset: 1,
        },
      );
      expect(result).lengthOf(1);
      expect(count).eql(1);
      expect(result[0]).property('id').eq(1);
    });

    describe("'and' 'or' phrase", () => {
      it('{and: [{c:1}, {b:2}]}', async () => {
        tracker.uninstall();
        tracker.install();
        tracker.on('query', (query) => {
          expect(query.sql).match(
            /select.*testTable.*where.*c1.*=.*and.*c2.*=.*/,
          ) || expect(query.sql).match(/select.*.count.*entity.*/);
          const response = query.sql.includes('count')
            ? [{ count: 1 }]
            : [{ id: 1 }];
          query.response(response);
        });
        const { result, count } = await baseRepository.getByFilter({
          and: [
            {
              c1: 1,
            },
            {
              c2: 2,
            },
          ],
        });
        expect(count).eql(1);
        expect(result).lengthOf(1);
        expect(result[0]).property('id').eq(1);
      });

      it('{or: [{c:1}, {b:2}]}', async () => {
        tracker.uninstall();
        tracker.install();
        tracker.on('query', (query) => {
          expect(query.sql).match(
            /select.*testTable.*where.*c1.*=.*or.*c2.*=.*/,
          ) || expect(query.sql).match(/select.*.count.*entity.*/);
          const response = query.sql.includes('count')
            ? [{ count: 1 }]
            : [{ id: 1 }];
          query.response(response);
        });
        const { result, count } = await baseRepository.getByFilter({
          or: [
            {
              c1: 1,
            },
            {
              c2: 2,
            },
          ],
        });
        expect(count).eql(1);
        expect(result).lengthOf(1);
        expect(result[0]).property('id').eq(1);
      });

      it('{and: [{c:1}, {b:2}, {or: [{d:1}, {e:1}]]}', async () => {
        tracker.uninstall();
        tracker.install();
        tracker.on('query', (query) => {
          expect(query.sql).match(
            /select.*testTable.*where.*c1.*=.*and.*c2.*=.*and.*c3.*or.*c4.*/,
          ) || expect(query.sql).match(/select.*.count.*entity.*/);
          const response = query.sql.includes('count')
            ? [{ count: 1 }]
            : [{ id: 1 }];
          query.response(response);
        });
        const { result, count } = await baseRepository.getByFilter({
          and: [
            {
              c1: 1,
            },
            {
              c2: 2,
            },
            {
              or: [
                {
                  c3: 1,
                },
                {
                  c4: 1,
                },
              ],
            },
          ],
        });
        expect(count).eql(1);
        expect(result).lengthOf(1);
        expect(result[0]).property('id').eq(1);
      });

      it('{or: [{c:1}, {b:2}, {and: [{d:1}, {e:1}]]}', async () => {
        tracker.uninstall();
        tracker.install();
        tracker.on('query', (query) => {
          // console.log('sql:', query.sql);
          expect(query.sql).match(
            /select.*testTable.*where.*c1.*=.*or.*c2.*=.*or.*c3.*and.*c4.*/,
          ) || expect(query.sql).match(/select.*.count.*entity.*/);
          const response = query.sql.includes('count')
            ? [{ count: 1 }]
            : [{ id: 1 }];
          query.response(response);
        });
        const { result, count } = await baseRepository.getByFilter({
          or: [
            {
              c1: 1,
            },
            {
              c2: 2,
            },
            {
              and: [
                {
                  c3: 1,
                },
                {
                  c4: 1,
                },
              ],
            },
          ],
        });
        expect(count).eql(1);
        expect(result).lengthOf(1);
        expect(result[0]).property('id').eq(1);
      });

      it('(a=1 and b =2) or (a=2 and b=1)', async () => {
        tracker.uninstall();
        tracker.install();
        tracker.on('query', (query) => {
          // console.log('sql:', query.sql);
          expect(query.sql).match(
            /select.*testTable.*where.*c3.*=.*and.*c4.*=.*or.*c3.*and.*c4.*/,
          ) || expect(query.sql).match(/select.*.count.*entity.*/);
          const response = query.sql.includes('count')
            ? [{ count: 1 }]
            : [{ id: 1 }];
          query.response(response);
        });
        const { result, count } = await baseRepository.getByFilter({
          or: [
            {
              and: [
                {
                  c3: 1,
                },
                {
                  c4: 2,
                },
              ],
            },
            {
              and: [
                {
                  c3: 2,
                },
                {
                  c4: 1,
                },
              ],
            },
          ],
        });
        expect(count).eql(1);
        expect(result).lengthOf(1);
        expect(result[0]).property('id').eq(1);
      });
    });
  });

  describe('update', () => {
    it('update', async () => {
      tracker.uninstall();
      tracker.install();
      tracker.on('query', (query) => {
        expect(query.sql).match(/update.*testTable.*/);
        query.response([{ id: 1 }]);
      });
      const result = await baseRepository.update({
        id: 1,
        name: 'testName',
      });
      expect(result).property('id').eq(1);
    });
  });

  describe('create', () => {
    it('create', async () => {
      tracker.uninstall();
      tracker.install();
      tracker.on('query', (query) => {
        expect(query.sql).match(/insert.*testTable.*returning.*/);
        query.response([{ id: 1 }]);
      });
      const result = await baseRepository.create({
        name: 'testName',
      });
      expect(result).property('id').eq(1);
    });
  });

  describe('countByFilter', () => {
    it('successfully', async () => {
      tracker.uninstall();
      tracker.install();
      tracker.on('query', (query) => {
        expect(query.sql).match(/.*count.*column.*/);
        query.response([
          {
            count: '1',
          },
        ]);
      });
      const result = await baseRepository.countByFilter({
        column: 'testColumn',
      });
      expect(result).eq(1);
    });

    // TODO
    describe.skip('count support and and or', () => {});
  });
});
