/*
* @Date: 2020/5/19
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import DashBoard from '../../react/DashBoard';
import React from 'react';
import './index.scss';
import ReactDOM from "react-dom";

export default class DashBoardTest extends React.Component {
  render() {
    return (
      <DashBoard
        value={0.2}
        className="chart"

        style={{
          pointColor: '#333333',
          // linearGradient: [
          //   [0, '#058F05'],
          //   [0.3, '#15AF05'],
          //   [0.5, '#DCD313'],
          //   [0.8, '#AE1315'],
          //   [1, '#9E0305']
          // ],
          type: DashBoard.TYPE.FILL,
          graduation: ['强烈买入','买入',  '持平', '卖出', '强烈卖出'],
          color:'#999999'
        }}

      />
      )
  }
}
ReactDOM.render(
  <DashBoardTest />,
  document.getElementById('root')
)
