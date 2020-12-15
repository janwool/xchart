import Event from './Event';

export default class TouchEndEvent extends Event {
  constructor(callback) {
    super(Event.EVENT_TOUCH_END, callback);
    setTimeout(() => {
      this.doEvent();
    }, 0);
  }

  doEvent() {
    if (!this.isProcessed) {
      this.callback(this);
    }
    super.doEvent();
  }
}