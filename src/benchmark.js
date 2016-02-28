import _ from 'lodash';
import Rx from 'rx';

import Event, { EventType as Type } from './event';

export function xbenchmark(desc) {
  return Promise.reject(`Benchmark disabled: ${desc}`);
}

export function benchmark(desc, opts, f) {
  return Rx.Observable.create(obs => {
        const start = function() {
          obs.onNext(Event.now(Type.Start));
        };

        const done = _.once(function() {
          obs.onNext(Event.now(Type.End));
          obs.onCompleted();
        });

        start();
        f(done);

        return _.noop;
      }).
    toArray().
    toPromise();
}
