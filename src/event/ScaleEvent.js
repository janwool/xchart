import Event from './Event';

export default class ScaleEvent extends Event {
  constructor(callback) {
    super(Event.EVENT_SCALE, callback);
    this.scale = 1;
  }

  scaling(points) {
    if (!this.isProcessed) {
      const lastDist = (this.eventPoint[0].x - this.eventPoint[1].x)
        * (this.eventPoint[0].x - this.eventPoint[1].x)
        + (this.eventPoint[0].y - this.eventPoint[1].y)
        * (this.eventPoint[0].y - this.eventPoint[1].y);
      const nowDist = (points[0].x - points[1].x)
        * (points[0].x - points[1].x)
        + (points[0].y - points[1].y)
        * (points[0].y - points[1].y);
      this.scale = Math.sqrt(nowDist / lastDist);
      setTimeout(() => {
        this.callback(this);
        this.eventPoint = points;
        this.scale = 1;
      }, 0);
    }
  }

  doEvent() {
    this.manager.moveQueue.splice(this.manager.moveQueue.indexOf(this), 1);
    super.doEvent();
  }
}