/*
* @Date: 2020/5/12
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Node from '../core/Node';

export default class Ring extends Node {
  static TYPE = {
    STROKE: 1,
    FILL: 2,
  }

  constructor(canvas, style) {
    super(canvas, style);
    this.startAngle = style.startAngle || 0;
    this.endAngle = style.endAngle || 360;
    this.longRadius = style.longRadius || 10;
    this.shortRadius = style.shortRadius || 5;
    this.type = style.type || Ring.TYPE.STROKE;
    this.lineWidth = style.lineWidth || 3;
    this.lineDash = style.lineDash || [];
  }

  draw (painter) {
    if (this.type === Ring.TYPE.STROKE) {
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
        this.position.x - this.longRadius,
        this.position.y,
        this.position.x + this.longRadius,
        this.position.y,
      );
      for (let i = 0; i < this.linearGradient.length; i++) {
        lingrad.addColorStop(this.linearGradient[i][0], this.linearGradient[i][1]);
      }
      if (this.type === Ring.TYPE.STROKE) {
        painter.strokeStyle = lingrad;
      } else {
        painter.fillStyle = lingrad;
      }
    }
    painter.beginPath();
    // 顺时针绘制长弧度
    painter.arc(
      this.position.x,
      this.position.y,
      this.longRadius,
      this.startAngle / 180 * Math.PI,
      this.endAngle / 180 * Math.PI
    );
    // 计算短弧线上的钟点
    const sx = this.position.x + this.shortRadius * Math.cos(this.endAngle / 180 * Math.PI);
    const sy = this.position.y + this.shortRadius * Math.sin(this.endAngle / 180 * Math.PI);
    // 移动到短弧线上的起始点
    painter.lineTo(sx, sy);
    // 顺时针针绘制短弧线
    painter.arc(
      this.position.x,
      this.position.y,
      this.shortRadius,
      this.endAngle / 180 * Math.PI,
      this.startAngle / 180 * Math.PI,
      true
    );
    // 计算长弧线的起始点
    const lx = this.position.x + this.longRadius * Math.cos(this.startAngle / 180 * Math.PI);
    const ly = this.position.y + this.longRadius * Math.sin( this.startAngle / 180 * Math.PI);
    painter.lineTo(lx, ly);
    painter.closePath();
    if (this.type === Ring.TYPE.STROKE) {
      painter.stroke();
    } else {
      painter.fill();
    }
  }

  containsPoint(_p) {
    const dist = (_p.x - this.position.x) * (_p.x - this.position.x)
      + (_p.y - this.position.y) * (_p.y - this.position.y);
    // 在大圆之外
    if (dist > this.longRadius * this.longRadius) {
      return false;
    }
    // 在小圆之内
    if (dist < this.shortRadius * this.shortRadius) {
      return false;
    }
    // 计算是否在弧度之内
    const tan = -(_p.y - this.position.y) / (_p.x - this.position.x);

    let atan = Math.atan(tan);
    if (_p.x < this.position.x && _p.y < this.position.y) {
      atan = Math.PI + atan;
    } else if (_p.x < this.position.x && _p.y > this.position.y) {
      atan = Math.PI * 3 / 2 + atan;
    } else if (_p.x > this.position.x && _p.y > this.position.y) {
      atan = Math.PI * 2 + atan;
    }
    atan = atan / Math.PI * 180;
    if (this.endAngle < this.startAngle) {
      return atan >= this.startAngle  || atan <= this.endAngle;
    } else {
      return atan >= this.startAngle && atan <= this.endAngle;
    }
  }
}
