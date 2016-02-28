import _ from 'lodash';

import { expect, assert } from 'chai';
import { describe, it } from 'mocha';

import { benchmark, xbenchmark } from '../../src/benchmark';

describe('lib/benchmark', () => {
  const testTimeout100 = done => setTimeout(done, 100);
  const testWithSoftFail = (done, { fail }) => {
      fail('soft fail 1', { hard: false });
      done();
    };
  const testWithUncaughtException = () => { throw new Error('my error'); };

  describe('benchmark', () => {

    it('correctly resolves to an array of benchmark events', done => {

      benchmark('', {}, testTimeout100).
        then(out => {
            const events = _.chain(out).
              sortBy(e => (e.timestamp)).
              value();

            expect(events.length).to.be.equal(2);
            expect(_.map(events, 'type')).to.be.deep.equal(['start', 'end']);

            const first = _.first(events);
            const last = _.last(events);
            const elapsed = last.timestamp - first.timestamp;

            expect(elapsed / 1e6).to.be.within(100, 150);

          }).
        finally(done);

    });

    it('correctly rejects if there an uncaught exception', done => {

      benchmark('', {}, testWithUncaughtException).
        then(() => { assert.fail(); }).
        catch(err => {
            expect(err.message).to.be.equal('Uncaught exception');

          }).
        finally(done);

    });

    it('correctly records soft failed events', done => {
      benchmark('', {}, testWithSoftFail).
        then(out => {
            const events = _.chain(out).
              sortBy(e => (e.timestamp)).
              value();

            expect(events.length).to.be.equal(3);
            expect(_.map(events, 'type')).to.be.deep.equal(['start', 'fail', 'end']);

          }).
        finally(done);
    });

  });

  describe('xbenchmark', () => {

    it('correctly rejects with well-defined error type', done => {

      xbenchmark('', {}, testTimeout100).
        then(() => { assert.fail }).
        catch(err => {
            expect(err.message).to.have.string('Benchmark disabled');

          }).
        finally(done);

    });

  });

})
