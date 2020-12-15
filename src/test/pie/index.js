/*
* @Date: 2020/5/19
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Pie from '../../react/Pie';
import React from 'react';
import './index.scss';
import ReactDOM from "react-dom";


export default class PieTest extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Pie
        className="chart"
        style={{
          color: '#333333',
          lineWidth: 1,
          fontColor: '#666666',
          type: Pie.TYPE.ROSE
        }}
        data={[{
          key: 'a',
          value: 10.6,
          label: '优秀'
        }, {
          key: 'c',
          value: 20.1,
          label: '及格'
        }, {
          key: 'b',
          value: 30.3,
          label: '良好'
        }, {
          key: 'd',
          value: 39,
          label: '不及格'
        }]}

        colors={{
          a: '#37BE86',
          b: '#5467DA',
          c: '#E1A234',
          d: '#AC2626'
        }}
      />
    )
  }
}
ReactDOM.render(
  <PieTest />,
  document.getElementById('root')
)
