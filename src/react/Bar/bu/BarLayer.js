/*
* @Date: 2020/5/28
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Layer from '../../../core/Layer';
import Rectangle from '../../../base/Rectangle';
import Point from '../../../core/Point';
import Text from '../../../base/Text';


export default class BarLayer extends Layer {
  constructor(canvas, style, data = []) {
    super(canvas, style);
    this.data = data;// 数据格式[{label: '11', data: [{key: 22, value: ''}]}]
    this.colors = style.colors;
  }


  make() {
    this.childs.splice(0, this.childs.length);
    if (this.data.length === 0) {
      return;
    }
    let max = -9999999999999;
    let min = 9999999999999;
    // 计算所有数据的最大值与最小值
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].data.length; j++) {
        if (this.data[i].data[j].value > max) {
          max = this.data[i].data[j].value;
        }
        if (this.data[i].data[j].value < min) {
          min = this.data[i].data[j].value;
        }
      }
    }
    // 计算
    let xStep = this.width / max;
    let yStep = this.height / this.data.length;
    // 遍历数据，绘制柱形（长方形）
    for(let i = 0; i < this.data.length; i++) {
      // 长方形高度
      let rectHeight = yStep * 0.8 / this.data[i].data.length;
      for(let j = 0; j < this.data[i].data.length; j++) {
          // 长方形宽度
        let rectWidth = this.data[i].data[j].value * xStep;
        console.log(this.position.x);
        const rect = new Rectangle(this.canvas, {
          width: rectWidth,
          height: rectHeight,
          type: Rectangle.TYPE.FILL,
          color: this.colors[this.data[i].data[j].key],
          position: new Point(this.position.x + rectWidth / 2, this.position.y + (i + 0.1) * yStep + j * rectHeight),
        });
        console.log(rect);
        this.addChild(rect);
      }
      let txt = new Text(this.canvas, {
        text: this.data[i].label,
        font: this.fontFamily,
        size: this.fontSize,
        color: this.fontColor,
      });
      txt.setPosition(new Point(0, this.position.y + (i + 0.5) * yStep - txt.height))
      this.addChild(txt);
    }
    this.onMaked && this.onMaked(this, {
      max,
      xStep,
      yStep
    });
  }
}
