import Chalk from 'chalk';

import Stats from './stats/basic';

export class Console {

  write(results, context) {
    const stats = Stats.compute(results);

    console.log(Chalk.blue('----- console -----'));
    console.log('context >', context);
    console.log('stats > ', stats);
    // console.log('result > ', results);
    console.log('\n\n');

  }

}
