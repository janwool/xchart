import Event from './Event';

export default class ClickEvent extends Event {
  constructor(_callback) {
    super(Event.EVENT_CLICK, _callback);
    this.startTime = new Date().getTime();
  }

  doEvent() {
    const endTime = new Date().getTime();
    if (endTime - this.startTime < 1500) {
      // 当前时间小于1.5s为click事件, 区别与长按事件
      this.callback(this);
    }
    this.isProcessed = true;
  }
}
