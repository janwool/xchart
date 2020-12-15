/*
* @Date: 2020/5/20
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Layer from '../../../core/Layer';
import Line from '../../../base/Line';
import Point from '../../../core/Point';
import Text from '../../../base/Text';
import Polygon from '../../../base/Polygon';
import Circle from '../../../base/Circle';

export default class RadarLayer extends Layer {
  static SHAPE = {
    BLOCK: 1,
    CIRCLE: 2,
  };
  static TYPE = {
    STROKE: 1,
    FILL: 2,
  }
  constructor(canvas, style, data = []) {
    super(canvas, style);
    this.width = style.width || this.canvas.width;
    this.height = style.height || this.canvas.height;
    this.data = data || [];
    this.shape = style.shape || RadarLayer.SHAPE.BLOCK; // 坐标类型
    this.type = style.type || RadarLayer.TYPE.STROKE; // 数值多边形为线框或填充型
    this.colorMap = style.colors || {}; // 对应数据的颜色
    this.graduationNum = style.graduationNum || 4; // 刻度数量
    this.enob = style.enob === undefined ? 2 : style.enob; // 坐标系有效位数
  }

  make() {
    this.childs.splice(0, this.childs.length);
    if (this.data.length <= 0) {
      return;
    }
    let max = -999999999; // 最大值
    let min = 999999999; // 最小值
    // 计算最大值与最小值
    for (let i = 0; i < this.data.length; i++) {
      const item = this.data[i];
      for (let key in item) {
        if (key !== 'label') {
          if (item[key] > max) {
            max = item[key];
          }
          if (item[key] < min) {
            min = item[key];
          }
        }
      }
    }
    // 根据数据量计算步进角度
    const angle = 360 / this.data.length; // 步进角度
    // 根据图层大小计算坐标半径
    const radius = 0.4 * (this.width > this.height ? this.height : this.width);
    // 绘制标签及坐标
    for (let i = 0; i < this.data.length; i++) {
      // 坐标角度
      const axisAngle = angle * i / 180 * Math.PI;
      // 坐标线
      const line = new Line(this.canvas, {
        position: new Point(this.position.x + this.width / 2, this.position.y + this.height / 2),
        to: new Point(
          this.position.x + this.width / 2 + radius * Math.cos(axisAngle),
          this.position.y + this.height / 2 + radius * Math.sin(axisAngle),
        ),
        color: this.color,
        lineWidth: this.lineWidth
      });
      // 标签
      let text = new Text(this.canvas, {
        text: this.data[i].label,
        size: this.fontSize,
        font: this.fontFamily,
        color: this.fontColor
      });
      // 根据旋转的角度设置字体的位置
      if ( angle * i  === 0) {
        text.setPosition(
          this.position.x + this.width / 2 + radius * Math.cos(axisAngle) + 10,
          this.position.y + this.height / 2 + radius * Math.sin(axisAngle) - text.height / 2,
        );
      } else if (angle * i === 90) {
        text.setPosition(
          this.position.x + this.width / 2 + radius * Math.cos(axisAngle) - text.width / 2,
          this.position.y + this.height / 2 + radius * Math.sin(axisAngle) + 10,
        );
      } else if (angle * i < 90) {
        text.setPosition(
          this.position.x + this.width / 2 + radius * Math.cos(axisAngle) + 10,
          this.position.y + this.height / 2 + radius * Math.sin(axisAngle),
        );
      } else if (angle  * i === 180) {
        text.setPosition(
          this.position.x + this.width / 2 + radius * Math.cos(axisAngle) - text.width - 10,
          this.position.y + this.height / 2 + radius * Math.sin(axisAngle) - text.height / 2,
        );
      } else if (angle * i > 90 && angle * i < 180) {
        text.setPosition(
          this.position.x + this.width / 2 + radius * Math.cos(axisAngle) - text.width - 10,
          this.position.y + this.height / 2 + radius * Math.sin(axisAngle),
        );
      } else if (angle * i > 180 && angle * i < 270) {
        text.setPosition(
          this.position.x + this.width / 2 + radius * Math.cos(axisAngle) - text.width - 10,
          this.position.y + this.height / 2 + radius * Math.sin(axisAngle) - text.height,
        );

      } else if (angle * i === 270) {
        text.setPosition(
          this.position.x + this.width / 2 + radius * Math.cos(axisAngle) - text.width / 2,
          this.position.y + this.height / 2 + radius * Math.sin(axisAngle) - text.height,
        );
      } else if (angle * i > 270) {
        text.setPosition(
          this.position.x + this.width / 2 + radius * Math.cos(axisAngle) + 10,
          this.position.y + this.height / 2 + radius * Math.sin(axisAngle) - text.height,
        );

      }
      this.addChild(line, text);
    }
    let axisMin = 0; // 刻度的最小值
    let axisMax = 0; // 刻度的最大值
    // 这里我们确保我们的数据不会充盈整个坐标，也不会缩小到0点情况
    if (min < 0 && max > 0) {
      axisMin = Math.abs(min) > Math.abs(max) ? - Math.abs(min) * 1.1 : - Math.abs(max) * 1.1;
      axisMax = max * 1.1;
    } else if (min < 0 && max < 0) {
      axisMin = min * 1.1;
      axisMax = 0;
    } else if (min > 0) {
      axisMin = 0;
      axisMax = max * 1.1;
    }
    // 单位数值的单位长度
    let radiusStep = radius / (axisMax - axisMin);
    // 单位刻度的长度
    let graduationStep = radius / this.graduationNum;
    // 绘制刻度多边形
    for (let i = 0; i <= this.graduationNum; i++) {
      if (this.shape === RadarLayer.SHAPE.BLOCK) {
        // 刻度为多边形
        // 多边形的点数组
        let polygonPoints = [];
        for (let j = 0; j < this.data.length; j++) {
          polygonPoints.push(
            new Point(
              this.position.x + this.width / 2 + i * graduationStep * Math.cos(angle * j / 180 * Math.PI),
              this.position.y + this.height / 2 + i * graduationStep * Math.sin(angle * j / 180 * Math.PI)
            )
          )
        }
        console.log(this.lineWidth)
        let polygon = new Polygon(this.canvas, {
          lineWidth: this.lineWidth,
          color: this.color,
          type: Polygon.TYPE.STROKE,
        }, polygonPoints);
        this.addChild(polygon);
      } else {
        // 刻度为圆
        let circle = new Circle(this.canvas, {
          type: Circle.TYPE.STROKE,
          radius: i * graduationStep,
          position: new Point(this.position.x + this.width / 2, this.position.y + this.height / 2),
          lineWidth: 1,
        });
        this.addChild(circle);
      }
      // 刻度值
      let txtValue = (i * graduationStep / radiusStep + axisMax).toFixed(this.enob);
      let text = new Text(this.canvas, {
        text: txtValue,
        font: this.fontFamily,
        size: this.fontSize,
        color: this.fontColor,
        position: new Point(this.position.x + this.width / 2 + i * graduationStep, this.position.y + this.height / 2)
      });
      this.addChild(text);
    }
    // 绘制数据
    // 数据多边形对象
    let dataPolygons = {};
    // 遍历数据构建数据多变形对象
    for (let i = 0; i < this.data.length; i++) {
      const item = this.data[i];
      for(let key in item) {
        if (key !== 'label') {
          if (dataPolygons[key] === undefined) {
            dataPolygons[key] = [];
          }
          let distance = (item[key] - axisMin) * radiusStep;
          let p = new Point(
            this.position.x + this.width / 2 + distance * Math.cos(angle * i / 180 * Math.PI),
            this.position.y + this.height / 2 + distance * Math.sin(angle * i / 180 * Math.PI)
          );
          dataPolygons[key].push(p);
          // 数值点
          let circle = new Circle(this.canvas, {
            radius: this.lineWidth * 5,
            position: p,
            type: Circle.TYPE.FILL,
            color: this.colorMap[key]
          });
          this.addChild(circle);
        }
      }
    }
    // 遍历数据多边形对象，绘制多边形
    for(let key in dataPolygons) {
      let polygon = new Polygon(this.canvas, {
        type: Polygon.TYPE.STROKE,
        color: this.colorMap[key],
        lineWidth: this.lineWidth * 3,
      }, dataPolygons[key]);
      this.addChild(polygon);
      if (this.type === RadarLayer.TYPE.FILL) {
        let fillPolygon = new Polygon(this.canvas, {
          type: Polygon.TYPE.FILL,
          color: this.colorMap[key],
          alpha: 0.3,
        }, dataPolygons[key]);
        this.addChild(fillPolygon);
      }
    }
    // 绘制结束
  }
}
