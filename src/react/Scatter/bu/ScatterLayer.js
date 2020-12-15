/*
* @Date: 2020/5/21
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Layer from '../../../core/Layer';
import Circle from '../../../base/Circle';
import Point from '../../../core/Point';
import Event from '../../../event/Event';


export default class extends Layer {
  constructor(canvas, style, data = []) {
    super(canvas, style);
    this.data = data;
    this.xAxis = style.xAxis; // x轴坐标属性
    this.yAxis = style.yAxis; // y轴坐标属性
    this.colors = style.colors || {}; //  属性颜色
    this.radius = style.radius || 5; // 散点半径
    this.onMouseOver = style.onMouseOver; // 鼠标移动到三点上的回调
  }

  make() {
    this.clearEventListener();
    this.childs.splice(0, this.childs.length);
    if (this.data.length <= 0 || !this.xAxis || !this.yAxis) {
      return;
    }
    let xMax = this.data[0][this.xAxis];  // x方向最大值
    let xMin = xMax;                      // x方向最小值
    let yMax = this.data[0][this.yAxis];  // y方向最大值
    let yMin = yMax;                      // y方向最小值
    // 遍历数据计算X方向与Y方向的最大值与最小值
    for (let i = 0; i < this.data.length; i++) {
      if (xMax < this.data[i][this.xAxis]) {
        xMax = this.data[i][this.xAxis];
      }
      if (xMin > this.data[i][this.xAxis]) {
        xMin = this.data[i][this.xAxis];
      }
      if (yMax < this.data[i][this.yAxis]) {
        yMax = this.data[i][this.yAxis];
      }
      if (yMin > this.data[i][this.yAxis]) {
        yMin = this.data[i][this.yAxis];
      }
    }
    // x方向单位数值的单位长度
    const xStep = this.width / (xMax - xMin);
    // y方向单位数值的单位长度
    const yStep = this.height / (yMax - yMin);
    // 遍历数据，绘制散点图
    for (let i = 0; i < this.data.length; i++) {
      const data = this.data[i];
      let circle = new Circle(this.canvas, {
        position: new Point(
          this.position.x + (data[this.xAxis] - xMin) * xStep,
          this.position.y + (data[this.yAxis] - yMin) * yStep,
        ),
        radius: this.radius,
        color: this.colors[data.key],
        type: Circle.TYPE.FILL,
      });
      // 绑定数据到图元上
      circle.ext = data;
      this.addChild(circle);
      // 监听鼠标进入事件
      this.onMouseOver && (
        circle.addEventListener(Event.EVENT_MOUSE_UP, (e) => {
          this.onMouseOver(e);
        })
      );
    }
    // 绘图结束
    /**
     * 构建结束回调
     * **/
    this.onMaked && this.onMaked(this, {
      xMax,
      xMin,
      yMax,
      yMin,
      xStep,
      yStep,
    });
  }
}
