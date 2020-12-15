/*
* @Date: 2020/5/20
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import React from 'react';
import MapLayer from './bu/MapLayer';
import Canvas from '../../core/Canvas';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount () {
    const { style = {} } = this.props;
    this.canvas = new Canvas({
      ele: this.ref.current,
      canAction: false,
    });
    this.map = new MapLayer(this.canvas, {
      color: style.color,
      onClick: this.props.onClick
    });
    this.map.make();
    this.canvas.addChild(this.map);
    this.canvas.paint();
  }

  render() {
    const { className = '' } = this.props;
    return (
      <div ref={this.ref} className={className} />
    )
  }
}
