import _ from 'lodash';

import { expect } from 'chai';
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

      benchmark('successful test', { trials: 2 }, testTimeout100).
        then(({ context, result }) => {
            expect(context.desc).to.be.equal('successful test');
            expect(result.length).to.be.equal(2);

            _.forEach(result, trial => {
              const events = _.chain(trial).
                sortBy(e => (e.timestamp)).
                value();

              expect(events.length).to.be.equal(2);
              expect(_.map(events, 'type')).to.be.deep.equal(['start', 'end']);

              const first = _.first(events);
              const last = _.last(events);
              const elapsed = last.timestamp - first.timestamp;

              expect(elapsed / 1e6).to.be.within(100, 150);
            });

          }).
        finally(done);

    });

    it('correctly rejects if there an uncaught exception', done => {

      benchmark('test with exception', { trials: 2 }, testWithUncaughtException).
        catch(err => {
            expect(err.message).to.have.string('Uncaught exception');
            done();
          });
    });

    it('correctly records soft failed events', done => {

      benchmark('test with failure', { trials: 3 }, testWithSoftFail).
        then(({ context, result }) => {
            expect(context.desc).to.be.equal('test with failure');
            expect(result.length).to.be.equal(3);

            _.forEach(result, trial => {
              const events = _.chain(trial).
                sortBy(e => (e.timestamp)).
                value();

              expect(events.length).to.be.equal(3);
              expect(_.map(events, 'type')).to.be.deep.equal(['start', 'fail', 'end']);
            });

          }).
        finally(done);
    });

  });

  describe('xbenchmark', () => {

    it('correctly rejects with defined error type', done => {

      xbenchmark('', {}, testTimeout100).
        catch(err => {
            expect(err.message).to.have.string('Benchmark disabled');
            done();
          });

    });

  });

})
