/*
* @Date: 2020/6/2
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Layer from '../../../core/Layer';
import Text from '../../../base/Text';
import Line from '../../../base/Line';
import Point from '../../../core/Point';
import Rectangle from '../../../base/Rectangle';

export default class extends Layer {
  constructor(canvas, style, data = []) {
    super(canvas, style);
    this.data = data;
    this.yAxisGraduations = style.yAxisGraduations || 3; // y轴刻度线数量
    this.xFontSize = style.xFontSize || 20; // x轴字符大小
    this.yFontSize = style.yFontSize || 20; // y轴字符大小
    this.enob = style.enob || 0; // Y轴有效位数
  }

  make() {
    this.childs.splice(0, this.childs.length);
    if (this.data.length === 0) {
      return;
    }
    let max = Number.MIN_VALUE;
    let min = Number.MAX_VALUE;
    // 计算最大值与最小值
    for (let i = 0; i < this.data.length; i++){
      for (let j = 0; j < this.data[i].data.length; j++) {
        if (this.data[i].data[j].value > max) {
          max = this.data[i].data[j].value;
        }
        if (this.data[i].data[j].value < min) {
          min = this.data[i].data[j].value;
        }
      }
    }
    if (min > 0) {
      // 最大值最小值都大于0的情况下，那么最小值为0
      // 计算绘图区域的高度
      const entityHeight = this.height - this.xFontSize;
      // 计算最大Y坐标值， 最大柱形占绘图区域的80%
      const maxValue = max / 0.8;
      // 根据最大Y坐标值计算单位数值占用的高度
      const yStep = maxValue / entityHeight;
      this.yStep = yStep;
      // 计算Y坐标线的高度步长
      const yAxisStep = entityHeight / this.yAxisGraduations;
      // 记录Y坐标值最大宽度
      let yFontMaxWidth = 0;
      // 绘制Y轴坐标值
      for (let i = 0; i < this.yAxisGraduations; i++) {
        const value = (i * yAxisStep * yStep).toFixed(this.enob);
        const yText = new Text(this.canvas, {
          text: value,
          font: this.fontFamily,
          size: this.yFontSize,
          color: this.fontColor,
        });
        // Y轴坐标值偏移
        const yShift = i === 0 ? 0 : i === this.yAxisGraduations - 1 ? yText.height : yText.height / 2;
        yText.setPosition(this.position.x, this.position.y + this.xFontSize + i * yAxisStep - yShift);
        if (yFontMaxWidth < yText.width) {
          yFontMaxWidth = yText.width;
        }
        this.addChild(yText);
      }
      // 绘制Y轴坐标线
      for (let i = 0; i < this.yAxisGraduations; i++) {
        const line = new Line(this.canvas, {
          lineWidth: 0.5,
          lineDash: [5, 2],
          color: this.color,
          position: new Point(this.position.x + yFontMaxWidth, this.position.y + this.xFontSize + i * yAxisStep),
          to: new Point(this.position.x + this.width, this.position.y + this.xFontSize + i * yAxisStep),
        });
        this.addChild(line);
      }
      // 根据Y轴坐标宽度计算可绘制柱形区域的宽度
      const entityWidth = this.width - yFontMaxWidth;
      // 计算X轴单位宽度
      const xStep = entityWidth / this.data.length;
      this.xStep = xStep;
      this.yFontWidth = yFontMaxWidth;
      // 绘制柱体
      for (let i = 0; i < this.data.length; i++) {
        // 计算组内柱体的宽度, 左右边距0.1 * xStep
        const xStep1 = xStep * 0.8 / this.data[i].data.length;
        // 遍历组内数据，绘制长方形柱体
        for (let j = 0; j < this.data[i].data.length; j++) {
          // 计算柱体的高度
          const height = (this.data[i].data[j].value - 0) / yStep;
          // 绘制长方形
          const rect = new Rectangle(this.canvas, {
            width: xStep1,
            height,
            type: Rectangle.TYPE.FILL,
            color: this.data[i].data[j].color,
            position: new Point(
              this.position.x + yFontMaxWidth + (i + 0.1) * xStep + j * xStep1 + xStep1 / 2,
              this.position.y + this.xFontSize + height / 2
            ),
          });
          this.addChild(rect);
        }
        // 绘制X轴坐标
        let xText = new Text(this.canvas, {
          font: this.fontFamily,
          size: this.fontSize,
          color: this.fontColor,
          text: this.data[i].label,
        });
        xText.setPosition(
          this.position.x + yFontMaxWidth + (i + 0.5) * xStep - xText.width / 2,
              this.position.y
        );
        this.addChild(xText);
      }
    } else {
      // 最大值大于0，最小值小于0的情况
      // 计算绘图区域的高度
      const entityHeight = this.height - this.xFontSize;
      const yAbsMax = Math.abs(max) > Math.abs(min) ? Math.abs(max) : Math.abs(min);
      // 根据最大Y坐标值计算单位数值占用的高度
      const yStep = yAbsMax / 0.9 / entityHeight;
      this.yStep = yStep;
      const yAxisCount = Math.ceil((this.yAxisGraduations + 1) / 2);
      // y轴高度步进
      const yAxisStep = entityHeight / yAxisCount / 2;
      let yFontMaxWidth = 0;
      for (let i = 1; i < yAxisCount; i++) {
        const value = (i * yAxisStep * yStep).toFixed(this.enob);
        // 正方向坐标值
        const yText = new Text(this.canvas, {
          text: value,
          font: this.fontFamily,
          size: this.yFontSize,
          color: this.fontColor,
        });
        // Y轴坐标值偏移
        const yShift = i === yAxisCount - 1 ? yText.height : yText.height / 2;
        yText.setPosition(
          this.position.x,
          this.position.y + entityHeight / 2 + this.xFontSize + i * yAxisStep - yText.height / 2
        );
        if (yFontMaxWidth < yText.width) {
          yFontMaxWidth = yText.width;
        }
        // 负方向坐标值
        const yText2 = new Text(this.canvas, {
          text: `-${value}`,
          font: this.fontFamily,
          size: this.yFontSize,
          color: this.fontColor
        });
        yText2.setPosition(
          this.position.x,
          this.position.y + entityHeight / 2 + this.xFontSize - i * yAxisStep - yText2.height / 2
        );
        if (yFontMaxWidth < yText2.width) {
          yFontMaxWidth = yText2.width;
        }
        this.addChild(yText, yText2);
      }
      // 绘制Y轴坐标线
      for (let i = 1; i < yAxisCount; i++) {
        // 正方向
        const line = new Line(this.canvas, {
          lineWidth: 0.5,
          lineDash: [5, 2],
          color: this.color,
          position: new Point(
            this.position.x + yFontMaxWidth,
            this.position.y + this.xFontSize + i * yAxisStep + entityHeight / 2
          ),
          to: new Point(
            this.position.x + this.width,
            this.position.y + this.xFontSize + i * yAxisStep + entityHeight / 2
          ),
        });
        // 负方向
        const line2 = new Line(this.canvas, {
          lineWidth: 0.5,
          lineDash: [5, 2],
          color: this.color,
          position: new Point(
            this.position.x + yFontMaxWidth,
            this.position.y + this.xFontSize - i * yAxisStep + entityHeight / 2
          ),
          to: new Point(
            this.position.x + this.width,
            this.position.y + this.xFontSize - i * yAxisStep + entityHeight / 2
          ),
        });
        this.addChild(line, line2);
      }
      // 绘制0轴与0线
      let zeroText = new Text(this.canvas, {
        text: '0',
        font: this.fontFamily,
        size: this.yFontSize,
        color: this.fontColor
      });
      zeroText.setPosition(this.position.x, this.position.y + this.xFontSize + entityHeight / 2 - zeroText.height / 2);
      let zeroLine = new Line(this.canvas, {
        lineWidth: 0.5,
        lineDash: [5, 2],
        color: this.color,
        position: new Point(
          this.position.x + yFontMaxWidth,
          this.position.y + this.xFontSize + entityHeight / 2
        ),
        to: new Point(
          this.position.x + this.width,
          this.position.y + this.xFontSize + entityHeight / 2
        ),
      });
      this.addChild(zeroText, zeroLine);
      // 根据Y轴坐标宽度计算可绘制柱形区域的宽度
      const entityWidth = this.width - yFontMaxWidth;
      // 计算X轴单位宽度
      const xStep = entityWidth / this.data.length;
      this.yFontWidth = yFontMaxWidth;
      this.xStep = xStep;
      // 绘制柱体
      for (let i = 0; i < this.data.length; i++) {
        // 计算组内柱体的宽度, 左右边距0.1 * xStep
        const xStep1 = xStep * 0.8 / this.data[i].data.length;
        // 遍历组内数据，绘制长方形柱体
        for (let j = 0; j < this.data[i].data.length; j++) {
          // 计算柱体的高度
          const height = (Math.abs(this.data[i].data[j].value) - 0) / yStep;
          // 绘制长方形
          const rect = new Rectangle(this.canvas, {
            width: xStep1,
            height,
            type: Rectangle.TYPE.FILL,
            color: this.data[i].data[j].color,
            position: new Point(
              this.position.x + yFontMaxWidth + (i + 0.1) * xStep + j * xStep1 + xStep1 / 2,
              this.position.y + entityHeight / 2 + height / 2 + this.xFontSize - (this.data[i].data[j].value > 0 ? 0 : height)
            ),
          });
          this.addChild(rect);
        }
        // 绘制X轴坐标
        let xText = new Text(this.canvas, {
          font: this.fontFamily,
          size: this.fontSize,
          color: this.fontColor,
          text: this.data[i].label,
        });
        xText.setPosition(
          this.position.x + yFontMaxWidth + (i + 0.5) * xStep - xText.width / 2,
          this.position.y
        );
        this.addChild(xText);
      }
    }
  }

  containsPoint(point) {
    return point.x >= 0
      && point.x <= this.width
      && point.y >= this.position.y
      && point.y <= this.position.y + this.height;
  }
}
