import _ from 'lodash';

import { mean, median } from './util/math';

export function basicStats(trials) {
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

  const stats = {
    count: {
      total: summary.length,
      succesful: successful.length,
    },
    avg: _.isNumber(avg) ? Math.floor(avg) : null,
    median: _.isNumber(med) ? Math.floor(med) : null,
  };

  return _.omit(stats, _.isNull);
}
