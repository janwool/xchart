/*
* @Date: 2020/5/6
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import BaseLayer from './BaseLayer';
import Point from '../core/Point';
import Line from '../base/Line';
import Text from '../base/Text';
import Polygon from '../base/Polygon';
import Circle from '../base/Circle';

export default class extends BaseLayer {
  constructor(canvas, style, data = []) {
    super(canvas, style);
    this.width = style.width || this.canvas.width;
    this.height = style.height || this.canvas.height;
    this.data = data || [];
  }

  make() {
    this.clearEventListener();
    this.childs.splice(0, this.childs.length);
    if (this.data.length <= 0) {
      return;
    }
    let max = this.data[0].value;
    let min = this.data[0].value;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].value > max) {
        max = this.data[i].value;
      }
      if (this.data[i].value < min) {
        min = this.data[i].value;
      }
    }
    let angleStep = 360 / this.data.length;
    let radis = this.width > this.height ? this.height * 0.4 : this.width * 0.4;
    for (let i = 0; i < this.data.length; i++) {
      let line = new Line(this.canvas, {
        from: new Point(this.position.x + this.width / 2, this.position.y + this.height / 2),
        to: new Point(
          this.position.x + this.width / 2 + radis * Math.cos(angleStep * i / 180 * Math.PI),
          this.position.y + this.height / 2 + radis * Math.sin(angleStep * i / 180 * Math.PI)
        ),
        color: new Color('#E3E3E3')
      });
      this.addChild(line);
    }
    let axisMin = 0;
    let axisMax = 0;
    if (min < 0 && max > 0) {
      axisMin = Math.abs(min) > Math.abs(max) ? -Math.abs(min) * 1.2 : -Math.abs(max) * 1.2;
      axisMax = Math.abs(max) * 1.2
    } else if (min < 0 && max < 0) {
      axisMin = min * 1.2;
      axisMax = 0;
    } else if (min > 0 && max > 0) {
      axisMin = 0;
      axisMax = max * 1.2;
    }
    let radisStep = radis / (axisMax - axisMin);
    let radisAxisStep = radis / 3;
    for (let i = 1; i <= 3; i++) {
      let polygonPoints = [];
      for (let j = 0; j < this.data.length; j++) {
        polygonPoints.push(
          new Point(
            this.position.x + this.width / 2 + i * radisAxisStep * Math.cos(angleStep * j / 180 * Math.PI),
            this.position.y + this.height / 2 + i * radisAxisStep * Math.sin(angleStep * j / 180 * Math.PI)
          )
        );
        let polygon = new HollowPolygon(this.canvas, {
          points: polygonPoints,
          color: '#E3E3E3',
          width: 1,
        });
        this.addChild(polygon);
      }
      const text = (i * radisAxisStep / radisStep + axisMin).toFixed(2);
      let txt = new Text(this.canvas, {
        text,
        font: 'PingFang SC',
        size: 30,
        color: '#333333'
      });
      txt.setPosition(this.position.x + this.width / 2 + i * radisAxisStep, this.position.y + this.height / 2);
      this.addChild(txt);
    }
    const text = (0 * radisAxisStep / radisStep + axisMin).toFixed(2);
    let txt = new Text(this.canvas, {
      text,
      font: 'PingFang SC',
      size: 30,
      color: '#333333'
    });
    txt.setPosition(this.position.x + this.width / 2 + 0 * radisAxisStep, this.position.y + this.height / 2);
    this.addChild(txt);
    let polygonPoints = [];
    for (let i = 0; i < this.data.length; i++) {
      let distance = (this.data[i].value - axisMin) * radisStep;
      polygonPoints.push(new Point(
        this.position.x + this.width / 2 + distance * Math.cos(angleStep * i / 180 * Math.PI),
        this.position.y + this.height / 2 + distance * Math.sin(angleStep * i / 180 * Math.PI)
      ));
      let circle = new Circle(this.canvas, 10);
      circle.setPosition(
        this.position.x + this.width / 2 + distance * Math.cos(angleStep * i / 180 * Math.PI),
        this.position.y + this.height / 2 + distance * Math.sin(angleStep * i / 180 * Math.PI)
      );
      circle.setColor(this.color);
      this.addChild(circle);
    }
    let polygon = new Polygon(this.canvas, {
      points: polygonPoints,
      color: this.color
    });
    console.log(new Color(this.color.r - 30, this.color.g - 30, this.color.b - 30))
    let hollowPolygon = new HollowPolygon(this.canvas, {
      points: polygonPoints,
      color: this.color,
      width: 5
    });
    polygon.alpha = 0.2;
    this.addChild(polygon, hollowPolygon);
  }
}
