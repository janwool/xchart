/*
* @Date: 2020/5/18
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import React from 'react';
import AxisLayer from '../../layer/AxisLayer';
import Canvas from '../../core/Canvas';
import Point from '../../core/Point';
import KBarLayer from './bu/KBarLayer';
import Event from '../../event/Event';
import Bar from './bu/KBar';
import AccelerateAction from '../../action/AccelerateAction';

export default class extends React.Component {
  static BAR_TYPE = {
    FILL: Bar.BAR_TYPE.FILL,
    STROKE: Bar.BAR_TYPE.STROKE,
  }
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const { data = [] } = nextProps;
    if (this.props.data !== data) {
      this.barLayer.data = data;
      this.barLayer.make();
      this.canvas.paint();
    }
  }

  componentDidMount () {
    const { style = { xFontSize: 20, yFontSize: 20 }, data = [] } = this.props;
    this.canvas = new Canvas({
      ele: this.ref.current,
      canAction: false,
    });
    // 坐标系基础配置
    this.axisLayer = new AxisLayer(this.canvas, {
      yAxisType: AxisLayer.AxisType.NUMBER, // y轴为数值型
      xAxisType: AxisLayer.AxisType.LABEL,  // x轴时间为字符型
      xAxisGraduations: style.xAxis || 5,   // 网格5列
      yAxisGraduations: style.yAxis || 5,   // 网格5行
      xAxisPosition: AxisLayer.AxisPosition.BLOCK,  // X轴坐标不计算
      yAxisPosition: AxisLayer.AxisPosition.INNER,  // Y轴坐标计算
      yAxisRender: (value) => {
        const enob = style.enob || 2;
        return {
          text: Number(value).toFixed(enob),
          size: Number(style.yFontSize || 20),
          color: style.axisColor || '#999999',
          font: style.fontFamily || 'PingFang SC',
        };
      },
      xAxisRender: (label) => {
        const { value } = label;
        return {
          text: value,
          size: Number(style.xFontSize || 20),
          color: style.axisColor || '#999999',
          font: style.fontFamily || 'PingFang SC',
        };
      },
      color: style.color,
    });
    // K线坐标
    this.barLayer = new KBarLayer(this.canvas, {
      height: (this.canvas.height - style.xFontSize * this.canvas.ratio) * 0.8, // 预留20%的空白空间
      positiveColor: style.positiveColor,
      negativeColor: style.negativeColor,
      positiveType: style.positiveType,
      negativeType: style.negativeType,
      position: new Point(0, style.xFontSize * this.canvas.ratio * 0.9 + 0.1 * this.canvas.height), // 预留的10% + 坐标的高度
    }, data);
    this.barLayer.onMaked = (layer, option) => {
      const { max, min, barWidth, yDelta, start, end } = option;
      // 计算坐标的最大值与最小值，加减预留部分的数值
      let yAxisMax = max + (this.canvas.height - style.xFontSize * this.canvas.ratio) * 0.1 / yDelta;
      let yAxisMin = min - (this.canvas.height - style.xFontSize * this.canvas.ratio) * 0.1 / yDelta;
      this.axisLayer.yAxisMin = yAxisMin;
      this.axisLayer.yAxisMax = yAxisMax;
      // 设置X轴时间的坐标
      let dataWidth = (end - start) * barWidth;
      // 假设间距为100个画布像素
      let dataNum = Math.round(dataWidth / 500);
      // 计算100画布像素索引距离
      let indexStep = Math.round(500 / barWidth);
      // x轴坐标数组
      let xAxisData = [];
      for (let i = 0; i < dataNum; i++) {
        const date = data[end - 1 - i * indexStep].time;
        xAxisData.unshift({
          value: date,
          position: new Point((end - 1 - i * indexStep - start) * barWidth, 0),
        });
      }
      this.axisLayer.xAxisLabels = xAxisData;
      this.axisLayer.make();
    }
    this.canvas.addChild(this.axisLayer, this.barLayer);
    this.barLayer.make();
    this.canvas.paint();
    // 监听拖动事件
    this.barLayer.addEventListener(Event.EVENT_DRAG, (e) => {
      this.onChartDrag(e);
    });
    this.barLayer.addEventListener(Event.EVENT_DRAG_END, (e) => {
      this.onChartDragEnd(e);
    });
    // 监听滚轮K线缩放
    this.barLayer.addEventListener(Event.EVENT_WHEEL, (e) => {
      this.onChartScale(e);
    });
  }

  /**
   * 图表缩放
   * @param e
   */
  onChartScale = (e) => {
    if(this.barLayer.locked) {
      return;
    }
    if (e.nativeEvent.wheelDeltaY < 0) {
      if (this.barLayer.showNum < this.barLayer.data.length) {
        this.barLayer.showNum = Math.round(this.barLayer.showNum * 1.1);
        this.barLayer.make();
        this.canvas.paint();
      }
    } else {
      if (this.barLayer.showNum > 20) {
        this.barLayer.showNum = Math.round(this.barLayer.showNum * 0.9);
        this.barLayer.make();
        this.canvas.paint();
      }
    }
  }

  onChartDrag = (e) => {
    if (this.barLayer.locked) {
      return;
    }
    if (
      this.barLayer.position.x + e.distanceX
      >= (this.barLayer.data.length - this.barLayer.showNum) * this.barLayer.barWidth
    ) {
      // 移动的距离超过所有数据的长度， 设置为最大长度
      this.barLayer.setPosition((this.barLayer.data.length - this.barLayer.showNum) * this.barLayer.barWidth, this.barLayer.position.y);
    } else if(this.barLayer.position.x <= - this.barLayer.width / 2) {
      // 至少保证K线数据占据半屏
      this.barLayer.setPosition(-this.barLayer.width / 2, this.barLayer.position.y);
    }else {
      // K线平移相应的距离
      this.barLayer.setPosition(this.barLayer.position.x + e.distanceX, this.barLayer.position.y);
    }
    this.barLayer.make();
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
    const { className = ''} = this.props;
    return (
      <div className={className} ref={this.ref} />
    );
  }
}
