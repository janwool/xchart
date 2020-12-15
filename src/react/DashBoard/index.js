/*
* @Date: 2020/5/27
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import React from 'react';
import Canvas from '../../core/Canvas';
import DashBoard from './bu/DashBoard';

export default class extends React.Component {
  static TYPE = {
    STROKE: DashBoard.TYPE.STROKE,
    FILL: DashBoard.TYPE.FILL
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount () {
    const { style = {}, value =  0 } = this.props;
    this.canvas = new Canvas({
      ele: this.ref.current,
      canAction: false,
    });
    this.dash = new DashBoard(this.canvas, style, value);
    this.canvas.addChild(this.dash);
    this.dash.make();
    this.canvas.paint();
  }

  render() {
    const { className = '' } = this.props;
    return (
      <div className={className} ref={this.ref} />
    )
  }
}
