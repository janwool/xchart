/*
* @Date: 2020/12/16
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/

import Node from '@/core/Node';

export default class Curve extends Node {
  constructor(canvas, style) {
    super(canvas, style);
    this.lineWidth = style.lineWidth || 3;
    this.lineCap = style.lineCap || Curve.LINE_CAP.BUTT;
    this.lineDash = style.lineDash || [];
    this.lineDashOffset = style.lineDashOffset || 0;
    this.points = style.points || [];
  }

  calculateControlPoint(points) {
    const pointLen = points.length - 1;
    const firstControlPoint = [];
    const secondControlPoint = [];
    if (pointLen === 1) {
      const firstX = (2 * points[0].x + points[1].x) / 3;
      const firstY = (2 * points[0].y + points[1].y) / 3;
      const secondX = 2 * firstX - points[0].x;
      const secondY = 2 * firstY - points[0].y;
      firstControlPoint.push({ x: firstX, y: firstY });
      secondControlPoint.push({ x: secondX, y: secondY });
      return [firstControlPoint, secondControlPoint];
    }
    let pTmp = [];
    for (let i = 1; i < pointLen - 1; ++i) {
      pTmp[i] = 4 * points[i].x + 2 * points[i + 1].x;
    }
    pTmp[0] = points[0].x + 2 * points[1].x;
    pTmp[pointLen - 1] = (8 * points[pointLen - 1].x + points[pointLen].x) / 2;
    let x = this.getFirstControlPoints(pTmp);
    pTmp = [];
    for (let i = 1; i < pointLen - 1; ++i) {
      pTmp[i] = 4 * points[i].y + 2 * points[i + 1].y;
    }
    pTmp[0] = points[0].y + 2 * points[1].y;
    pTmp[pointLen - 1] = (8 * points[pointLen - 1].y + points[pointLen].y) / 2;
    let y = this.getFirstControlPoints(pTmp);
    for (let i = 0; i < pointLen; ++i) {
      firstControlPoint.push({ x: x[i], y: y[i] });
      if (i < pointLen - 1) {
        const secondX = 2 * points[i + 1].x - x[i + 1];
        const secondY = 2 * points[i + 1].y - y[i + 1];
        secondControlPoint.push({ x: secondX, y: secondY });
      } else {
        const secondX = (points[pointLen].x + x[pointLen - 1]) / 2;
        const secondY = (points[pointLen].y + y[pointLen - 1]) / 2;
        secondControlPoint.push({ x: secondX, y: secondY });
      }
    }
    return [firstControlPoint, secondControlPoint];
  }
  getFirstControlPoints(rhs) {
    const n = rhs.length;
    const tmp = [];
    const x = [];
    let b = 2;
    x[0] = rhs[0] / b;
    for (let i = 1; i < n; ++i) {
      tmp[i] = 1 / b;
      b = (i < n - 1 ? 4 : 3.5) - tmp[i];
      x[i] = (rhs[i] - x[i - 1]) / b;
    }
    for (let i = 1; i < n; ++i) {
      x[n - i - 1] -= tmp[n - i] * x[n - i];
    }
    return x;
  }

  static LINE_CAP = {
    BUTT: 'butt',
    ROUND: 'round',
    SQUARE: 'square'
  }

  draw (painter) {
    if (this.points.length < 2) {
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
    const [firstControlPoints, secondControlPoints] = this.calculateControlPoint([this.position, ...this.points]);
    console.log('firstControlPoints==>', firstControlPoints, secondControlPoints, this.points);
    painter.moveTo(this.position.x, this.position.y);
    painter.translate(0, 2 * this.position.y);
    for (let i = 1; i < this.points.length; i++) {
      painter.bezierCurveTo(
        firstControlPoints[i - 1].x,
        firstControlPoints[i - 1].y,
        secondControlPoints[i - 1].x,
        secondControlPoints[i - 1].y,
        this.points[i].x,
        this.points[i].y
        );
    }
    painter.closePath();
    painter.stroke();
  }
}
