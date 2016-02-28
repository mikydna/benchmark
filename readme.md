
### goals

- something headless + cli-driven
- benchmarks/report code structure like mocha
- prints/outputs various formats for external analysis
- drives tests until they are stat sig (or not; conf option)
- (nice-to-have) output results as a stream
- i like(d) calipher, so investigate / emulate options

-----

### API

#### `benchmark(desc, opts, body)`

  - `desc (string)`: human-readable description of a benchmark
  - `conf (object)`: benchmark conf
      - `trials` = num trials, default 5

  - `body (function)`: runnable code with benchmark operators
      - `done`
      - `fail`

##### Example

  `foo-benchmark.js`

  ```javascript
  import { benchmark } from 'benchmark';

  import { foo } from '../src/foo';

  benchmark('benchmark foo(n) #1', { trials: 10 }, (done, fail) => {
    const successful = foo(10000);
    if (!successful) fail('#1: uh-oh');
    done();
  });

  benchmark('benchmark foo(n) #2', { trials: 20 }, () => {
    foo(1000);
  });

  ```
