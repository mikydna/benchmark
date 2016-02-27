import _ from 'lodash';
import Rx from 'rx';

import Babel from 'babel';
import Vm from 'vm';

const TestCode = `
  import Foo from './src/foo';
  import Bar, { SuperBar } from './src/bar';

  const result = [Foo(), Bar(), SuperBar()];
  console.log('result', result);
  result;
`;

export default class Runner {

  constructor(code, context, opts) {
    opts = _.defaults(opts || {}, {
        path: null,
      });

    this.props = {
      code,
      context,
    }
  }

  run() {
    const { code, context } = this.props;

    return Vm.runInNewContext(code, context);
  }

  static fromString(str) {
    const { code, metadata } = Babel.transform(str);

    // extract path-to-module from babel metadata
    const { modules } = metadata;
    const $registry = Rx.Observable.from(modules.imports).
      map(({ source, specifiers }) => {
          return Rx.Observable.fromPromise(System.import(source)).
            map(module => {
                const imports = {};

                _.forEach(specifiers, ({ imported }) => {
                  imports[imported] = module[imported];
                });

                return {
                  path: source,
                  module: _.merge(imports, { __esModule: true }),
                };
              });
        }).
      concatAll().
      toArray().
      map(col => {
          const registry = {};
          _.forEach(col, ({module, path}) => {
            registry[path] = _.merge(registry[path] || {}, module);
          });

          return registry;
        });

    // with the registry-future, return the runner as a promise
    const $runner = $registry.
      map(registry => {
          const context = {
            console,
            require: function(path) {
              return registry[path];
            },
          };

          return new Runner(code, context, null);
        });

    return $runner.toPromise();
  }

}

console.log('>> ', process.cwd())
Runner.fromString(TestCode).
  then(runner => {
      const result = runner.run();
      console.log('out >>', result);
    }).
  catch(err => console.log(err));

// console.log(global);
