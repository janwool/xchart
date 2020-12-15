/*
* @Date: 2020/5/18
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Layer from '../../../core/Layer';
import Bar from './KBar';
import Point from '../../../core/Point';

export default class extends Layer {
  constructor(canvas, style, data = []) {
    super(canvas, style);
    this.data = data; // K线数据
    this.width = style.width || this.canvas.width;  // K线图层宽度
    this.height = style.height || this.canvas.height; // K线图层高度
    this.positiveColor = style.positiveColor || '#EE1100';  // 阳线颜色
    this.negativeColor = style.negativeColor || '#00C000';  // 阴线颜色
    this.positiveType = style.positiveType || Bar.BAR_TYPE.FILL; // 阳线类型
    this.negativeType = style.negativeType || Bar.BAR_TYPE.FILL; // 阴线类型
    this.showNum = style.showNum || 30; // 单屏展示数量
    this.locked = false; // 事件处理时，是否锁定标识
  }

  make() {
    if (this.data.length === 0) {
      return;
    }
    // 移除所有子元素
    this.childs.splice(0, this.childs.length);
    // K线宽度
    const barWidth = this.width / this.showNum;
    this.barWidth = barWidth;
    // 数据偏移量
    let kLeft = Math.floor(this.position.x / barWidth);
    // 数据的结束索引
    let barEnd = this.data.length;
    let barStart = this.data.length - this.showNum;
    if (kLeft > 0 && this.data.length > kLeft + this.showNum) {
      // 向右移动数量与显示数量小于数据量， 结束索引等于数据量-偏移量
      barEnd = this.data.length - kLeft;
      barStart = barEnd - this.showNum;
    } else if (kLeft > 0) {
      // 向右移动数量超过数据量， 结束索引等于显示数量
      barEnd = this.showNum;
      barStart = 0;
    } else {
      // 向左移动
      barEnd = this.data.length - 1;
      barStart = barEnd - this.showNum - kLeft;
    }
    this.barStart = barStart;
    this.barEnd = barEnd;
    // 计算当前屏数据的最大值最小值
    let max = this.data[barStart].high;
    let min = this.data[barEnd].low;
    for (let i = barStart; i < barEnd; i++) {
      if (this.data[i].high > max) {
        max = this.data[i].high;
      }
      if (this.data[i].low < min) {
        min = this.data[i].low;
      }
    }
    this.max = max;
    this.min = min;
    // 根据最大值最小值计算单位数值的单位高度
    let yDelta = this.height / (max - min);
    /**柱图绘制开始**/
    for (let i = barStart; i < barEnd; i++) {
      // 阴线或阳线
      const isPositive = Number(this.data[i].close) > Number(this.data[i].open);
      // K线颜色
      const color = isPositive ? this.positiveColor : this.negativeColor;
      // 线图或填充图
      const type = isPositive ? this.positiveType : this.negativeType;
      const bar = new Bar(this.canvas, {
        width: barWidth,
        delta: yDelta,
        baseLine: min,
        color,
        type,
        // 柱状图位置
        position: new Point((i - barStart) * barWidth, this.position.y)
      }, this.data[i]);
      this.addChild(bar);
    }
    /**柱图绘制结束*/
    /**
     * 构建结束回调
     * **/
    this.onMaked && this.onMaked(this, {
      max,
      min,
      barWidth,
      yDelta,
      start: barStart,
      end: barEnd
    });
  }

  containsPoint(point) {
    return point.x >= 0
      && point.x <= this.width
      && point.y >= this.position.y
      && point.y <= this.position.y + this.height;
  }
}
