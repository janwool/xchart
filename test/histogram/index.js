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

  onMoouseOut= (e) => {
    this.setState({
      isShow: false,
    });
  }

  render() {
    const { userData = {}, isShow = false, posX, posY } = this.state;
    const renderArr = userData.data || [];

    return (
      <div>
        {
          isShow && (
            <div className="data-box" style={{left: posX, top: posY}}>
              <div className="data-box-item">{userData.label}</div>
              {
                renderArr.map(({ color, value }) => (
                  <div className="data-box-item">
                    <div style={{background: color}} className="data-box-item-label"></div>{value}
                  </div>
                ))
              }
            </div>
          )
        }
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
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMoouseOut}
          style={{
            fontFamily: 'PingFang SC',
            fontSize: 20,
            fontColor:'#999999',
            xFontSize: 20,
            yFontSize: 20,
            yAxisGraduations: 5,
            color: '#777777',
          }}
        />
      </div>

    )
  }
}
ReactDOM.render(
  <HistogramTest />,
  document.getElementById('root')
)
