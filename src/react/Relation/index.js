/*
* @Date: 2020/5/22
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import React from 'react';
import Canvas from '../../core/Canvas';
import RelationLayer from './bu/RelationLayer';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const { data } = nextProps;
    if (data !== this.props.data) {
      this.relationLayer.data = data;
      this.relationLayer.make();
      this.canvas.paint();
    }
  }

  componentDidMount () {
    const { style = {}, data } = this.props;
    this.canvas = new Canvas({
      ele: this.ref.current,
      canAction: false,
    });
    this.relationLayer = new RelationLayer(this.canvas, style, data);
    this.canvas.addChild(this.relationLayer);
    this.relationLayer.make();
    this.canvas.paint();
  }

  render() {
    const { className = '' } = this.props;
    return (
      <div className={className} ref={this.ref} />
    );
  }
}
