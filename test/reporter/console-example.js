import { benchmark } from '../../src/benchmark';

import ConsoleReporter from '../../src/reporter/console';

benchmark('does nothing', { trials: 50 }, done => done()).
  then(result => new ConsoleReporter().report(result));
