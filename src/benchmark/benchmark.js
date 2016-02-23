import _ from 'lodash';
import Rx from 'rx';

import uuid from 'node-uuid';

function event(run, type, data) {
  const [s, ns] = process.hrtime();
  const timestamp = (s * 1e+9) + ns;
  const res = {
    run,
    type,
    timestamp,
    data,
  };

  return _.omitBy(res, _.isUndefined);
}

function benchmark(desc, conf, f) {
  conf = _.defaults(conf || {}, {
    n: 2,
  });

  return Rx.Observable.
    range(0, conf.n).
    map(() => {
      const runId = uuid();
      return Rx.Observable.
        create(obs => {
            const start = () => {
              obs.onNext(event(runId, 'start', { desc }));
            };

            const done = () => {
              obs.onNext(event(runId, 'end'));
              obs.onCompleted();
            };

            const fail = (reason, hard) => {
              hard = _.isBoolean(hard) ? hard : false;

              if (hard) {
                obs.onError(event(runId, 'fail', { reason, hard }));
              } else {
                obs.onNext(event(runId, 'fail', { reason, hard }));
                obs.onCompleted();
              }
            };

            start();
            f(done, fail);
          }).
        toArray();
      }).
    concatAll().
    toArray().
    toPromise();

}

const DEFAULT_CONTEXT = {
  benchmark,
  console,
};

export default class Benchmark {

  constructor(script, { path }) {
    this.props = {
      script,
      path,
    };

  }

  run(context) {
    context = _.defaults(context || {}, DEFAULT_CONTEXT);

    const { path, script } = this.props;

    return {
      path,
      result: script.runInNewContext(context),
    }
  }

}
