import _ from 'lodash';

import { TimeUnit } from '../../util/units';
import { mean, median } from '../../util/math';

export default class BasicStats {

  static compute(trials) {

    const summary = _.map(trials, (trial, i) => {
      const start = _.find(trial, e => (e.type === 'start'));
      const end = _.find(trial, e => (e.type === 'end'));
      const elapsed = end.timestamp - start.timestamp;

      return { i, elapsed };
    });

    const len = summary.length;
    const elapsed = _.map(summary, 'elapsed');

    return {
      trials: len,
      summary,
      avg_h: TimeUnit.humanize(mean(elapsed), TimeUnit.Nanosecond),
      median_h: TimeUnit.humanize(median(elapsed), TimeUnit.Nanosecond),
    };
  }
}
