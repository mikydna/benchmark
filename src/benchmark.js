import _ from 'lodash';
import bluebird from 'bluebird';
import Rx from 'rx';



import Event, { EventType as Type } from './event';

export function xbenchmark(desc) {
  const message = `Benchmark disabled${desc ? ': ' + desc : '' }`;

  return bluebird.Promise.reject(new Error(message));
}

export function benchmark(desc, conf, f) {
  return Rx.Observable.create(obs => {
        const start = function() {
          obs.onNext(Event.now(Type.Start));
        };

        const done = _.once(function() {
          obs.onNext(Event.now(Type.End));
          obs.onCompleted();
        });

        const fail = function(reason, opts) {
          opts = _.defaults(opts || {}, {
            hard: false,
          });

          obs.onNext(Event.now(Type.Fail));

          if (opts.hard) {
            obs.onError(new Error(reason));
          }
        };

        start();

        try {
          f(done, { fail });
        } catch(err) {
          fail('Uncaught exception', { hard: true });
        }

        return _.noop;
      }).
    toArray().
    toPromise(bluebird.Promise);
}
