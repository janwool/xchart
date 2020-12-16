/*
* @Date: 2020/5/19
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Radar from '@/react/Radar';
import React from 'react';
import './index.scss';
import ReactDOM from "react-dom";

export default class RadarTest extends React.Component {
  render() {
    return (
      <Radar
        className="chart"
        data={[

          { label: 'Marketing', a: 50, b: 60 },
          { label: 'Users', a: 40, b: 50 },
          { label: 'Test', a: 60, b: 70 },
          { label: 'Language', a: 70, b: 50 },
          { label: 'Technology', a: 50, b: 40 },
          { label: 'Support', a: 30, b: 40 },
          { label: 'Sales', a: 60, b: 40 },
          { label: 'UX', a: 50, b: 60 },
        ]}
        style={{
          color: '#C3C3C3',
          fontColor: '#666666',
          enob: 0,
          type: Radar.TYPE.STROKE,
          colors: {
            a: '#3575D8',
            b: '#E4D733'
          },
          lineWidth: 1,
        }}
      />)
  }
}
ReactDOM.render(
  <RadarTest />,
  document.getElementById('root')
)
