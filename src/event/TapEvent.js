import Event from './Event';

export default class TapEvent extends Event {
  constructor(callback) {
    super(Event.EVENT_TAP, callback);
    this.startTime = new Date().getTime();
  }

  doEvent() {
    const endTime = new Date().getTime();
    console.log(endTime - this.startTime)
    if (endTime - this.startTime < 500) {
      // 当前时间小于1.5s为click事件
      this.callback(this);
    }
    super.doEvent();
  }
}
