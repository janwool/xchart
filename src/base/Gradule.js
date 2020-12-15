import Node from '../core/Node';

export default class Gradule extends Node {
  constructor(canvas, option) {
    super(canvas);
    this.points = option.points || [];
    this.direct = option.direct || 'row';
    this.gradients = option.gradients || [];
  }

  draw(painter) {
    if (this.points.length === 0) {
      return;
    }
    painter.moveTo(this.points[0].x, -this.points[0].y);
    let maxY = this.points[0].y;
    let minY = this.points[0].y;
    let maxX = this.points[0].x;
    let minX = this.points[0].x;
    for (let i = 1; i < this.points.length; i++) {
      painter.lineTo(this.points[i].x, -this.points[i].y);
      if (this.points[i].y > maxY) {
        maxY = this.points[i].y;
      }
      if (this.points[i].y < minY) {
        minY = this.points[i].y;
      }
      if (this.points[i].x > maxX) {
        maxX = this.points[i].x;
      }
      if (this.points[i].x < minX) {
        minX = this.points[i].x;
      }
    }
    painter.closePath();
    let grd = null;
    if (this.direct === 'row') {
      grd = painter.createLinearGradient(0,  -Math.round(maxY), 0, 0);
    } else {
      grd = painter.createLinearGradient(minX, 0, maxX, 0);
    }
    for (let i = 0; i < this.gradients.length; i++) {
      grd.addColorStop(this.gradients[i][0], this.gradients[i][1]);
    }
    painter.fillStyle = grd;
    painter.fill();
  }
}
