import _ from 'lodash';

import { expect } from 'chai';
import { describe, it } from 'mocha';

import { benchmark, xbenchmark } from '../src/benchmark';

describe('benchmark', () => {
  const testTimeout100 = done => setTimeout(done, 100);
  const testWithUncaughtException = () => { throw new Error('my error'); };
  const testWithSoftFail = (done, { fail }) => {
      fail('soft fail 1', { hard: false });
      done();
    };

  describe('benchmark(desc, conf, f)', () => {

    it('correctly resolves start and end events', done => {

      benchmark('successful test', { trials: 2 }, testTimeout100).
        then(({ desc, data }) => {
            expect(desc).to.be.equal('successful test');
            expect(data.length).to.be.equal(2);

            _.forEach(data, trial => {
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

    it('correctly resolves with (soft) fail events', done => {

      benchmark('test with failure', { trials: 3 }, testWithSoftFail).
        then(({ desc, data }) => {
            expect(desc).to.be.equal('test with failure');
            expect(data.length).to.be.equal(3);

            _.forEach(data, trial => {
              const events = _.chain(trial).
                sortBy(e => (e.timestamp)).
                value();

              expect(events.length).to.be.equal(3);
              expect(_.map(events, 'type')).to.be.deep.equal(['start', 'fail', 'end']);
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

    it('correctly rejects if there is a timeout', done => {

      benchmark('test with failure', { timeout: 10 }, testTimeout100).
        catch(err => {
          expect(err.message).to.have.string('Timeout has occurred');
          done();
        });

    });

  });

  describe('xbenchmark(...)', () => {

    it('correctly rejects with a "disabled error"', done => {

      xbenchmark('disabled test', {}, testTimeout100).
        catch(err => {
            expect(err.message).to.have.string('Benchmark disabled');
            done();
          });

    });

  });

})
