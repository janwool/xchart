/*
* @Date: 2020/5/19
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Candlestick from '@/react/Candlestick';
import React from 'react';
import './index.scss';
import data from './data';
import ReactDOM from "react-dom";


export default class CandTest extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Candlestick
        className="chart"
        data={data}
        style={{
          color: '#C3C3C3',
          axisColor: '#999999',
          xFontSize: 20,
          yFontSize: 20,
          enob: 4,
          positiveType: Candlestick.BAR_TYPE.STROKE,
        }}
      />)
  }
}
ReactDOM.render(
  <CandTest />,
  document.getElementById('root')
)
