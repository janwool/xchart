/*
* @Date: 2020/5/22
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import React from 'react';
import Canvas from '../../core/Canvas';
import LineLayer from './bu/LineLayer';
import AxisLayer from '../../layer/AxisLayer';
import AccelerateAction from '../../action/AccelerateAction'
import Point from "../../core/Point";
import Event from '../../event/Event';

export default class extends React.Component {
  static LINE_CAP = {
    BUTT: 'butt',
    ROUND: 'round',
    SQUARE: 'square'
  }
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const { data = [] } = nextProps;
    if (data !== this.props.data) {
      this.line.data = data;
      this.line.make();
      this.canvas.paint();
    }
  }

  componentDidMount () {
    const { style = {}, data = [] } = this.props;
    console.log(data);
    this.canvas = new Canvas({
      ele: this.ref.current,
      canAction: false,
    });
    const xFontSize = Number(style.xFontSize || 20);
    const yFontSize = Number(style.yFontSize || 20);
    // 坐标系基础配置
    this.axisLayer = new AxisLayer(this.canvas, {
      yAxisType: AxisLayer.AxisType.NUMBER, // y轴为数值型
      xAxisType: AxisLayer.AxisType.LABEL,  // x轴时间为字符型
      xAxisGraduations: style.xAxis || 5,   // 网格5列
      yAxisGraduations: style.yAxis || 5,   // 网格5行
      xAxisPosition: AxisLayer.AxisPosition.BLOCK,  // X轴坐标不计算
      yAxisPosition: AxisLayer.AxisPosition.BLOCK,  // Y轴坐标计算
      yAxisRender: (value) => {
        const enob = style.enob || 2;
        return {
          text: Number(value).toFixed(enob),
          size: yFontSize,
          color: style.fontColor || '#999999',
          font: style.fontFamily || 'PingFang SC',
        };
      },
      xAxisRender: (label) => {
        const { value } = label;
        return {
          text: value,
          size: xFontSize,
          color: style.fontColor || '#999999',
          font: style.fontFamily || 'PingFang SC',
        };
      },
      color: style.color,
    });
    this.line = new LineLayer(this.canvas, {
      width: this.canvas.width - yFontSize * 4,
      height: (this.canvas.height - xFontSize * this.canvas.ratio) * 0.8, // 预留20%的空白空间
      colors: style.colors,
      shiftLeft: yFontSize * 4,
      type: style.type || LineLayer.TYPE.STROKE,
      position: new Point(
        yFontSize * 4,
        xFontSize * this.canvas.ratio * 0.9 + this.canvas.height * 0.1
      )
    }, data);
    this.line.onMaked = (layer, option) => {
      const { xStep, yStep, yMax, yMin, start, end } = option;
      // 计算坐标系坐标数值
      const yAxisMax = yMax + (this.canvas.height - xFontSize * this.canvas.ratio) * 0.1 / yStep;
      const yAxisMin = yMin - (this.canvas.height - xFontSize * this.canvas.ratio) * 0.1 / yStep;
      // 设置X轴时间的坐标
      // 假设间距为100个画布像素
      let dataNum = Math.round(this.line.width / 100);
      // 计算100画布像素索引距离
      let indexStep = Math.round(100 / xStep);
      // x轴坐标数组
      let xAxisData = [];
      for (let i = 0; i < dataNum; i++) {
        console.log(this.line.position.x + (end - 1 - i * indexStep - start) * xStep)
        if (end - 1 - i > start) {
          const label = data[end - 1 - i * indexStep].item;
          xAxisData.unshift({
            value: label,
            position: new Point(this.line.position.x + (end - 1 - i * indexStep - start) * xStep, 0),
          });
        }
      }
      this.axisLayer.yAxisMin = yAxisMin;
      this.axisLayer.yAxisMax = yAxisMax;
      this.axisLayer.xAxisLabels = xAxisData;
      this.axisLayer.make();
    }
    this.canvas.addChild(this.axisLayer, this.line);
    this.line.make();
    this.canvas.paint();
    // 监听拖动事件
    this.line.addEventListener(Event.EVENT_DRAG, (e) => {
      console.log(11);
      this.onChartDrag(e);
    });
    // 拖动结束事件
    this.line.addEventListener(Event.EVENT_DRAG_END, (e) => {
      this.onChartDragEnd(e);
    });
    // 监听滚轮缩放
    this.line.addEventListener(Event.EVENT_WHEEL, (e) => {
      this.onChartScale(e);
    });
  }

  /**
   * 图表缩放
   * @param e
   */
  onChartScale = (e) => {
    if(this.line.locked) {
      return;
    }
    if (e.nativeEvent.wheelDeltaY < 0) {
      if (this.line.showNum < this.line.data.length) {
        this.line.showNum = Math.round(this.line.showNum * 1.1);
        this.line.make();
        this.canvas.paint();
      }
    } else {
      if (this.line.showNum > 20) {
        this.line.showNum = Math.round(this.line.showNum * 0.9);
        this.line.make();
        this.canvas.paint();
      }
    }
  }

  onChartDrag = (e) => {
    if (this.line.locked) {
      return;
    }
    if (
      this.line.position.x + e.distanceX
      >= (this.line.data.length - this.line.showNum) * this.line.barWidth
    ) {
      // 移动的距离超过所有数据的长度， 设置为最大长度
      this.line.setPosition((this.line.data.length - this.line.showNum) * this.line.barWidth, this.line.position.y);
    } else if(this.line.position.x <= - this.line.width / 2) {
      // 至少保证K线数据占据半屏
      this.line.setPosition(-this.line.width / 2, this.line.position.y);
    }else {
      // 线平移相应的距离
      this.line.setPosition(this.line.position.x + e.distanceX, this.line.position.y);
    }
    this.line.make();
    this.canvas.paint();
  }

  // 移动结束的关心效果
  onChartDragEnd = (e) => {
    if (this.barLayer.locked) {
      return;
    }
    const accelerate = e.speedX > 0 ? 3000 : -3000; // 加速度3000画布像素每秒
    const duration = Math.abs(e.speedX / accelerate);
    this.accelerateAction = new AccelerateAction(duration, {
      speedX: e.speedX,
      accelerateX: accelerate,
      beforeUpdate: (node, frame) => {
        if (node.position.x >= (this.barLayer.data.length - this.barLayer.showNum) * node.barWidth) {
          node.setPosition((this.barLayer.data.length - this.barLayer.showNum) * node.barWidth, node.position.y);
        } else if(node.position.x <= - this.barLayer.width / 2) {
          node.setPosition(- this.barLayer.width / 2, node.position.y);

        }
        node.make();
      }
    });
    this.barLayer.runAction(this.accelerateAction, (node, action) => {
      // 保证不移除画布
      if (node.position.x >= (this.barLayer.data.length - this.barLayer.showNum) * node.barWidth) {
        node.stopAction(action);
        node.setPosition((this.barLayer.data.length - this.barLayer.showNum) * node.barWidth, node.position.y);
      } else if (node.position.x <= - this.barLayer.width / 2) {
        node.stopAction(action);
        node.setPosition(- this.barLayer.width / 2, node.position.y);
      }
    });
  }

  render() {
    const { className = '' } = this.props;
    return (
      <div className={className} ref={this.ref} />
    );
  }
}
