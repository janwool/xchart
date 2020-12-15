import Node from '../core/Node';
import Point from '../core/Point';

export default class Line extends Node {
  constructor(canvas, style) {
    super(canvas, style);
    this.lineWidth = style.lineWidth || 3;
    this.lineCap = style.lineCap || Line.LINE_CAP.BUTT;
    this.lineDash = style.lineDash || [];
    this.lineDashOffset = style.lineDashOffset || 0;
    this.to = style.to || new Point(0, 0);
  }

  static LINE_CAP = {
    BUTT: 'butt',
    ROUND: 'round',
    SQUARE: 'square'
  }

  setTo(to, y = 0) {
    if (to instanceof Point) {
      this.to = to;
    } else {
      this.to = new Point(to, y);
    }
  }

  draw(painter) {
    painter.beginPath();
    // 设置线框
    painter.lineWidth = this.lineWidth;
    painter.strokeStyle = this.color;
    // 设置线条末端样式
    painter.lineCap = this.lineCap;
    // 设置虚线样式
    if (this.lineDash.length > 0) {
      painter.setLineDash(this.lineDash);
      painter.lineDashOffset = this.lineDashOffset;
    }
    // 设置渐变色
    if (this.linearGradient.length > 0) {
      const lingrad = painter.createLinearGradient(this.position.x, this.position.y, this.to.x, this.to.y);
      for (let i = 0; i < this.linearGradient.length; i++) {
        lingrad.addColorStop(this.linearGradient[i][0], this.linearGradient[i][1]);
      }
      painter.strokeStyle = lingrad;
    }
    painter.moveTo(this.position.x, this.position.y);
    painter.translate(0, 2 * this.position.y);
    painter.lineTo(this.to.x, - this.to.y);
    painter.closePath();
    painter.stroke();
  }

  containsPoint(point) {
    const targetY = (this.to.y - this.position.y) / (this.to.x - this.position.y) * (point.x - this.position.x) + this.position.y;
    return point.y >= targetY - this.width && point.y <= targetY + this.width
  }
}

