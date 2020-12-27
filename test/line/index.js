/*
* @Date: 2020/5/19
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Line from '@/react/Line';
import React from 'react';
import './index.scss';
import ReactDOM from "react-dom";
import kdata from './data';
const data = [{
  item: '2017',
  a: 1001,
  b: 897
}, {
  item: '2018',
  a: 1289,
  b: 990
}, {
  item: '2019',
  a: 1290,
  b: 1039
}, {
  item: '2020',
  a: 1180,
  b: 1100
}];

export default class LineTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posX: 0,
      posY: 0,
      isShow: false,
      userData: {},
    }
  }

  onMouseOver = (e) => {
    const { dataX, dataY, data = {} } = e;
    if (data) {
      this.setState({
        posX: dataX,
        posY: dataY,
        isShow: true,
        userData: data,
      });
    } else {
      this.setState({
        isShow: false,
      });
    }
  }


  render() {
    const { userData = {}, isShow = false, posX, posY } = this.state;
    const renderArr = [];
    for (let key in userData) {
      if (key === 'item') {
        renderArr.push({
          label: '日期',
          value: userData[key],
        });
      } else {
        renderArr.push({
          label: key,
          value: userData[key],
        });
      }
    }
    return (
      <div>
        {
          isShow && (
            <div className="data-box" style={{left: posX, top: posY}}>
              {
                renderArr.map(({ label, value }) => <div className="data-box-item">{label}:{value}</div>)
              }
            </div>
          )
        }
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
              a: '#3575D8',
              b: '#F46586',
            }
          }}
          onMouseOver={this.onMouseOver}
        />
      </div>
      )
  }
}
ReactDOM.render(
  <LineTest />,
  document.getElementById('root')
)
