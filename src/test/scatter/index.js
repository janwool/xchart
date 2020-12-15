/*
* @Date: 2020/5/19
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Radar from '../../react/Scatter';
import React from 'react';
import './index.scss';
import ReactDOM from "react-dom";

export default class ScatterTest extends React.Component {
  onMouseOver = (e) => {
    console.log(e);
  }

  render() {
    return (
      <Radar
        className="chart"
        data={[
          { key: 'man', weight: 60, height: 173 },
          { key: 'man', weight: 68, height: 179 },
          { key: 'man', weight: 63, height: 175 },
          { key: 'man', weight: 80, height: 183 },
          { key: 'man', weight: 70, height: 173 },
          { key: 'man', weight: 90, height: 183 },
          { key: 'man', weight: 75, height: 178 },
          { key: 'man', weight: 70, height: 174 },
          { key: 'man', weight: 64, height: 179 },
          { key: 'man', weight: 60, height: 178 },
          { key: 'man', weight: 59, height: 168 },
          { key: 'man', weight: 64, height: 177 },
          { key: 'women', weight: 51, height: 164 },
          { key: 'women', weight: 52, height: 159 },
          { key: 'women', weight: 45, height: 161 },
          { key: 'women', weight: 58, height: 154 },
          { key: 'women', weight: 48, height: 164 },
          { key: 'women', weight: 56, height: 171 },
          { key: 'women', weight: 60, height: 163 },
          { key: 'women', weight: 54, height: 166 },
          { key: 'women', weight: 53, height: 168 },
        ]}
        style={{
          color: '#C3C3C3',
          axisColor: '#666666',
          enob: 0,
          colors: {
            man: '#3575D8',
            women: '#E4D733'
          },
          xAxisAttr: 'height',
          yAxisAttr: 'weight',
          radius: 10,
        }}
        onMouseOver={this.onMouseOver}
      />)
  }
}
ReactDOM.render(
  <ScatterTest />,
  document.getElementById('root')
)
