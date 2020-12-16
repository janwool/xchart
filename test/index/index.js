/*
* @Date: 2020/12/16
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/

import React from 'react';
import './index.scss';
import ReactDOM from "react-dom";

export class IndexTest extends React.Component {
  render() {
    return (
      <ul className="menu-list">
        <li className="menu-list-item"><a href="./base.html">基本图形</a></li>
        <li className="menu-list-item"><a href="./axis.html">坐标轴</a></li>
        <li className="menu-list-item"><a href="./line.html">折线图</a></li>
        <li className="menu-list-item"><a href="./histogram.html">柱形图</a></li>
        <li className="menu-list-item"><a href="./bar.html">条形图</a></li>
        <li className="menu-list-item"><a href="./pie.html">饼图</a></li>
        <li className="menu-list-item"><a href="./scatter.html">散点图</a></li>
        <li className="menu-list-item"><a href="./radar.html">雷达图</a></li>
        <li className="menu-list-item"><a href="./candlestick.html">蜡烛图</a></li>
        <li className="menu-list-item"><a href="./dash.html">仪表盘</a></li>
        <li className="menu-list-item"><a href="./relation.html">关系图</a></li>
        <li className="menu-list-item"><a href="./map.html">地图</a></li>
        <li className="menu-list-item"><a href="./3d.html">3D图</a></li>
      </ul>
    )
  }
}

ReactDOM.render(
  <IndexTest />,
  document.getElementById('root')
)
