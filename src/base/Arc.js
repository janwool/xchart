/*
* @Date: 2020/5/27
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Node from '../core/Node';
import Point from '../core/Point';

export default class Arc extends Node {
  static TYPE = {
    STROKE: 1,
    FILL: 2,
  }
  constructor(canvas, style) {
    super(canvas, style);
    this.lineWidth = style.lineWidth || 3;
    this.lineCap = style.lineCap || Arc.LINE_CAP.BUTT;
    this.lineDash = style.lineDash || [];
    this.type = style.type || Arc.TYPE.STROKE;
    this.lineDashOffset = style.lineDashOffset || 0;
    this.startAngle = style.startAngle || 0;
    this.endAngle = style.endAngle || 360;
    this.radius = style.radius || 10;
  }

  static LINE_CAP = {
    BUTT: 'butt',
    ROUND: 'round',
    SQUARE: 'square'
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
      const lingrad = painter.createLinearGradient(
        this.position.x - this.radius, this.position.y, this.position.x + this.radius, this.position.y);
      for (let i = 0; i < this.linearGradient.length; i++) {
        lingrad.addColorStop(this.linearGradient[i][0], this.linearGradient[i][1]);
      }
      painter.strokeStyle = lingrad;
    }
    painter.arc(
      this.position.x / this.scaleX,
      this.position.y / this.scaleY,
      this.radius,
      this.startAngle / 180 * Math.PI,
      this.endAngle / 180 * Math.PI
    );
    if (this.type === Arc.TYPE.STROKE) {
      painter.stroke();
    } else {
      painter.fill();
    }
  }

}

