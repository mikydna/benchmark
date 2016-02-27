import Fs from 'fs-extra';
import Vm from 'vm';

import _ from 'lodash';
import Rx from 'rx';

import Benchmark from './benchmark/benchmark';
import { Console as DefaultReporter } from './reporter/console';

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

    this._state = {
      running: false,
    };
  }

  get state() {
    return _.cloneDeep(this._state);
  }

  get running() {
    return this._state.running;
  }

  set running(bool) {
    const current = this.state;
    if (current.running !== bool) {
      const newState = current;
      newState.running = bool;
      this.setState(newState);
    }
  }

  setState(newState) {
    this._state = newState;
    // emit('change', state);
  }

  run() {
    const { benchmarks, context } = this.props;
    const { reporter } = this.props;

    this.running = true;
    _.forEach(benchmarks, benchmark => {
      const { path, result } = benchmark.run(context);

      result.then(
        out => reporter.write(out, { path }),
        err => console.log('err =', err),
        () => {
          console.log('completed')
          this.running = false;
        });
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

          return new Benchmark.Runner(script, { path });
        }).
      toArray().
      map(benchmarks => (new Suite(benchmarks, context))).
      toPromise();
  }

}
