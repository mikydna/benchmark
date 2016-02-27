
export function benchmark2() { console.log('benchmark', 2); }

export default {
  benchmark: () => { console.log('benchmark'); },
  xbenchmark: () => { console.log('benchmark-noop'); },
};
