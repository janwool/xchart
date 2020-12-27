/*
* @Date: 2020/5/22
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/

import React from 'react';
import Canvas from '../../core/Canvas';
import Histogram from './bu/Histogram';
import Event from '../../event/Event';
import Point from "@/core/Point";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentWillReceiveProps (nextProps, nextContext) {
    const { data = [], style = {} } = nextProps;
    if (data !== this.props.data) {
      this.histogram.data = data;
      this.histogram.make();
      this.canvas.paint();
    }
    if (style !== this.props.style) {
      for (let key in style) {
        this.histogram[key] = style[key];
      }
      this.histogram.make();
      this.canvas.paint();
    }
  }

  componentDidMount () {
    const { style = {}, data =  [] } = this.props;
    this.canvas = new Canvas({
      ele: this.ref.current,
      canAction: false,
    });
    this.histogram = new Histogram(this.canvas, style, data);
    this.canvas.addChild(this.histogram);
    this.histogram.make();
    this.canvas.paint();
    this.histogram.addEventListener(Event.EVENT_MOUSE_IN, (e) => {
      if (this.props.onMouseOver) {
        const { curPoint } = e;
        const dataIndex = Math.floor((curPoint.x - e.node.yFontWidth) / e.node.xStep);
        if (
          dataIndex < e.node.data.length
        ) {
          const data = e.node.data[dataIndex];
          const { clientX, clientY } = this.canvas.getClientPosition(curPoint);
          const dataPosition = this.canvas.getClientPosition(
            new Point(
              e.node.yFontWidth + (dataIndex + 0.5) * e.node.xStep,
              curPoint.y
            )
          );
          this.props.onMouseOver({
            clientX,
            clientY,
            data,
            dataX: dataPosition.clientX,
            dataY: dataPosition.clientY,
            eventX: curPoint.x,
            eventY: curPoint.y,
            node: e.node,
            canvas: this.canvas,
          });
        } else {
          const { clientX, clientY } = this.canvas.getClientPosition(curPoint);
          this.props.onMouseOver({
            clientX,
            clientY,
            data: null,
            eventX: curPoint.x,
            eventY: curPoint.y,
            node: e.node,
            canvas: this.canvas,
          });
        }
      }
    });
    this.histogram.addEventListener(Event.EVENT_MOUSE_OUT, (e) => {
      const { clientPoint } = e;
      this.props.onMouseOut && this.props.onMouseOut({
        clientX: clientPoint.x,
        clientY: clientPoint.y,
        node: e.node,
        canvas: this.canvas,
      });
    });
  }

  render() {
    const { className = '' } = this.props;
    return (
      <div className={className} ref={this.ref} />
    )
  }
}
