import Suite from './suite';

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

try {

Suite.
  fromDirectory('./example').
  then(s => s.run());

} catch(e) {
  console.log(e);
}
