import { benchmark, ConsoleReporter } from '../../src/index';

benchmark('does nothing', { trials: 20 }, done => setTimeout(done, 100)).
  then(result => new ConsoleReporter().report(result));
