import _ from 'lodash';
import chalk from 'chalk';

import { TimeUnit } from './time';

class Formatter {

  constructor(out) {
    this.props = {
      out,
      tab: '  ',
    };

    this.state = {
      indentLevel: 0,
    }
  }

  header(str, level) {
    level = _.isNumber(level) ? level : 1;

    const { out, tab } = this.props;
    const pfx = _.repeat(tab, level);

    out.write(`\n${pfx}${chalk.bold(str)}\n`)

    this.state.indentLevel = level + 1;

    return this;
  }

  line(str) {
    str = _.isString(str) ? str : '';

    const { out, tab } = this.props;
    const { indentLevel } = this.state;
    const pfx = _.repeat(tab, indentLevel);

    out.write(`${pfx}${str}\n`)

    return this;
  }

  list(items, bullet) {
    items = items || [];
    bullet = _.isString(bullet) ? bullet : '- ';

    const { out, tab } = this.props;
    const { indentLevel } = this.state;
    const pfx = _.repeat(tab, indentLevel);

    _.forEach(items, item => {
      out.write(`${pfx}${bullet}${item}\n`);
    });

    return this;
  }

}

export default class ConsoleReporter {

  constructor(opts) {
    opts = _.defaults(opts || {}, {
      formatter: new Formatter(process.stdout),
    });

    this.props = {
      formatter: opts.formatter,
    };
  }

  report(result, opts) {
    opts = _.defaults(opts || {}, {
      k: 10,
    });

    const { formatter } = this.props;
    const { desc, stats, data } = result;

    { // print context
      formatter.header('Benchmark', 1);
      formatter.line(desc);
    }

    { // print stats
      const { total, passed } = stats.count;
      const { avg, med } = stats.timing;
      const avgStr = TimeUnit.humanize(avg, TimeUnit.Nanosecond);
      const medStr = TimeUnit.humanize(med, TimeUnit.Nanosecond);

      formatter.header('Summary', 2);
      formatter.list([
          `n   = ${total} (${passed} completed)`,
          `avg = ${avgStr}`,
          `med = ${medStr}`,
        ], '');
    }

    { // print trial sample

      const sample = _.chain(data).
        sampleSize(opts.k).
        sortBy(trial => (trial[0].timestamp)).
        value();

      const timelines = _.map(sample, trial => {
          const start = _.find(trial, e => (e.type === 'start'));
          const end = _.find(trial, e => (e.type === 'end'));

          const elapsed = end.timestamp - start.timestamp;
          const width = elapsed / 20;

          const timeline = _.reduce(trial, (bin, e) => {
              const { type, timestamp } = e;
              const at = Math.floor((timestamp - start.timestamp) / width);

              if (_.isUndefined(bin[at])) {
                bin[at] = [];
              }

              bin[at].push(type[0]);

              return bin;

            }, []);

          const idStr = _.padEnd(start.id, 6);
          const elapsedStr = TimeUnit.humanize(elapsed, TimeUnit.Nanosecond);
          const timelineStr = _.chain(timeline).
            map(bin => (_.isEmpty(bin) ? chalk.gray('.') :  bin.join('') )).
            join('').
            value();

          return `${idStr}\t${timelineStr}\t${elapsedStr}`;
        });

        formatter.header(`Sample (${opts.k})`, 2);
        formatter.header('Timelines', 3);
        formatter.list(timelines, '');

    }

    formatter.line();
  }

}
