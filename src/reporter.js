
function stats(events) {
  console.log('stats', events);
  return 'stats';
}

export class Reporter {

  constructor(runs, stats) {
    console.log('runs', runs);
    console.log('stats', stats);
  }

  static fromBenchmark({ context, result }) {
    console.log(context);
    return new Reporter(result, stats(result));
  }

}
