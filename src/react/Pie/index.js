/*
* @Date: 2020/5/22
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import React from 'react';
import Canvas from '../../core/Canvas';
import PieLayer from './bu/PieLayer';

export default class extends React.Component {
  static TYPE = {
    NORMAL: PieLayer.TYPE.NORMAL,  // 标准
    ROSE: PieLayer.TYPE.ROSE,    // 玫瑰图
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const { data } = nextProps;
    if (data !== this.props.data) {
      this.pie.data = data;
      this.pie.make();
      this.canvas.paint();
    }
  }

  componentDidMount () {
    const { style = {}, colors = {}, data = [] } = this.props;
    this.canvas = new Canvas({
      ele: this.ref.current,
      canAction: false
    });
    this.pie = new PieLayer(this.canvas, {
      ...style,
      colors,
    }, data);
    this.canvas.addChild(this.pie);
    this.pie.make();
    this.canvas.paint();
  }

  render() {
    const { className = '' } = this.props;
    return (
      <div className={className} ref={this.ref} />
    )
  }
}
