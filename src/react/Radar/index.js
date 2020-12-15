/*
* @Date: 2020/5/20
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import React from 'react';
import Canvas from '../../core/Canvas';
import RadarLayer from './bu/RadarLayer';

export default class extends React.Component {
  static SHAPE = {
    BLOCK: RadarLayer.SHAPE.BLOCK,
    CIRCLE: RadarLayer.SHAPE.CIRCLE,
  };
  static TYPE = {
    STROKE: RadarLayer.TYPE.STROKE,
    FILL: RadarLayer.TYPE.FILL,
  }
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const { data = [] } = nextProps;
    if (this.props.data !== data) {
      this.radar.data = data;
      this.radar.make();
      this.canvas.paint();
    }
  }

  componentDidMount () {
    const { style = {}, data = [] } = this.props;
    this.canvas = new Canvas({
      ele: this.ref.current,
      canAction: false,
    });
    this.radar = new RadarLayer(this.canvas, {
      shape: style.shape || RadarLayer.SHAPE.BLOCK,
      type: style.type || RadarLayer.TYPE.FILL,
      colors: style.colors,
      color: style.color,
      lineWidth: style.lineWidth,
      graduationNum: style.graduationNum,
      enob: style.enob,
      fontColor: style.fontColor,
    }, data);
    this.canvas.addChild(this.radar);
    this.radar.make();
    this.canvas.paint();
  }

  render() {
    const { className = '', } = this.props;
    return (
      <div className={className} ref={this.ref} />
    );
  }
}
