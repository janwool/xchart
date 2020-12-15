import Event from './Event';

export default class MouseDownEvent extends Event {
  constructor(callback) {
    super(Event.EVENT_MOUSE_DOWN, callback);
    setTimeout(() => {
      this.doEvent();
    }, 0);
  }

  doEvent() {
    this.callback(this);
    super.doEvent();
  }
}
