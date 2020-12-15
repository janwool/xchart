import Event from './Event';

export default class TouchMoveEvent extends Event {
  constructor(callback) {
    super(Event.EVENT_TOUCH_MOVE, callback);
    this.curPoint = null;
  }

  moving(point) {
    if (!this.isProcessed) {
      this.curPoint = point;
      setTimeout(() => {
        this.callback(this);
        this.eventPoint = point;
      }, 0);
    }
  }

  doEvent() {
    // 将事件从管理器中移除
    this.manager.moveQueue.splice(this.manager.moveQueue.indexOf(this), 1);
    super.doEvent();
  }
}