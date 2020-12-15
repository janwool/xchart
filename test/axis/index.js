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
            yAxisMin: 0,
            xAxisLabels: ['2019-12-10', '', '2019-12-11', '', '2019-12-12'],
            yAxisRender: (data) => {
                return {
                    text: parseFloat(data).toFixed(2),
                    size: 20,
                }
            }
        });
        this.canvas.addChild(this.axisLayer);
        this.axisLayer.make();
        console.log(this.axisLayer);
        this.canvas.paint();

    }

    render() {
        return <div className="axias-chart" ref={this.myRef}/>
    }
}

ReactDOM.render(
    <AxisTest />,
    document.getElementById('root')
)
