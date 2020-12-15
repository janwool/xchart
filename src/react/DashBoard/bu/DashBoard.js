/*
* @Date: 2020/5/27
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Layer from '../../../core/Layer';
import Polygon from '../../../base/Polygon';
import Ring from '../../../base/Ring';
import Point from '../../../core/Point';
import Text from '../../../base/Text';
import Line from '../../../base/Line';
import Arc from '../../../base/Arc';

export default class DashBoard extends Layer {
  static TYPE = {
    STROKE: 1,
    FILL: 2,
  }

  constructor(canvas, style, value) {
    super(canvas, style);
    this.pointColor = style.pointColor || '#333333';
    this.selectColor = style.selectColor || '#4594B4';
    this.graduation = style.graduation || []; // 刻度线标签
    this.value = value || 0; // 仪表数值，取值范围0-1
    this.type = style.type || DashBoard.TYPE.FILL;
  }

  make() {
    this.childs.splice(0, this.childs.length);
    // 计算仪表盘圆环最大可用半径
    const raduis = this.height > this.width ? this.width / 2 : this.height / 2;
    // 仪表盘
    if (this.type === DashBoard.TYPE.FILL) {
      // 圆环
      let ring = new Ring(this.canvas, {
        linearGradient: this.linearGradient, // 渐变
        color: this.color,
        position: new Point(this.width / 2, raduis * 0.45), // 圆环中心
        longRadius: raduis * 0.9, // 圆环大半径
        shortRadius: raduis * 0.75, // 圆环小半径
        type: Ring.TYPE.FILL,
        startAngle: 150,
        endAngle: 390,
      });
      this.addChild(ring);
    } else {
      // 圆弧
      let ring = new Arc(this.canvas, {
        linearGradient: this.linearGradient,
        color: this.color,
        radius: raduis * 0.825,
        position: new Point(this.width / 2, raduis * 0.45),
        lineDash: [10, 5], // 设置为虚线
        lineWidth: raduis * 0.15, // 线框
        startAngle: 150,
        endAngle: 390,
      });
      this.addChild(ring);
    }

    // 三角形指针
    let angle = new Polygon(this.canvas, {
      type: Polygon.TYPE.FILL,
      position: new Point(this.width / 2, raduis * 0.45),
      color: this.pointColor,
    }, [
      new Point(this.width / 2 - 10, raduis * 0.45),
      new Point(this.width / 2 + 10, raduis * 0.45),
      new Point(this.width / 2, raduis)
    ]);
    // 值的偏移角度
    const valueAngle = -120 + this.value * 240;
    // 指针偏移
    angle.rotation = valueAngle;
    const angleStep = 240 / (this.graduation.length - 1);
    // 添加刻度线
    for (let i = 0;i < this.graduation.length; i++) {
      let color = this.color;
      // 刻度值偏移角度
      const angle = (210 - i * angleStep) / 180 * Math.PI;
      // 刻度值是否超过value,超过修改刻度线颜色为选中颜色
      if ((1 - this.value) * 240 - 30 < (210 - i * angleStep) ) {
        color = this.selectColor;
      }
      // 刻度线
      let line = new Line(this.canvas, {
        position: new Point(
          this.width / 2 + raduis * 0.65 * Math.cos(angle),
          raduis * 0.45 + raduis * 0.65 * Math.sin(angle)
        ),
        to: new Point(
          this.width / 2 + raduis * 0.75 * Math.cos(angle),
          raduis * 0.45 + raduis * 0.75 * Math.sin(angle)
        ),
        color,
        lineWidth: 1,
      });
      // 刻度值
      const text = new Text(this.canvas, {
        text: this.graduation[i],
        size: this.fontSize,
        color,
        textAlign: 'center',
        position: new Point(
          this.width / 2 + raduis * 0.6 * Math.cos(angle),
          raduis * 0.45 + raduis * 0.6 * Math.sin(angle)
        )
      });
      this.addChild(line, text);
    }
    this.addChild(angle);
    // 填充选中部分颜色
    if (this.linearGradient.length === 0) {
      if (this.type === DashBoard.TYPE.FILL) {
        let selectRing = new Ring(this.canvas, {
          color: this.selectColor,
          position: new Point(this.width / 2, raduis * 0.45),
          longRadius: raduis * 0.9,
          shortRadius: raduis * 0.75,
          type: Ring.TYPE.FILL,
          startAngle: 150,
          endAngle: 150 + this.value * 240,
        });
        this.addChild(selectRing);
      } else {
        let selectRing = new Arc(this.canvas, {
          color: this.selectColor,
          radius: raduis * 0.825,
          position: new Point(this.width / 2, raduis * 0.45),
          lineDash: [10, 5],
          lineWidth: raduis * 0.15,
          startAngle: 150,
          endAngle: 150 + this.value * 240,
        });
        this.addChild(selectRing);
      }
    }
  }
}
