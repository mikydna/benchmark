import _ from 'lodash';

const TimeUnit = {
  Nanosecond: { ns: 1, abbr: 'ns' },
  Microsecond: { ns: 10000, abbr: 'μs' },
  Millisecond: { ns: 1e+6, abbr: 'ms' },
  Second: { ns: 1e+9, abbr: 's' },
};

// exp
TimeUnit.humanize = function({ value, unit }) {
  const valueNs = value * unit.ns;

  const types = [
    TimeUnit.Second,
    TimeUnit.Millisecond,
    TimeUnit.Microsecond,
    TimeUnit.Nanosecond,
  ];

  let str = null;
  const typeLen = types.length;
  for (let i=0; str === null && i < typeLen; i++) {
    const { ns, abbr } = types[i];
    const converted = valueNs / ns;

    if (converted > 1) {
      str = converted + abbr;
    }
  }

  return str;

};

export default class BasicStats {

  static compute(trials) {

    const summary = [];
    _.forEach(trials, (trial, i) => {
      const start = _.find(trial, e => (e.type === 'start'));
      const end = _.find(trial, e => (e.type === 'end'));
      const elapsed = end.timestamp - start.timestamp;

      summary.push({ i, elapsed });
    });

    const len = summary.length;
    const elapsed = _.map(summary, 'elapsed');
    const avg = {
      value: Math.floor(_.sum(elapsed) / len),
      unit: TimeUnit.Nanosecond,
    };

    return {
      trials: len,
      summary,
      avg,
      avg_h: TimeUnit.humanize(avg),
    };
  }

}
