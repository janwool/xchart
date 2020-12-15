import Node from '../core/Node';

export default class MultiLine extends Node {
  static LINE_CAP = {
    BUTT: 'butt',
    ROUND: 'round',
    SQUARE: 'square'
  }
  constructor(canvas, style, points = []) {
    super(canvas, style)
    this.points = points;
    this.lineCap = style.lineCap || MultiLine.LINE_CAP.BUTT;
    this.lineDash = style.lineDash || [];
    this.lineDashOffset = style.lineDashOffset || 0;
  }

  draw(painter) {
    if (this.points.length === 0) {
      return;
    }
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
    // 遍历各点绘制线段
    painter.translate(0, 2 * this.position.y);
    for (let i = 0; i < this.points.length; i++) {
      painter.lineTo(this.points[i].x, - this.points[i].y);
    }
    painter.stroke();
  }
}
