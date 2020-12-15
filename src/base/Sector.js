import Node from '../core/Node';

export default class Sector extends Node {
  static TYPE = {
    STROKE: 1,
    FILL: 2,
  }

  constructor(canvas, style) {
    super(canvas, style);
    this.start = style.start || 0;
    this.stop = style.stop || 2 * Math.PI;
    this.radius = style.radius || 3;
    this.type = style.type || Sector.TYPE.STROKE;
    this.lineWidth = style.lineWidth || 3;
    this.lineDash = style.lineDash || [];
  }

  draw(painter) {
    if (this.type === Sector.TYPE.STROKE) {
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
      if (this.type === Sector.TYPE.STROKE) {
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
      this.start,
      this.stop
    );
    painter.lineTo(
      this.position.x / this.scaleX,
      this.position.y / this.scaleY
    );
    painter.closePath();
    if (this.type === Sector.TYPE.STROKE) {
      painter.stroke();
    } else {
      painter.fill();
    }
  }

  containsPoint(_p) {
    const dist = (_p.x - this.position.x) * (_p.x - this.position.x)
      + (_p.y - this.position.y) * (_p.y - this.position.y);
    if (dist > this.radius * this.radius) {
      return false;
    }
    const tan = -(_p.y - this.position.y) / (_p.x - this.position.x);
    let atan = Math.atan(tan);
    if (_p.x < this.position.x && _p.y < this.position.y) {
      atan = Math.PI + atan;
    } else if (_p.x < this.position.x && _p.y > this.position.y) {
      atan = Math.PI * 3 / 2 + atan;
    } else if (_p.x > this.position.x && _p.y > this.position.y) {
      atan = Math.PI * 2 + atan;
    }
    if (this.stop < this.start) {
      return atan >= this.start || atan <= this.stop;
    } else {
      return atan >= this.start && atan <= this.stop;
    }
  }
}
