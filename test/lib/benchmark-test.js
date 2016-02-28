import _ from 'lodash';

import { expect, assert } from 'chai';
import { describe, it } from 'mocha';

import { benchmark, xbenchmark } from '../../src/benchmark';

describe('lib/benchmark', () => {
  const test500ms = done => setTimeout(done, 500);

  describe('benchmark', () => {

    it('resolves to an array of benchmark events', done => {

        benchmark('', {}, test500ms).
          then(out => {
              const events = _.chain(out).
                sortBy(e => (e.timestamp)).
                value();

              expect(events.length).to.be.equal(2);
              expect(_.map(events, 'type')).to.be.deep.equal(['start', 'end']);

              const first = _.first(events);
              const last = _.last(events);
              const elapsed = last.timestamp - first.timestamp;

              expect(elapsed / 1e6).to.be.within(500, 510);
            }).
          finally(done);

    });

  });

  describe('xbenchmark', () => {

    it('rejects test', done => {
      xbenchmark('', {}, test500ms).
        then(() => assert.fail()).
        catch(() => done());
    });

  });

})
