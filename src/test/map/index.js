/*
* @Date: 2020/5/19
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Map from '../../react/Map';
import React from 'react';
import './index.scss';
import ReactDOM from "react-dom";


export default class MapTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickX: 0,
      clickY: 0,
      province: ''
    }
  }

  onMapClick = (e) => {
    this.setState({
      clientX: e.clientPoint.x,
      clientY: e.clientPoint.y,
      province: e.node.ext.name
    })
  }

  render() {
    const { clientX, clientY, province } = this.state;
    return (
      <React.Fragment>
        <div style={{top: clientY, left: clientX}} className="tip">
          { province }
        </div>
        <Map
          className="chart"
          onClick={this.onMapClick}
        />
      </React.Fragment>
      )
  }
}
ReactDOM.render(
  <MapTest />,
  document.getElementById('root')
)
