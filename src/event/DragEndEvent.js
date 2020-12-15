import Event from './Event';

export default class DragEndEvent extends Event {
  constructor(callback) {
    super(Event.EVENT_DRAG_END, callback);
    this.startTime = new Date().getTime();
    this.endPoint = null;
    this.speedX = 0;
    this.speedY = 0;
  }

  setEndPoint(point) {
    if (!this.isProcessed) {
      this.endPoint = point;
    }
  }

  doEvent() {
    if (!this.isProcessed) {
      const endTime = new Date().getTime();
      const deltaT = (endTime - this.startTime) / 1000;
      const deltaX = this.endPoint.x - this.eventPoint.x;
      const deltaY = this.endPoint.y - this.eventPoint.y;
      this.speedX = deltaX / deltaT;
      this.speedY = deltaY / deltaT;
      this.callback(this);
    }
    super.doEvent();
  }

}