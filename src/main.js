// import Suite from './suite';

// function flags(argv) {
//   return _.chain(argv).
//     zip(_.slice(argv, 1)).
//     commit().
//     map(pair => (_.compact(pair))).
//     filter(([a /*, b */]) => (_.startsWith(a, '--'))).
//     map(([a, b]) => ([_.trim(a, '-'), b])).
//     commit().
//     fromPairs().
//     value();
// }

// Suite.fromDirectory('./example').
//   then(s => s.run());

import vm from 'vm';
// import _ from 'lodash';

// import System from 'system';
import Babel  from 'babel';
import _ from 'lodash';
import Rx from 'rx';
// import Core from 'babel-core';

import { benchmark } from './benchmark';

// vm.runInNewContext(`
//     benchmark('test desc', { n: 1 }, done => {
//       setTimeout(done, 100);
//     });
//   `, { benchmark, console, setTimeout });




const es6 = `
import { benchmark } from './src/benchmark';
import Foo from './src/foo';

// benchmark('test desc', { n: 1 }, done => {
//   setTimeout(done, 100);
  Foo('bar');
//});
`;

const { metadata, code } = Babel.transform(es6);

console.log('-----  metadata');
if (false) {
  console.log(metadata);

  const { modules } = metadata;

  Rx.Observable.from(modules.imports).
    map(({ source, specifiers }) => {
        console.log('source', source);
        console.log('specifers', specifiers);

        return Rx.Observable.
          fromPromise(System.import(source)).
          map(module => {
              const exported = {};
              _.forEach(specifiers, specifier => {
                  const { kind, imported, local } = specifier;
                  switch(kind) {
                    case 'named':
                    exported[local] = module[imported];
                    break;
                  }
                });

              return exported;
            });
      }).
    concatAll().
    toArray().
    map(col => {
        const registry = {};
        _.forEach(col, mapped => {
            _.map(mapped, (target, key) => {
                registry[key] = target;
              });
          });

        return registry;
      }).
    subscribe(
      e => console.log('\n\n', e));

}

console.log('-----  end\n')


console.log('-----  code');
console.log(code);

console.log('-----  end\n')

console.log('-----  run');

const fakeRequire = function(path) {
  if (path === './src/foo') {
    return function(bar) { console.log('foo', bar); };
  }
};

vm.runInNewContext(code, { require: fakeRequire });



// const modules = babelCode.metadata.modules;

// const imports = modules.imports;
// const usedHelpers = babelCode.metadata.usedHelpers;

// console.log('---- imports')
// console.log(imports);
// console.log(System.amdRequire);

// _.forEach(imports, imported => {
//   const { source, specifiers } = imported;
//   console.log(source);
//   console.log(specifiers);
//   console.log(System.import(source).then(e => console.log(e)))
// });

// console.log();


// console.log(usedHelpers);


// const exports = {};
// const context = {
//     require: function(name) {
//         return mocks[name];
//     },
//     console: console,
//     exports: modules.exports.exported,
//     module: {
//         exports: exports
//     }
// };

// System.baseUrl = '/';

// System.import('./src/benchmark').
//   then(e => console.log(e)).
//   catch(err => console.log('err', err));

// const require = System.amdRequire;
// // console.log(require('lodash'));

// console.log(require('./src/benchmark.js'));

// // console.log(babelCode.metadata)//.modules.imports[0])

// console.log(babelCode.code);

// vm.runInNewContext(babelCode.code, { require: System.amdRequire });
// eval(babelCode.code);
