/*
* @Date: 2020/5/21
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import React from 'react';
import Canvas from '../../core/Canvas';
import ScatterLayer from './bu/ScatterLayer';
import AxisLayer from '../../layer/AxisLayer';
import Point from '../../core/Point';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const { data = [] } = nextProps;
    if (this.props.data !== data) {
      this.scatter.data = data;
      this.scatter.make();
      this.canvas.paint();
    }
  }

  componentDidMount () {
    const { data = [], style } = this.props;
    this.canvas = new Canvas({
      ele: this.ref.current,
      canAction: false,
    });
    const xFontSize = Number(style.xFontSize || 20);
    const yFontSize = Number(style.yFontSize || 20);
    // 坐标轴标准配置
    this.axisLayer = new AxisLayer(this.canvas, {
      yAxisType: AxisLayer.AxisType.NUMBER, // y轴为数值型
      xAxisType: AxisLayer.AxisType.NUMBER,  // x轴时间为字符型
      xAxisGraduations: style.xAxis || 5,   // 网格5列
      yAxisGraduations: style.yAxis || 5,   // 网格5行
      xAxisPosition: AxisLayer.AxisPosition.BLOCK,  // X轴坐标不计算
      yAxisPosition: AxisLayer.AxisPosition.BLOCK,  // Y轴坐标计算
      yAxisRender: (value) => {
        const enob = style.xEnob || 2;
        return {
          text: Number(value).toFixed(enob),
          size: yFontSize,
          color: style.axisColor || '#999999',
          font: style.fontFamily || 'PingFang SC',
        };
      },
      xAxisRender: (value) => {
        const enob = style.yEnob || 2;
        return {
          text: Number(value).toFixed(enob),
          size: xFontSize,
          color: style.axisColor || '#999999',
          font: style.fontFamily || 'PingFang SC',
        };
      },
      color: style.color,
    });
    // 散点图层
    this.scatter = new ScatterLayer(this.canvas, {
      width: (this.canvas.width - yFontSize * 4 * this.canvas.ratio) * 0.8, // 预留20%的空白空间
      height: (this.canvas.height - xFontSize * this.canvas.ratio) * 0.8, // 预留20%的空白空间
      colors: style.colors,
      color: style.color,
      radius: style.radius,
      xAxis: style.xAxisAttr, // x轴坐标属性
      yAxis:  style.yAxisAttr, // y轴坐标属性
      onMouseOver: this.props.onMouseOver,
      position: new Point(
        yFontSize * 3.6 * this.canvas.ratio + this.canvas.width * 0.1,
        xFontSize * this.canvas.ratio * 0.9 + this.canvas.height * 0.1
      )
    }, data);
    this.scatter.onMaked = (layer, option) => {
      const { xMax, xMin, yMax, yMin, xStep, yStep } = option;
      // 计算坐标系坐标数值
      const yAxisMax = yMax + (this.canvas.height - xFontSize * this.canvas.ratio) * 0.1 / yStep;
      const yAxisMin = yMin - (this.canvas.height - xFontSize * this.canvas.ratio) * 0.1 / yStep;
      const xAxisMax = xMax + (this.canvas.width - yFontSize * 4 * this.canvas.ratio) * 0.1 / xStep;
      const xAxisMin = xMin - (this.canvas.width - yFontSize * 4 * this.canvas.ratio) * 0.1 / xStep;
      // 设置坐标轴的最大最小值
      this.axisLayer.yAxisMin = yAxisMin;
      this.axisLayer.yAxisMax = yAxisMax;
      this.axisLayer.xAxisMin = xAxisMin;
      this.axisLayer.xAxisMax = xAxisMax;
      this.axisLayer.make();
    }
    this.canvas.addChild(this.axisLayer, this.scatter);
    this.scatter.make();
    this.canvas.paint();
  }

  render() {
    const { className = '' } = this.props;
    return (
      <div className={className} ref={this.ref} />
    );
  }
}
