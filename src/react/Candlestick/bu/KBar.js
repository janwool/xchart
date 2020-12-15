/*
* K线单位
* @Date: 2020/5/18
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/

import Node from '../../../core/Node';
export default class Bar extends Node {
  static BAR_TYPE = {
    FILL: 1,
    STROKE: 2,
  }

  constructor(canvas, style, data) {
    super(canvas, style);
    this.open = data.open; // 开盘价
    this.high = data.high; // 最高价
    this.low = data.low;   // 最低价
    this.close = data.close; // 收盘价
    this.datetime = data.datetime; // 时间线
    this.width = style.width || 20; // 烛型宽度
    this.delta = style.delta || 10; // 烛型单位数值所占用的像素
    this.baseLine = style.baseLine || 0; // 数值基线
    this.type = style.type || Bar.BAR_TYPE.FILL; // 柱形是否空心
  }

  set data(data) {
    this.open = data.open; // 开盘价
    this.high = data.high; // 最高价
    this.low = data.low;   // 最低价
    this.close = data.close; // 收盘价
    this.datetime = data.datetime; // 时间线
  }

  draw(painter) {
    // 计算矩形部分的高 |开盘-收盘| * 单位数值所占用的像素
    let barHeight = Math.round(Math.abs(this.close - this.open) * this.delta);
    // 防止开盘价与收盘价相等，高度为0，如十字线，默认最小2像素
    barHeight = barHeight > 2 ? barHeight : 3;
    painter.strokeStyle = this.color;
    painter.strokeWidth = '3px';
    painter.fillStyle = this.color;
    let top = Math.max(this.open, this.close);  // 矩形上边界值
    let bottom = Math.min(this.open, this.close);  // 矩形下边界值
    if (this.type === Bar.BAR_TYPE.STROKE) {
      // 当前类型为线框
      // 绘制上部分线条开始
      painter.beginPath();
      // 移到最高点
      painter.moveTo(this.position.x + this.width / 2, this.position.y - (this.high - this.baseLine) * this.delta);
      // 移动到矩形上边界
      painter.lineTo(this.position.x + this.width / 2, this.position.y - (top - this.baseLine) * this.delta);
      painter.closePath();
      painter.stroke();
      // 上部分线条绘制结束
      // 绘制下部分线条开始
      painter.beginPath();
      // 移动到最低价位置
      painter.moveTo(this.position.x + this.width / 2, this.position.y - (this.low - this.baseLine) * this.delta);
      // 移动到矩形下边界
      painter.lineTo(this.position.x + this.width / 2, this.position.y - (bottom - this.baseLine) * this.delta);
      painter.closePath();
      painter.stroke();
      // 下部分线条结束
      // 绘制矩形部分
      painter.strokeRect(
        this.position.x + Math.round(0.1 * this.width),
        this.position.y - Math.round((top - this.baseLine) * this.delta),
        Math.round(this.width * 0.8),
        barHeight
      );
      // 绘制矩形结束
    } else {
      // 绘制最高最低价线型
      painter.beginPath();
      // 最高价
      painter.moveTo(this.position.x + this.width / 2, this.position.y - (this.high - this.baseLine) * this.delta);
      // 最低价
      painter.lineTo(this.position.x + this.width / 2, this.position.y - (this.low - this.baseLine) * this.delta);
      painter.closePath();
      painter.stroke();
      // 线型绘制结束
      // 绘制矩形部分
      painter.fillRect(
        this.position.x + Math.round(0.1 * this.width),
        this.position.y - Math.round((top - this.baseLine) * this.delta),
        Math.round(this.width * 0.8),
        barHeight
      );
    }
  }

  containsPoint(point) {
    return false;
  }
}
