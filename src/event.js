import _ from 'lodash';

import { now } from './util/timing';
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
        passed: _.isEmpty(fails),
        elapsed,
      };
    });

  const passed = _.filter(summary, s => (s.passed));

  const timings = _.map(passed, 'elapsed');
  const avg = mean(timings);
  const med = median(timings);

  const result = {
    count: {
      total: summary.length,
      passed: passed.length,
    },
    timing: _.omit({
      avg: _.isNumber(avg) ? Math.floor(avg) : null,
      med: _.isNumber(med) ? Math.floor(med) : null,
    }, _.isNull),
  };

  return _.omit(result, _.isEmpty);
}

export const EventType = Object.freeze({
  Start: 'start',
  End: 'end',
  Fail: 'fail',
})

export default class Event {

  constructor(id, type, timestamp) {
    this.props = {
      id,
      type,
      timestamp,
    }
  }

  get id() {
    return this.props.id;
  }

  get type() {
    return this.props.type;
  }

  get timestamp() {
    return this.props.timestamp;
  }

  toString() {
    const { id, type, timestamp } = this.props;

    return `{ ${id}, ${type}, ${timestamp} }`;
  }

  static now(id, type) {
    return new Event(id, type, now());
  }

}
