import Node from '../core/Node';
import Color from '../core/Color';

export default class Polygon extends Node {
  static TYPE = {
    STROKE: 1,
    FILL: 2,
  }

  constructor(canvas, style, points = []) {
    super(canvas, style);
    this.type = style.type || Polygon.TYPE.STROKE;
    this.points = points || [];
    this.lineWidth = style.lineWidth || 3;
    this.lineDash = style.lineDash || [];
  }

  draw(painter) {
    if (this.points.length === 0) {
      return;
    }
    if (this.type === Polygon.TYPE.STROKE) {
      painter.strokeStyle = this.color;
      painter.lineWidth = this.lineWidth;
      if (this.lineDash.length > 0) {
        painter.setLineDash(this.lineDash);
      }
    } else {
      painter.fillStyle = this.color;
    }
    painter.translate(0, 2 * this.position.y);
    painter.beginPath();
    painter.moveTo(this.points[0].x, -this.points[0].y);
    // 遍历所有的点绘制多边形
    for (let i = 1; i < this.points.length; i++) {
      painter.lineTo(this.points[i].x, -this.points[i].y);
    }
    painter.closePath();
    if (this.type === Polygon.TYPE.STROKE) {
      painter.stroke();
    } else {
      painter.fill();
    }
  }

  containsPoint (point) {
    let crossings = 0;
    for(let i = 0; i < this.points.length - 1; i++) {
      const point1 = this.points[i];
      const point2 = this.points[i + 1];
      const slope = (point1.y - point2.y) / (point1.x - point2.x);
      const cond1 = point2.x <= point.x && point.x < point1.x;
      const cond2 = point1.x <= point.x && point.x < point2.x;
      const above = (point.y < slope * (point.x - point2.x) + point2.y);
      if ((cond1 || cond2) && above) crossings++;
    }
    return crossings % 2 !== 0;
  }
}
