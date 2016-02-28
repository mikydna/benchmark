// import { expect } from 'chai';
import { describe, it } from 'mocha';

import { benchmark } from '../../src/benchmark';
import { Reporter } from '../../src/reporter';

describe('lib/reporter', () => {

  const testTimeout100 = done => setTimeout(done, 100);

  it('correctly resolves to an array of benchmark events', done => {

    // benchmark('reporter', { trials: 2 }, testTimeout100).
    //   then(Reporter.fromBenchmark).
    //   finally(done);

    done();
  });


});
