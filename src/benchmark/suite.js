import Fs from 'fs-extra';
import Vm from 'vm';

import _ from 'lodash';
import Rx from 'rx';

import Benchmark from './benchmark';
import { Console as DefaultReporter } from '../reporter/console';

export default class Suite {

  constructor(benchmarks, context, opts) {
    context = context || {};
    benchmarks = benchmarks || [];
    opts = _.defaults(opts || {}, {
      reporter: DefaultReporter,
    });

    this.props = {
      context,
      benchmarks,
      reporter: new opts.reporter(),
    };

    this.state = {
      running: false,
    };
  }

  run() {
    const { benchmarks, context } = this.props;
    const { reporter } = this.props;

    // console.log( reporter);

    _.forEach(benchmarks, benchmark => {
      const { path, result } = benchmark.run(context);

      result.then(
        e => {
          reporter.report(e, { path });
        },
        err => console.log('err=', err),
        () => console.log('completed'));
    });
  }

  static fromDirectory(dir, context) {
    return Rx.Observable.
      create((obs) => {
          Fs.walk(dir).
            on('data', item => obs.onNext(item)).
            on('error', err => obs.onError(err)).
            on('end', () => obs.onCompleted());

        }).
      filter(({ stats }) => (!stats.isDirectory())).
      map(({ path /*, stats */ }) => {
          const code = Fs.readFileSync(path);
          const script = new Vm.Script(code);

          return new Benchmark(script, { path });
        }).
      toArray().
      map(benchmarks => (new Suite(benchmarks, context))).
      toPromise();
  }

}
