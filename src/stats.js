import _ from 'lodash';

import { mean, median } from './util/math';

export function stats(trials) {
  const summary = _.map(trials, trial => {
      const start = _.find(trial, e => (e.type === 'start'));
      const end = _.find(trial, e => (e.type === 'end'));
      const fails = _.filter(trial, e => (e.type === 'fail'));

      const run = start.id;
      const elapsed = end.timestamp - start.timestamp;

      return {
        run,
        successful: _.isEmpty(fails),
        elapsed,
      };
    });

  const successful = _.filter(summary, s => (s.successful));

  const timings = _.map(successful, 'elapsed');
  const avg = mean(timings);
  const med = median(timings);

  const result = {
    count: {
      total: summary.length,
      succesful: successful.length,
    },
    timing: _.omit({
      avg: _.isNumber(avg) ? Math.floor(avg) : null,
      med: _.isNumber(med) ? Math.floor(med) : null,
    }, _.isNull),
  };

  return _.omit(result, _.isEmpty);
}
