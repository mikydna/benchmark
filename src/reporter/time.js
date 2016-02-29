import _ from 'lodash';

export const TimeUnit = {
  Nanosecond:   { $: 1,    symbol: 'ns' },
  Microsecond:  { $: 1e3,  symbol: 'μs' },
  Millisecond:  { $: 1e6,  symbol: 'ms' },
  Second:       { $: 1e9,  symbol: 's'  },
};

TimeUnit.humanize = function(value, unit, opts) {
  opts = _.defaults(opts || {}, {
    precision: 5,
  });

  const valueNs = value * unit.$;
  const use = TimeUnit[
      _.findLastKey(TimeUnit, ({ $ }) => {
        return (valueNs / $) > 1;
      })
    ];

  const fmt = (valueNs / use.$).toPrecision(opts.precision);

  return `${fmt} ${use.symbol}`;

};
