import _ from 'lodash';

import { now } from './util/timing';

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

  static now(type) {
    const id = _.uniqueId();
    return new Event(id, type, now());
  }

}
