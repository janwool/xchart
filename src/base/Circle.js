import Node from '../core/Node';


export default class Circle extends Node {
  static TYPE = {
    STROKE: 1,
    FILL: 2,
  }

  constructor(canvas, style) {
    super(canvas, style);
    this.type = style.type || Circle.TYPE.STROKE;
    this.radius = style.radius || 30;
    this.lineWidth = style.lineWidth || 3;
    this.lineDash = style.lineDash || [];
  }

  draw(painter) {
    if (this.type === Circle.TYPE.STROKE) {
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
      const lingrad = painter.createRadialGradient(
        this.position.x,
        this.position.y,
        0,
        this.position.x,
        this.position.y,
        this.radius,
      );
      for (let i = 0; i < this.linearGradient.length; i++) {
        lingrad.addColorStop(this.linearGradient[i][0], this.linearGradient[i][1]);
      }
      if (this.type === Circle.TYPE.STROKE) {
        painter.strokeStyle = lingrad;
      } else {
        painter.fillStyle = lingrad;
      }
    }
    // 设置阴影
    if (!!this.shadowOffsetX) {
      painter.shadowOffsetX = this.shadowOffsetX;
    }
    if (!!this.shadowOffsetY) {
      painter.shadowOffsetY = this.shadowOffsetY;
    }
    if (!!this.shadowBlur) {
      painter.shadowBlur = this.shadowBlur;
    }
    if (!!this.shadowColor) {
      painter.shadowColor = this.shadowColor;
    }
    painter.beginPath();
    painter.arc(
      this.position.x / this.scaleX,
      this.position.y / this.scaleY,
      this.radius,
      0,
      2 * Math.PI
    );
    painter.closePath();
    if (this.type === Circle.TYPE.STROKE) {
      painter.stroke();
    } else {
      painter.fill();
    }
  }

  containsPoint(_p) {
    console.log(111);
    const dist = (_p.x - this.position.x)
      * (_p.x - this.position.x)
      + (_p.y - this.position.y)
      * (_p.y - this.position.y);
    return dist <= (this.radius + 15) * (this.radius + 15);
  }
}
