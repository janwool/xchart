import Event from './Event';

export default class TouchStartEvent extends Event {
  constructor(callback) {
    super(Event.EVENT_TOUCH_START, callback);
    setTimeout(() => {
      this.doEvent();
    }, 0);
  }

  doEvent() {
    this.callback(this);
    super.doEvent();
  }
}
