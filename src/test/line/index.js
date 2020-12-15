/*
* @Date: 2020/5/19
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Line from '../../react/Line';
import React from 'react';
import './index.scss';
import ReactDOM from "react-dom";
import kdata from './data';
const data = [];
for(let i = 0; i < kdata.length; i++) {
  data.push({
    item: kdata[i].tiem,
    close: kdata[i].close
  });
}

export default class LineTest extends React.Component {
  render() {
    return (
      <Line
        className="chart"
        data={data}
        style={{
          color: '#C3C3C3',
          fontColor: '#666666',
          enob: 4,
          type: 2,
          lineCap: Line.LINE_CAP.ROUND,
          colors: {
            close: '#3575D8',

          }
        }}
        onMouseOver={this.onMouseOver}
      />)
  }
}
ReactDOM.render(
  <LineTest />,
  document.getElementById('root')
)
