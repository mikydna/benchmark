import Chalk from 'chalk';

import Stats from './stats/basic';

export class Console {

  report(results, context) {
    const stats = Stats.compute(results);

    console.log(Chalk.blue('\n\n----- console -----'));
    console.log('context >', context);
    console.log('stats > ', stats);
    console.log('result > ', results);

  }

}
