/*
* @Date: 2020/5/25
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Layer from '../../../core/Layer';
import Point from "../../../core/Point";
import MultiLine from '../../../base/MultiLine';
import Polygon from '../../../base/Polygon';

export default class LineLayer extends Layer {
  static TYPE = {
    STROKE: 1,
    FILL: 2,
  }

  constructor(canvas, style, data = []) {
    super(canvas, style);
    this.data = data; // 数据格式[{item: '2015', a: 0, b: 1, c: 4},{item: '2016', a: 1, b: 3, c: 3}]
    this.colors = style.colors; // 数据格式{ a: '#333333', b: '', c: '' } // 各线条颜色
    this.type = style.type || LineLayer.TYPE.STROKE;
    this.shiftLeft = style.shiftLeft || 20,
    this.showNum = style.showNum || (this.data.length > 30 ? 30 : this.data.length); // 屏幕绘制的数据大小
  }

  make() {
    this.childs.splice(0, this.childs.length);
    if(this.data.length === 0) {
      return;
    }
    // 计算X方向单位数值所占用的长度
    const xStep = this.width / this.showNum;
    this.xStep = xStep;
    // 数据偏移量
    let kLeft = Math.floor(this.position.x / xStep);
    // 数据的结束索引
    let end = this.data.length;
    let start = this.data.length - this.showNum;
    if (kLeft > 0 && this.data.length > kLeft + this.showNum) {
      // 向右移动数量与显示数量小于数据量， 结束索引等于数据量-偏移量
      end = this.data.length - kLeft;
      start = end - this.showNum;
    } else if (kLeft > 0) {
      // 向右移动数量超过数据量， 结束索引等于显示数量
      end = this.showNum;
      start = 0;
    } else {
      // 向左移动
      end = this.data.length - 1;
      start = end - this.showNum - kLeft;
    }
    this.start = start;
    this.end = end;
    let max = -99999999; // 数据最大值
    let min = 99999999; // 数据最小值
    //遍历数据，确定最大值与最小值
    for (let i = start; i < end; i++) {
      for (let key in this.data[i]) {
        if (key !== 'item') {
          if (max < this.data[i][key]) {
            max = this.data[i][key];
          }
          if (min > this.data[i][key]) {
            min = this.data[i][key];
          }
        }
      }
    }
    // 计算Y方向单位数值所占用的长度
    const yStep = this.height / (max - min);

    // 记录各线条所在的点
    const linePoints = {};
    // 遍历数据计算点的位置
    for (let i = start; i < end; i++) {
      const data = this.data[i];
      for(let key in data) {
        if (key !== 'item') {
          if (!linePoints[key]) {
            linePoints[key] = [];
          }
          linePoints[key].push(
            new Point(
              this.shiftLeft + (i - start) * xStep,
              this.position.y + (data[key] - min) * yStep
            )
          );
        }
      }
    }
    // 遍历所有的点数据，绘制相应曲线
    for (let key in linePoints) {
      let line = new MultiLine(this.canvas, {
        ...this.style,
        color: this.colors[key],
        position: linePoints[key][0],
      }, linePoints[key]);
      // 绘制面积图
      if (this.type === LineLayer.TYPE.FILL) {
        let polygon = new Polygon(this.canvas, {
          color: this.colors[key],
          type: Polygon.TYPE.FILL,
        }, [
          new Point(linePoints[key][0].x, 20),
          ...linePoints[key],
          new Point(linePoints[key][linePoints[key].length - 1].x, 20)
        ]) // 增加前后两个点使其闭合
        polygon.alpha = 0.4; // 修改透明度
        this.addChild(polygon);
      }
      this.addChild(line);
    }
    this.onMaked && this.onMaked(this, {
      start,
      end,
      xStep,
      yStep,
      yMax: max,
      yMin: min,
    });
  }

  containsPoint(point) {
    return point.x >= 0
      && point.x <= this.width
      && point.y >= this.position.y
      && point.y <= this.position.y + this.height;
  }
}
