import _ from 'lodash';
import Rx from 'rx';

import uuid from 'node-uuid';

import Event, { Type as EventType } from './event';

const DefaultBenchmarkConf = {
  n: 1,       // # of runs
  delay: 500, // ms; delay between runs
  timeout: 6000,
};

export const benchmark = (desc, conf, f) => {
  conf = _.defaults(conf || {}, DefaultBenchmarkConf);

  // create a controlled seq of runs
  const $runs = Rx.Observable.
    range(0, conf.n).
    map(() => (uuid())).
    controlled();

  // when run completes, wait+request another run
  const $results = $runs.
    map(runId => {
        return Rx.Observable.create(
            obs => {
              const start = _.once(() => {
                obs.onNext(Event.now(runId, EventType.Start))
              });

              const done = _.once(() => {
                obs.onNext(Event.now(runId, EventType.End));
                obs.onCompleted();
              });

              start();
              f(done);
            }).
          timeout(conf.timeout).
          tapOnCompleted(() => {
              setTimeout(() => { $runs.request(1) }, conf.delay);
            });
      }).
    concatAll();

  // trigger first run
  $runs.request(1);

  $results.
    subscribe(
      e => console.log(e + ''),
      err => console.log('err', err),
      () => console.log([ 'completed' ]));

}

export const xbenchmark = (desc /*, conf, f */) => {
  return new Promise((resolve, reject) => {
    reject('not running: ' + desc);
  });
}

export default {
  benchmark,
  xbenchmark,
};

