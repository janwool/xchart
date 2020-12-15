/*
* @Date: 2020/5/25
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Layer from '../../../core/Layer';
import Sector from '../../../base/Sector';
import Point from '../../../core/Point';
import Text from '../../../base/Text';
import MultiLine from '../../../base/MultiLine';

export default class PieLayer extends Layer {
  static TYPE = {
    NORMAL: 1,  // 标准
    ROSE: 2,    // 玫瑰图
  }

  constructor(canvas, style, data = []) {
    super(canvas, style);
    this.colors = style.colors || {} // 数据对应的颜色
    this.type = style.type || PieLayer.TYPE.NORMAL;
    this.data = data; // 数据数组，格式[{ key: 1, value: 10, label: '' }]
  }

  make() {
    this.childs.splice(0, this.childs.length);
    this.clearEventListener();
    if (this.data.length <= 0) {
      return;
    }
    let sum = 0; // 数据累和
    for (let i = 0; i < this.data.length; i++) {
      sum += this.data[i].value;
    }
    // 计算单位数值所占用的角度
    let angleStep = 360 / sum;
    // 记录偏移角度
    let sumAngle = 0;
    // 扇形的半径
    const radius = this.width > this.height ? this.height / 2 : this.width / 2;
    const radiusStep = 1 / this.data.length;
    // 遍历数据绘制相应的扇形
    for (let i = 0; i < this.data.length; i++) {
      // 计算扇形的夹角
      let angle = this.data[i].value * angleStep;
      let isRose = this.type === PieLayer.TYPE.ROSE ? (0.5 + radiusStep * i) : 1;
      // 扇形
      let sector = new Sector(this.canvas, {
        start: sumAngle / 180 * Math.PI,
        stop: (angle + sumAngle) / 180 * Math.PI,
        radius: radius * 0.6 * isRose, // 预留40%用于其他类型数据展示
        type: Sector.TYPE.FILL,
        color: this.colors[this.data[i].key],
        position: new Point(this.position.x + this.width / 2, this.position.y + this.height / 2),
      });
      // 标签字符
      let lineAngle = 360 - (sumAngle + angle / 2);
      const point1 = new Point(
        this.position.x + this.width / 2 + Math.cos(lineAngle / 180 * Math.PI) * radius * 0.6 * isRose,
        this.position.y + this.height/ 2 + Math.sin(lineAngle / 180 * Math.PI) * radius * 0.6 * isRose
      );
      const point2 = new Point(
        this.position.x + this.width / 2 + Math.cos(lineAngle / 180 * Math.PI) * radius * 0.7 * isRose,
        this.position.y + this.height / 2 + Math.sin(lineAngle / 180 * Math.PI) * radius * 0.7 * isRose
      );
      const point3 = new Point(
        this.position.x + this.width / 2 + Math.cos(lineAngle / 180 * Math.PI) * radius * 0.7 * isRose + (lineAngle < 90 || lineAngle > 270 ? 20 : -20),
        this.position.y + this.height / 2 + Math.sin(lineAngle / 180 * Math.PI) * radius * 0.7 * isRose
      );
      const text = new Text(this.canvas, {
        text: this.data[i].label,
        size: this.fontSize,
        font: this.fontFamily,
        color: this.color
      });
      text.setPosition(
        this.position.x + this.width / 2 + Math.cos(lineAngle / 180 * Math.PI) * radius * 0.7 * isRose + (lineAngle < 90 || lineAngle > 270 ? 20 : -(20 + text.width)),
        this.position.y + this.height / 2 + Math.sin(lineAngle / 180 * Math.PI) * radius * 0.7 * isRose
      );
      let line = new MultiLine(this.canvas, {
        position: point1,
        color: this.color,
      }, [point2, point3]);
      this.addChild(sector, line, text);
      sumAngle += angle;
    }
  }
}
