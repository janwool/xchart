/*
* @Date: 2020/5/19
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Bar from '@/react/Bar';
import React from 'react';
import './index.scss';
import ReactDOM from "react-dom";

export default class BarTest extends React.Component {
  onMouseOver = (e) => {
    console.log(e);
  }

  render() {
    return (
      <Bar
        className="chart"
        data={[{
          label: '第一季度',
          data: [{
            key: 'a',
            value: 80
          }, {
            key: 'b',
            value: 100,
          }, {
            key: 'c',
            value: 120
          }]
        }, {
          label: '第二季度',
          data: [{
            key: 'a',
            value: 100,
          }, {
            key: 'b',
            value: 80,
          }, {
            key: 'c',
            value: 100
          }]
        }, {
          label: '第三季度',
          data: [{
            key: 'a',
            value: 120,
          }, {
            key: 'b',
            value: 30,
          }, {
            key: 'c',
            value: 90
          }]
        }, {
          label: '第四季度',
          data: [{
            key: 'a',
            value: 40,
          }, {
            key: 'b',
            value: 60,
          }, {
            key: 'c',
            value: 100
          }]
        }]}
        style={{
          color: '#666666',
          axisColor: '#666666',
          fontColor: '#666666',
          colors: {
            a: '#4169E1',
            b: '#43CD80',
            c: '#FFC0CB',
          },
          xAxisAttr: 'height',
          yAxisAttr: 'weight',
        }}
      />)
  }
}
ReactDOM.render(
  <BarTest />,
  document.getElementById('root')
)
