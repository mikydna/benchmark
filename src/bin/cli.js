import Fs from 'fs-extra';

import _ from 'lodash';
import Rx from 'rx';
import Minimist from 'minimist';

function $fswalk(dir) {
  return Rx.Observable.
    create((obs) => {
        Fs.walk(dir).
          on('data', item => obs.onNext(item)).
          on('error', err => obs.onError(err)).
          on('end', () => obs.onCompleted());
      }).
    filter(({ stats }) => (!stats.isDirectory())).
    toArray();
}

// usage: benchmark [files]
const Spec = {
  stopEarly: false,

  // string: 'dir',
  // boolean: 'recursive',
};


const args = process.argv.slice(4);

const flags = Minimist(args, Spec);
const files = flags._;

Rx.Observable.fromArray(files).
  map($fswalk).
  concatAll().
  flatMap(Rx.helpers.identity).
  pluck('path').
  distinct().
  map(path => ({
      path,
      code: Fs.readFileSync(path).toString('utf8'),
    })).
  subscribe(
    f => console.log('file', f),
    err => console.log('err', err));


// console.log('>> ', process.argv)
console.log(flags, files);

