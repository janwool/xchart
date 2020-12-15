import Node from '../core/Node';
import Event from './Event';

export default class Listener {
  constructor(_obj, _event) {
    if (_obj instanceof Node && _event instanceof Event) {
      this.obj = _obj;
      this.event = _event;
    } else {
      throw new Error('Error Arguments for create event listener');
    }
  }
}
