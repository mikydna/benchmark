import Minimist from 'minimist';

const spec = {
  string: 'dir',
  boolean: 'recursive',

  stopEarly: false,
  // unknown: function () { console.log('u') }
};

console.log('>> ', process.argv)

console.log(Minimist(['--recursive'], spec));
console.log(Minimist(process.argv.slice(2), spec));

