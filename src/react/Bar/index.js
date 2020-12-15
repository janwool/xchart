/*
* @Date: 2020/5/21
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import React from 'react';
import Canvas from '../../core/Canvas';
import BarLayer from './bu/BarLayer';
import AxisLayer from '../../layer/AxisLayer';
import Point from '../../core/Point';
import Text from '../../base/Text';

export default class extends React.Component {
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
    const { data = [], style } = this.props;
    this.canvas = new Canvas({
      ele: this.ref.current,
      canAction: false,
    });
    const xFontSize = Number(style.xFontSize || 20);
    const yFontSize = Number(style.yFontSize || 20);
    let width = 0;
    for (let i = 0;i < data.length; i++) {
      const txt = new Text(this.canvas, {
        text: data[i].label,
        size: xFontSize,
        color: style.axisColor || '#999999',
        font: style.fontFamily || 'PingFang SC',
      });
      if (width < txt.width) {
        width = txt.width;
      }
    }
    // 坐标轴标准配置
    this.axisLayer = new AxisLayer(this.canvas, {
      yAxisType: AxisLayer.AxisType.LABEL, // y轴为数值型
      xAxisType: AxisLayer.AxisType.NUMBER,  // x轴时间为字符型
      xAxisGraduations: style.xAxis || 5,   // 网格5列
      yAxisGraduations: style.yAxis || 5,   // 网格5行
      xAxisPosition: AxisLayer.AxisPosition.BLOCK,  // X轴坐标不计算
      yAxisPosition: AxisLayer.AxisPosition.BLOCK,  // Y轴坐标计算
      yAxisLabels: [],
      position: new Point(width + 10, 0),
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
    // 条形图层
    this.barLayer = new BarLayer(this.canvas, {
      width: (this.canvas.width - yFontSize * 4 * this.canvas.ratio) * 0.9, // 预留20%的空白空间
      height: (this.canvas.height - xFontSize * this.canvas.ratio) * 0.8, // 预留20%的空白空间
      colors: style.colors,
      fontColor: style.color,
      fontSize: yFontSize,
      fontFamily: style.fontFamily || 'PingFang SC',
      position: new Point(
        width + 10,
        xFontSize * this.canvas.ratio * 0.9 + this.canvas.height * 0.1
      )
    }, data);
    this.barLayer.onMaked = (layer, option) => {
      const { max, xStep } = option;
      // 计算坐标系坐标数值
      const xAxisMax = max + (this.canvas.width - yFontSize * 4 * this.canvas.ratio) * 0.1 / xStep;
      // 设置坐标轴的最大最小值
      this.axisLayer.xAxisMin = 0;
      this.axisLayer.xAxisMax = xAxisMax;
      this.axisLayer.make();
    }
    this.canvas.addChild(this.axisLayer, this.barLayer);
    this.barLayer.make();
    this.canvas.paint();
  }

  render() {
    const { className = '' } = this.props;
    return (
      <div className={className} ref={this.ref} />
    );
  }
}
