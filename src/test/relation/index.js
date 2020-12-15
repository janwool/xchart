/*
* @Date: 2020/5/22
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Relation from '../../react/Relation';
import React from 'react';
import './index.scss';
import ReactDOM from "react-dom";


export default class RelationTest extends React.Component {
  render() {
    return (
      <Relation
        className="chart"
        data={{
          roles: {
            USD: { label: '美元', color: '#C8B988' },
            EUR: { label: '欧元', color: '#D8A3B1'},
            JPY: { label: '日元', color: '#90D8DD' },
            AUD: { label: '澳元', color: '#56B643' },
          },
          relation: [
            ['USD', 'EUR', 0.91],
            ['USD', 'JPY', 108.1],
            ['USD', 'AUD', 1.3],
            ['EUR', 'JPY', 109.2],
            ['EUR', 'AUD', 1.4],
          ]
        }}
        style={{
          color: '#333333',
          fontColor: '#333333',
          lineWidth: 1,
        }}
      />)
  }
}
ReactDOM.render(
  <RelationTest />,
  document.getElementById('root')
)
