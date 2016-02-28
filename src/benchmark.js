import _ from 'lodash';
import bluebird from 'bluebird';
import Rx from 'rx';

import Event, { EventType as Type } from './event';
import { basicStats } from './stats';

export function xbenchmark(desc) {
  const message = `Benchmark disabled${desc ? ': ' + desc : '' }`;
  return bluebird.Promise.reject(new Error(message));
}

export function benchmark(desc, conf, f) {
  conf = _.defaults(conf || {}, {
    trials: 5,
    timeout: 1000,
  });

  return Rx.Observable.range(0, conf.trials).
    map(run => {
        const $result =
          Rx.Observable.create(obs => {
              const start = () => {
                obs.onNext(Event.now(run, Type.Start));
              };

              const fail = function(reason, opts) {
                opts = _.defaults(opts || {}, {
                  hard: false,
                });

                obs.onNext(Event.now(run, Type.Fail));

                if (opts.hard) {
                  obs.onError(new Error(reason));
                  obs.onCompleted();
                }
              };

              const done = () => {
                obs.onNext(Event.now(run, Type.End));
                obs.onCompleted();
              };

              start();

              try {
                f(done, { fail });
              } catch(err) {
                fail('Uncaught exception', { hard: true });
              }

              return _.noop;
            }).
          timeout(conf.timeout);

        return $result.toArray();

      }).
    concatAll().
    toArray().
    map(result => ({
        context: {
          desc,
          trials: conf.trials,
        },
        stats: basicStats(result),
        result,
      })).
    toPromise(bluebird.Promise);
}
