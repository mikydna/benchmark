import _ from 'lodash';

function checkArgument(correct, reason) {
  if (!correct) {
    const message = ['Illegal argument', reason].join(': ');
    throw new Error(message);
  }
}

export function mean(arr) {
  checkArgument(_.isArrayLike(arr), 'Must be an array of numbers');

  if (_.isEmpty(arr)) return null;

  let sum = 0;
  const len = arr.length;
  for (let i=0; i<len; i++) {
    sum += arr[i];
  }

  return sum / len;
}

export function median(arr) {
  checkArgument(_.isArrayLike(arr), 'Must be an array of numbers');

  if (_.isEmpty(arr)) return null;

  const sortedArr = _.sortBy(arr);
  const halfLen = Math.floor(arr.length / 2);

  return arr.length % 2 === 0
    ? (sortedArr[halfLen - 1] + sortedArr[halfLen]) / 2
    : sortedArr[halfLen];
}
