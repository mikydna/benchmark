import Vm from 'vm';

import _ from 'lodash';
import Rx from 'rx';

import uuid from 'node-uuid';



function xbenchmark(desc) {
  return new Promise((resolve, reject) => {
    reject('not running: ' + desc);
  });
}

function benchmark(desc, conf, f) {
  conf = _.defaults(conf || {}, {
    n: 2,
    delay: 100, // time delay between tests
  });

  return Rx.Observable.
    range(0, conf.n).
    delaySubscription(conf.delay).
    map(() => {
      const runId = uuid();
      return Rx.Observable.
        create(obs => {
            const start = _.once(() => {
              obs.onNext(event(runId, 'start', { desc }));
            });

            const done = _.once(() => {
              obs.onNext(event(runId, 'end'));
              obs.onCompleted();
            });

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
  xbenchmark,
  System,
  console,
  _,
  setTimeout,
};

export class Runner {

  constructor(script, { path }) {
    this.props = {
      script,
      path,
    };
  }

  run(context) {
    context = _.defaults(context || {}, DEFAULT_CONTEXT);

    const { path, script } = this.props;
    const sandbox = Vm.createContext(context);
    const runOpts = {
      displayErrors: true,
      filename: path,
    };

    return {
      path,
      result: script.runInNewContext(sandbox, runOpts),
      // result: script.runInThisContext(runOpts),
    }
  }

}

export default {
  Runner,
};
