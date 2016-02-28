
### goals

- something headless + cli-driven
- benchmarks/report like mocha
- prints/outputs various formats for external analysis
- drives tests until they are stat sig (or not, conf option)
- output results as a stream (nice, fr) -- i.e., not all or nothing
- i like(d) calipher, so emulate

### API

#### `benchmark(desc, opts, body)`

  - `desc string`: human-readable description of a benchmark
  - `opts object`: benchmark options (`trials` = num trials)
  - `body function`: runnable code with benchmark operators (`done`, `fail`)


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
