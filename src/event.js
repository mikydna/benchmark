
export const Type = {
  Start: 'start',
  End: 'end',
  Fail: 'fail',
};

export default class Event {

  constructor(id, type, timestamp) {
    this._props = {
      id,
      type,
      timestamp,
    };
  }

  toString() {
    const { type, timestamp } = this._props;

    return `${type}\t${timestamp}`
  }

  static now(id, type) {
    const [s, ns] = process.hrtime();
    const timestamp = (s * 1e+9) + ns;
    return new Event(id, type, timestamp);
  }

}
