import _ from 'lodash';
import Rx from 'rx';

import Babel from 'babel';
import Path from 'path';
import Vm from 'vm';


const TestCode = `
  import Foo from './foo';
  import Bar, { SuperBar } from './bar';

  const result = [Foo(), Bar(), SuperBar()];
  console.log(result);
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
    const { imports } = modules;

    const $registry = Rx.Observable.from(imports).
      map(({ source, specifiers }) => {

          console.log(process.cwd(), System.baseURL, source)
          const modifiedSourcePath = Path.normalize(System.baseURL + 'src/' + source);
          console.log(modifiedSourcePath);

          const pSourceImport = System.import(modifiedSourcePath);

          return Rx.Observable.fromPromise(pSourceImport).
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
console.time('test');
Runner.fromString(TestCode).
  then(runner => {
      console.time('test');
      const result = runner.run();
      console.timeEnd('test');
      console.log('out >>', result);
    }).
  catch(err => console.log(err));

// console.log(global);
