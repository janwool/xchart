import React from 'react';
import ReactDOM from 'react-dom';
import Canvas from '@/core/Canvas';
import AxisLayer from '@/layer/AxisLayer';
import './index.scss';

class AxisTest extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }
    componentDidMount() {
        this.canvas = new Canvas({
            ele: this.myRef.current,
            canAction: false
        });
        this.axisLayer = new AxisLayer(this.canvas, {
            yAxisMax: 100,
            yAxisMin: -100,
            xAxisLabels: ['2019-12-10', '', '2019-12-11', '', '2019-12-12'],
            yAxisPosition: AxisLayer.AxisPosition.BLOCK,
            xAxisGraduations: 7,
            yAxisRender: (data) => {
                return {
                    text: parseFloat(data).toFixed(2),
                    size: 20,
                }
            }
        });
        this.canvas.addChild(this.axisLayer);
        this.axisLayer.make();
        this.canvas.paint();

    }

    /**
     * X轴坐标个数变化
     * @param e
     */
    onXAxisGraduationChange = (e) => {
        const xAixsGraduations = Number(e.currentTarget.value);
        if (this.axisLayer && !isNaN(xAixsGraduations)) {
            this.axisLayer.xAxisGraduations = xAixsGraduations;
            this.axisLayer.make();
            this.canvas.paint();
        }
    }

    /**
     * Y轴坐标个数变化
     * @param e
     */
    onYAxisGraduationChange = (e) => {
        const yAxisGraduation = Number(e.currentTarget.value);
        if (this.axisLayer && !isNaN(yAxisGraduation)) {
            this.axisLayer.yAxisGraduations = yAxisGraduation;
            this.axisLayer.make();
            this.canvas.paint();
        }
    }


    /**
     * X轴坐标位置变化
     * @param e
     */
    onXAxisPositionChange = (e) => {
        const xPosition = Number(e.currentTarget.value);
        if (this.axisLayer && !isNaN(xPosition)) {
            this.axisLayer.xAxisPosition = xPosition;
            this.axisLayer.make();
            this.canvas.paint();
        }
    }

    /**
     * Y轴坐标位置变化
     * @param e
     */
    onYAxisPositionChange = (e) => {
        const yPosition = Number(e.currentTarget.value);
        if (this.axisLayer && !isNaN(yPosition)) {
            this.axisLayer.yAxisPosition = yPosition;
            this.axisLayer.make();
            this.canvas.paint();
        }
    }


    render() {
        return (
          <React.Fragment>
              <div className="chart-info-box">
                  <div className="chart-attribute">
                      <div className="form-box">
                          <div className="form-control-box">
                              <label>X轴坐标数(xAxisGraduations)</label>
                              <div className="form-control-input">
                                  <input type="number" onChange={this.onXAxisGraduationChange} />
                              </div>
                          </div>
                          <div className="form-control-box">
                              <label>Y轴坐标数(yAxisGraduations)</label>
                              <div className="form-control-input">
                                  <input type="number" onChange={this.onYAxisGraduationChange} />
                              </div>
                          </div>
                          <div className="form-control-box">
                              <label>X坐标位置（xAxisPosition）</label>
                              <div className="form-control-input">
                                  <select onChange={this.onXAxisPositionChange}>
                                      <option value={AxisLayer.AxisPosition.BLOCK}>外置(BLOCK)</option>
                                      <option value={AxisLayer.AxisPosition.INNER}>内置(INNER)</option>
                                  </select>
                              </div>
                          </div>
                          <div className="form-control-box">
                              <label>Y坐标位置(yAxisPosition)</label>
                              <div className="form-control-input">
                                  <select onChange={this.onYAxisPositionChange}>
                                      <option value={AxisLayer.AxisPosition.BLOCK}>外置(BLOCK)</option>
                                      <option value={AxisLayer.AxisPosition.INNER}>内置(BLOCK)</option>
                                  </select>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="base-chart" ref={this.myRef}/>
              </div>
          </React.Fragment>
        );
    }
}

ReactDOM.render(
    <AxisTest />,
    document.getElementById('root')
)
