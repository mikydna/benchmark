/* exp */

import _ from 'lodash';

export const TimeUnit = {
  Nanosecond:   { ns: 1, abbr: 'ns' },
  Microsecond:  { ns: 1e+3, abbr: 'μs' },
  Millisecond:  { ns: 1e+6, abbr: 'ms' },
  Second:       { ns: 1e+9, abbr: 's' },

  humanize: function(value, unit) {
    if (_.isUndefined(value)) return null;

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
  },

};
