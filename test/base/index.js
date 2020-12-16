import React from 'react';
import ReactDOM from 'react-dom';
import Canvas from '@/core/Canvas';
import Line from '@/base/Line';
import Point from '@/core/Point';
import Rectangle from '@/base/Rectangle';
import Circle from '@/base/Circle';
import Sector from '@/base/Sector';
import RotateAction from '@/action/RotateAction';
import Event from '@/event/Event';
import Ring from '@/base/Ring';
import Input from '@/base/Input';
import Curve from '@/base/Curve';
import './index.scss';
import Polygon from "@/base/Polygon";

class AxisTest extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  componentDidMount() {
    this.canvas = new Canvas({
      ele: this.myRef.current,
      canAction: false,
      ratio: 3,
    });
    let line = new Line(this.canvas, {
      color: '#89DE45',
      lineDash: [12, 8],
      linearGradient: [
        [0, '#DEDEDE'],
        [0.3, '#999999'],
        [0.5, '#777777'],
        [0.7, '#444444'],
        [1, '#000000'],
      ],
      lineWidth: 15,
      from: new Point(0, 0),
      to: new Point(this.canvas.width, this.canvas.height / 2),
    });
    let rectangle = new Rectangle(this.canvas, {
      position: new Point(this.canvas.width / 2, 400),
      width: 500,
      height: 100,
      type: Rectangle.TYPE.FILL,
      linearGradient: [
        [0, '#DEDEDE'],
        [0.3, '#999999'],
        [0.5, '#777777'],
        [0.7, '#444444'],
        [1, '#000000'],
      ],
    });
    let rectBorder = new Rectangle(this.canvas, {
      position: new Point(this.canvas.width / 2, 400),
      width: 500,
      height: 100,
      type: Rectangle.TYPE.STROKE,
      color: '#2584BE',
      lineDash: [20, 12],
      lineWidth: 12,
    });
    // setInterval(() => {
    //   if (rectangle.rotation >= 360) {
    //     rectangle.rotation = 0;
    //   }
    //   rectangle.rotation += 10;
    //   this.canvas.paint();
    // }, 100 / 6)
    let circle = new Circle(this.canvas, {
      radius: 100,
      position: new Point(this.canvas.width / 2, 100),
      type: Circle.TYPE.FILL,
      linearGradient: [
        [0, '#DEDEDE'],
        [0.3, '#999999'],
        [0.5, '#777777'],
        [0.7, '#444444'],
        [1, '#000000'],
      ],
    });
    let circleBorder = new Circle(this.canvas, {
      radius: 100,
      position: new Point(this.canvas.width / 2, 100),
      type: Circle.TYPE.STROKE,
      color: '#2584BE',
      lineDash: [20, 12],
      lineWidth: 12,
    });
    let sector = new Sector(this.canvas, {
      radius: 100,
      position: new Point(this.canvas.width / 2, 100),
      type: Sector.TYPE.FILL,
      linearGradient: [
        [0, '#DEDEDE'],
        [0.3, '#999999'],
        [0.5, '#777777'],
        [0.7, '#444444'],
        [1, '#000000'],
      ],
      start: 0,
      stop: Math.PI / 3
    });
    let sectorBorder = new Sector(this.canvas, {
      radius: 100,
      position: new Point(this.canvas.width / 2, 100),
      type: Sector.TYPE.STROKE,
      lineWidth: 10,
      start: 0,
      stop: Math.PI / 3
    });
    sector.rotation = 90;

    let secondHand = new Line(this.canvas, {
      lineWidth: 10,
      position: new Point(this.canvas.width / 2, this.canvas.height / 2),
      to: new Point(this.canvas.width / 2, this.canvas.height / 2 + 100),
    });
    let miniHand = new Line(this.canvas, {
      lineWidth: 10,
      position: new Point(this.canvas.width / 2, this.canvas.height / 2),
      to: new Point(this.canvas.width / 2, this.canvas.height / 2 + 60),
    });
    let secondHandAction = new RotateAction(-1, 1, 6);
    let miniHandAction = new RotateAction(-1, 1 / 60, 6);

    // this.canvas.addChild(secondHand, miniHand);
    // secondHand.runAction(secondHandAction);
    // miniHand.runAction(miniHandAction);
    let ring = new Ring(this.canvas, {
      type: Ring.TYPE.FILL,
      color: '#D54563',
      startAngle: 80,
      endAngle: 20,
      longRadius: 200,
      shortRadius: 150,
      lineWidth: 2,
      lineDash: [10, 5],
      position: new Point(this.canvas.width / 2, this.canvas.height / 2)
    });
    this.canvas.addChild(ring);
    ring.addEventListener(Event.EVENT_CLICK, (e) => {
    })
    let input = new Input(this.canvas, {
      width: 300,
      fontSize: 40,
      position: new Point(this.canvas.width / 2, this.canvas.height / 2),
    });
    this.canvas.addChild(input);
    const points = [
      { x: 50, y: 25},
      { x: 20, y: 62.5},
      { x: 75, y: 120},
      { x: 130, y: 62.5},
      { x: 100, y: 25},
      { x: 75, y: 40}
    ];
    let curve = new Curve(this.canvas, {
      position: new Point(75, 40),
      points,
    });
    let polygon = new Polygon(this.canvas, {
      points: [
        {x: 75, y: 40},
        { x: 50, y: 25},
        { x: 20, y: 62.5},
        { x: 75, y: 120},
        { x: 130, y: 62.5},
        { x: 100, y: 25},
        { x: 75, y: 40}
        ]
    });
    this.canvas.addChild(polygon);
    this.canvas.addChild(curve);
    for (let i = 0; i < points.length; i++) {
      let p = new Point(points[i].x, points[i].y);
      let c = new Circle(this.canvas, {
        position: p,
        type: Circle.TYPE.FILL,
        radius: 3,
        color: '#333333'
      });
      this.canvas.addChild(c);
    }
    this.canvas.paint();
  }

  render() {
    return (
      <React.Fragment>
        <div className="menu-dash">
          <div className="menu-dash-item">弧线</div>
          <div className="menu-dash-item">圆形</div>
          <div className="menu-dash-item">扇形</div>
          <div className="menu-dash-item">环形</div>
          <div className="menu-dash-item">直线</div>
          <div className="menu-dash-item">折线</div>
          <div className="menu-dash-item">曲线</div>
          <div className="menu-dash-item">长方形</div>
          <div className="menu-dash-item">多边形</div>
          <div className="menu-dash-item">文本</div>
          <div className="menu-dash-item">输入框</div>
        </div>
        <div className="axias-chart" ref={this.myRef}/>
      </React.Fragment>
    )
  }
}

ReactDOM.render(
  <AxisTest />,
  document.getElementById('root')
)
