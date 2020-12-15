/*
* @Date: 2020/5/19
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Histogram from '@/react/Histogram';
import React from 'react';
import './index.scss';
import ReactDOM from "react-dom";

export default class HistogramTest extends React.Component {
  render() {
    return (
      <Histogram
        data={[{
          label: '2017',
          data: [
            { color: '#D78521', value: 90 },
            { color: '#90B3BB', value: -45 }
            ]
        }, {
          label: '2018',
          data: [
            { color: '#D78521', value: 70 },
            { color: '#90B3BB', value: -25 }
          ]
        }, {
          label: '2019',
          data: [
            { color: '#D78521', value: 100 },
            { color: '#90B3BB', value: 40 }
          ]
        }, {
          label: '2020',
          data: [
            { color: '#D78521', value: -90 },
            { color: '#90B3BB', value: 30 }
          ]
        }]}
        className="chart"
        style={{
          fontFamily: 'PingFang SC',
          fontSize: 20,
          fontColor:'#999999',
          xFontSize: 20,
          yFontSize: 20,
        }}
      />
    )
  }
}
ReactDOM.render(
  <HistogramTest />,
  document.getElementById('root')
)
