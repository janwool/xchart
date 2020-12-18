import Node from '../core/Node';
import Color from '../core/Color';

export default class Rectangle extends Node {
  static TYPE = {
    STROKE: 1,
    FILL: 2,
  }

  static LINE_CAP = {
    BUTT: 'butt',
    ROUND: 'round',
    SQUARE: 'square'
  }

  constructor(canvas, style) {
    super(canvas, style);
    this.type = style.type || Rectangle.TYPE.STROKE;
    this.width = style.width || 200;
    this.height = style.height || 400;
    this.lineWidth = style.lineWidth || 3;
    this.lineDash = style.lineDash || [];
  }

  setSize(width, height) {
    this.width = width;
    this.height = height || this.height;
  }

  draw(painter) {
    if (this.type === Rectangle.TYPE.STROKE) {
      painter.strokeStyle = this.color;
      painter.lineWidth = this.lineWidth;
      if (this.lineDash.length > 0) {
        painter.setLineDash(this.lineDash);
      }
    } else {
      painter.fillStyle = this.color;
    }
    // 设置渐变色
    if (this.linearGradient.length > 0) {
      const lingrad = painter.createLinearGradient(
        this.position.x - this.width / 2,
        this.position.y,
        this.position.x + this.width / 2,
        this.position.y,
      );
      for (let i = 0; i < this.linearGradient.length; i++) {
        lingrad.addColorStop(this.linearGradient[i][0], this.linearGradient[i][1]);
      }
      if (this.type === Rectangle.TYPE.STROKE) {
        painter.strokeStyle = lingrad;
      } else {
        painter.fillStyle = lingrad;
      }
    }
    if (this.type === Rectangle.TYPE.STROKE) {
      painter.strokeRect(
        this.position.x - this.width / 2,
        this.position.y - this.height / 2,
        this.width,
        this.height
      );
    } else {
      painter.fillRect(
        this.position.x - this.width / 2,
        this.position.y - this.height / 2,
        this.width,
        this.height
      );
    }

  }

  containsPoint(point) {
    return point.x <= this.position.x + this.width / 2
        && point.x >= this.position.x - this.width / 2
        && point.y >= this.position.y - this.height / 2
        && point.y <= this.position.y + this.height / 2;
  }
}
