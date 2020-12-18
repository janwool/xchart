import React from 'react';
import ReactDOM from 'react-dom';
import Canvas from '@/core/Canvas';
import Arc from '@/base/Arc';
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
import MultiLine from "@/base/MultiLine";

class AxisTest extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      type: 'arc',
    };
  }
  componentDidMount() {
    this.canvas = new Canvas({
      ele: this.myRef.current,
      canAction: false,
      ratio: 3,
    });
  }

  onNodeTypeChange = (e) => {
    const { type } = e.currentTarget.dataset;
    this.setState({
      type,
    }, () => {
      this.canvas.childs.splice(0, this.canvas.childs.length);
      this.node = null;
      switch (type) {
        case 'arc':
          this.node = new Arc(this.canvas, {
            position: new Point(this.canvas.width / 2, this.canvas.height / 2),
          });
          break;
        case 'circle':
          this.node = new Circle(this.canvas, {
            position: new Point(this.canvas.width / 2, this.canvas.height / 2),
          });
          break;
        case 'sector':
          this.node = new Sector(this.canvas, {
            position: new Point(this.canvas.width / 2, this.canvas.height / 2),
          });
          break;
        case 'ring':
          this.node = new Ring(this.canvas, {
            position: new Point(this.canvas.width / 2, this.canvas.height / 2),
          });
          break;
        case 'line':
          this.node = new Line(this.canvas, {
            position: new Point(this.canvas.width / 2, this.canvas.height / 2),
          });
          break;
        case 'multi':
          this.node = new MultiLine(this.canvas, {}, [
            new Point(0, 0),
            new Point(this.canvas.width / 4, this.canvas.height / 2),
            new Point(this.canvas.width / 4 * 3, this.canvas.height / 2),
            new Point(this.canvas.width, this.canvas.height)
          ]);
          break;
        case 'curve':
          this.node = new Curve(this.canvas, {}, [
            new Point(0, 0),
            new Point(this.canvas.width / 4, this.canvas.height / 2),
            new Point(this.canvas.width / 4 * 3, this.canvas.height / 2),
            new Point(this.canvas.width, this.canvas.height)
          ]);
          break;
        case 'rectangle':
          this.node = new Rectangle(this.canvas, {
            position: new Point(this.canvas.width / 2, this.canvas.height / 2),
          });
          break;
        case 'polygon':
          break;
        case 'text':
          break;
      }
      this.canvas.addChild(this.node);
      this.canvas.paint();
    });
  }

  /**
   * 弧线线框修改
   * @param e
   */
  onLineWidthChange = (e) => {
    let lineWidth = Number(e.currentTarget.value);
    lineWidth = isNaN(lineWidth) ? 1 : lineWidth;
    if (this.node) {
      this.node.lineWidth = lineWidth;
      this.canvas.paint();
    }
  }

  /**
   * 弧线末端样式修改
   * @param e
   */
  onLineCapChange = (e) => {
    let lineCap = Number(e.currentTarget.value);
    if (this.node) {
      this.node.lineCap = lineCap;
      this.canvas.paint();
    }
  }

  /**
   * 曲线间距修改
   * @param e
   */
  onLineDashChange = (e) => {
    let lineDash = e.currentTarget.value;
    lineDash = lineDash.replace(/，/g, ',');
    lineDash = lineDash.split(',');
    if (this.node) {
      this.node.lineDash = lineDash;
      this.canvas.paint();
    }
  }

  /**
   * 类型修改
   * @param e
   */
  onTypeChange = (e) => {
    let type = Number(e.currentTarget.value);
    if (this.node) {
      this.node.type = type;
      this.canvas.paint();
    }
  }

  /**
   * 弧线起始角度修改
   * @param e
   */
  onArcStartAngleChange = (e) => {
    let angle = Number(e.currentTarget.value);
    angle = isNaN(angle) ? 10 : angle;
    if (this.node) {
      this.node.startAngle = angle;
      this.canvas.paint();
    }
  }

  /**
   * 弧线终止角度修改
   * @param e
   */
  onArcEndAngleChange = (e) => {
    let angle = Number(e.currentTarget.value);
    angle = isNaN(angle) ? 360 : angle;
    if (this.node) {
      this.node.endAngle = angle;
      this.canvas.paint();
    }
  }

  /**
   * 虚线起始偏移量修改
   * @param e
   */
  onLineDashOffsetChange = (e) => {
    let lineDashOffset = Number(e.currentTarget.value);
    lineDashOffset = isNaN(lineDashOffset) ? 0 : lineDashOffset;
    if (this.node) {
      this.node.lineDashOffset = lineDashOffset;
      this.canvas.paint();
    }
  }

  /**
   * 弧度半径修改
   * @param e
   */
  onArcRadiusChange = (e) => {
    let radius = Number(e.currentTarget.value);
    radius = isNaN(radius) ? 10 : radius;
    if (this.node) {
      this.node.radius = radius;
      this.canvas.paint();
    }
  }

  /**
   * 颜色修改
   * @param e
   */
  onColorChange = (e) => {
    let color = e.currentTarget.value;
    if (this.node) {
      this.node.color = color;
      this.canvas.paint();
    }
  }

  /**
   *  扇形起始角度修改
   */
  onSectorStartAngleChange = (e) => {
    let startAngle = Number(e.currentTarget.value);
    startAngle = isNaN(startAngle) ? 0 : startAngle;
    if (this.node) {
      this.node.start = startAngle;
      this.canvas.paint();
    }
  }

  /**
   *  扇形终止时间修改
   * */
  onSectorEndAngleChange = (e) => {
    let endAngle = Number(e.currentTarget.value);
    endAngle = isNaN(endAngle) ? 360 : endAngle;
    if (this.node) {
      this.node.stop = endAngle;
      console.log(this.node);
      this.canvas.paint();
    }
  }

  /**
   * 环外径长度修改
   */
  onRingLongRadiusChange = (e) => {
    let longRadius = Number(e.currentTarget.value);
    longRadius = isNaN(longRadius) ? 10 : longRadius;
    if (this.node) {
      this.node.longRadius = longRadius;
      this.canvas.paint();
    }
  }

  /**
   * 环内径长度修改
   * */
  onRingShortRadiusChange = (e) => {
    let shortRadius = Number(e.currentTarget.value);
    shortRadius = isNaN(shortRadius) ? 5 : shortRadius;
    if (this.node) {
      this.node.shortRadius = shortRadius;
      this.canvas.paint();
    }
  }

  /**
   * 线条起始位置改变
   */
  onLineFromChange = (e) => {
    let from = e.currentTarget.value.replace(/，/g, ',').split(',');
    if (from.length === 2) {
      this.node.position = new Point(from[0], from[1]);
      this.canvas.paint();
    }
  }

  /**
   * 线条结束位置改变
   */
  onLineToChange = (e) => {
    let to = e.currentTarget.value.replace(/，/g, ',').split(',');
    if (to.length === 2) {
      this.node.to = new Point(to[0], to[1]);
      this.canvas.paint();
    }
  }

  /**
   * X方向阴影偏移
   * */
  onShadowOffsetXChange = (e) => {
    let shadowOffsetX = Number(e.currentTarget.value);
    if (!isNaN(shadowOffsetX) && this.node) {
      this.node.shadowOffsetX = shadowOffsetX;
      this.canvas.paint();
    }
  }

  /**
   * Y方向阴影偏移
   */
  onShadowOffsetYChange = (e) => {
    let shadowOffsetY = Number(e.currentTarget.value);
    if (!isNaN(shadowOffsetY) && this.node) {
      this.node.shadowOffsetY = shadowOffsetY;
      this.canvas.paint();
    }
  }

  /**
   * 阴影模糊长度
   */
  onShadowBlurChange = (e) => {
    let shadowBlur = Number(e.currentTarget.value);
    if (!isNaN(shadowBlur) && this.node) {
      this.node.shadowBlur = shadowBlur;
      this.canvas.paint();
    }
  }

  /**
   * 阴影颜色修改
   */
  onShadowColorChange = (e) => {
    let shadowColor = e.currentTarget.value;
    if (this.node) {
      this.node.shadowColor = shadowColor;
      this.canvas.paint();
    }
  }

  /**
   * 位置修改
   **/
  onPositionChange = (e) => {
    let position = e.currentTarget.value.replace(/，/g, ',').replace(',');
    if (position.length === 2 && this.node) {
      this.node.setPosition(position[0], position[1]);
      this.canvas.paint();
    }
  }

  /**
   * 宽度修改
   */
  onRectangleWidthChange = (e) => {
    let width = Number(e.currentTarget.value);
    width = isNaN(width) ? 200 : width;
    if (this.node) {
      this.node.width = width;
      this.canvas.paint();
    }
  }

  /**
   * 高度修改
   **/
  onRectangleHeightChange = (e) => {
    let height = Number(e.currentTarget.value);
    height = isNaN(height) ? 400 : height;
    if (this.node) {
      this.node.height = height;
      this.canvas.paint();
    }
  }


  render() {
    const { type } = this.state;
    return (
      <React.Fragment>
        <div className="menu-dash">
          <div className={`menu-dash-item ${type === 'arc' && 'active'}`} data-type="arc" onClick={this.onNodeTypeChange}>弧线</div>
          <div className={`menu-dash-item ${type === 'circle' && 'active'}`} data-type="circle" onClick={this.onNodeTypeChange}>圆形</div>
          <div className={`menu-dash-item ${type === 'sector' && 'active'}`} data-type="sector" onClick={this.onNodeTypeChange}>扇形</div>
          <div className={`menu-dash-item ${type === 'ring' && 'active'}`} data-type="ring" onClick={this.onNodeTypeChange}>环形</div>
          <div className={`menu-dash-item ${type === 'line' && 'active'}`} data-type="line" onClick={this.onNodeTypeChange}>直线</div>
          <div className={`menu-dash-item ${type === 'multi' && 'active'}`} data-type="multi" onClick={this.onNodeTypeChange}>折线</div>
          <div className={`menu-dash-item ${type === 'curve' && 'active'}`} data-type="curve" onClick={this.onNodeTypeChange}>曲线</div>
          <div className={`menu-dash-item ${type === 'rectangle' && 'active'}`} data-type="rectangle" onClick={this.onNodeTypeChange}>长方形</div>
          <div className={`menu-dash-item ${type === 'polygon' && 'active'}`} data-type="polygon" onClick={this.onNodeTypeChange}>多边形</div>
          <div className={`menu-dash-item ${type === 'text' && 'active'}`} data-type="text" onClick={this.onNodeTypeChange}>文本</div>
        </div>
        <div className="chart-info-box">
          <div className="chart-attribute">
            {/** Arc, Circle, Sector 属性开始 **/}
            {
              (type === 'arc' || type === 'circle' || type === 'sector' || type === 'ring') && (
                <React.Fragment>
                  <div className="form-box">
                    <div className="form-control-box">
                      <label>线框(lineWidth)</label>
                      <div className="form-control-input">
                        <input type="number" onChange={this.onLineWidthChange} />
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>末端样式(lineCap)</label>
                      <div className="form-control-input">
                        <select onClick={this.onLineCapChange}>
                          <option value={Arc.LINE_CAP.BUTT}>butt</option>
                          <option value={Arc.LINE_CAP.ROUND}>round</option>
                          <option value={Arc.LINE_CAP.SQUARE}>square</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>虚线样式(lineDash)</label>
                      <div className="form-control-input">
                        <input type="text" onChange={this.onLineDashChange} placeholder="交替绘制线段和间距,用,分开" />
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>虚线起始偏移量(lineDashOffset)</label>
                      <div className="form-control-input">
                        <input type="number" onChange={this.onLineDashOffsetChange}/>
                      </div>
                    </div>
                    {
                      type === 'arc' && (
                        <React.Fragment>
                          <div className="form-control-box">
                            <label>类型</label>
                            <div className="form-control-input">
                              <select onChange={this.onTypeChange}>
                                <option value={Arc.TYPE.STROKE}>STROKE</option>
                                <option value={Arc.TYPE.FILL}>FILL</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-control-box">
                            <label>起始角度</label>
                            <div className="form-control-input">
                              <input type="number" onChange={this.onArcStartAngleChange} />
                            </div>
                          </div>
                          <div className="form-control-box">
                            <label>终止角度</label>
                            <div className="form-control-input">
                              <input type="number" onChange={this.onArcEndAngleChange} />
                            </div>
                          </div>
                        </React.Fragment>
                      )
                    }
                    {
                      type === 'circle' && (
                        <div className="form-control-box">
                          <label>类型</label>
                          <div className="form-control-input">
                            <select onChange={this.onTypeChange}>
                              <option value={Circle.TYPE.STROKE}>STROKE</option>
                              <option value={Circle.TYPE.FILL}>FILL</option>
                            </select>
                          </div>
                        </div>
                      )
                    }
                    {
                      type === 'sector' && (
                        <React.Fragment>
                          <div className="form-control-box">
                            <label>类型</label>
                            <div className="form-control-input">
                              <select onChange={this.onTypeChange}>
                                <option value={Sector.TYPE.STROKE}>STROKE</option>
                                <option value={Sector.TYPE.FILL}>FILL</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-control-box">
                            <label>起始角度</label>
                            <div className="form-control-input">
                              <input type="number" onChange={this.onSectorStartAngleChange} />
                            </div>
                          </div>
                          <div className="form-control-box">
                            <label>终止角度</label>
                            <div className="form-control-input">
                              <input type="number" onChange={this.onSectorEndAngleChange} />
                            </div>
                          </div>
                        </React.Fragment>
                      )
                    }
                    {
                      type === 'ring' && (
                        <React.Fragment>
                          <div className="form-control-box">
                            <label>类型</label>
                            <div className="form-control-input">
                              <select onChange={this.onTypeChange}>
                                <option value={Ring.TYPE.STROKE}>STROKE</option>
                                <option value={Ring.TYPE.FILL}>FILL</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-control-box">
                            <label>起始角度</label>
                            <div className="form-control-input">
                              <input type="number" onChange={this.onArcStartAngleChange} />
                            </div>
                          </div>
                          <div className="form-control-box">
                            <label>终止角度</label>
                            <div className="form-control-input">
                              <input type="number" onChange={this.onArcEndAngleChange} />
                            </div>
                          </div>
                          <div className="form-control-box">
                            <label>外径长度</label>
                            <div className="form-control-input">
                              <input type="number" onChange={this.onRingLongRadiusChange}/>
                            </div>
                          </div>
                          <div className="form-control-box">
                            <label>内径长度</label>
                            <div className="form-control-input">
                              <input type="number" onChange={this.onRingShortRadiusChange}/>
                            </div>
                          </div>
                        </React.Fragment>
                      )
                    }
                    {
                      type !== 'ring' && (
                        <div className="form-control-box">
                          <label>半径</label>
                          <div className="form-control-input">
                            <input type="number" onChange={this.onArcRadiusChange}/>
                          </div>
                        </div>
                      )
                    }
                    <div className="form-control-box">
                      <label>颜色</label>
                      <div className="form-control-input">
                        <input type="color" onChange={this.onColorChange}/>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )
            }
            {/** Arc, Circle, Ring 属性结束 **/}
            {/** Line 属性开始 **/}
            {
              (type === 'line' || type === 'multi' || type === 'curve') && (
                <React.Fragment>
                  <div className="form-box">
                    <div className="form-control-box">
                      <label>线框(lineWidth)</label>
                      <div className="form-control-input">
                        <input type="number" onChange={this.onLineWidthChange} />
                      </div>
                    </div>
                    {
                      type === 'curve' && (
                        <div className="form-control-box">
                          <label>类型</label>
                          <div className="form-control-input">
                            <select onChange={this.onTypeChange}>
                              <option value={Curve.TYPE.STROKE}>STROKE</option>
                              <option value={Curve.TYPE.FILL}>FILL</option>
                            </select>
                          </div>
                        </div>
                      )
                    }
                    <div className="form-control-box">
                      <label>末端样式(lineCap)</label>
                      <div className="form-control-input">
                        <select onClick={this.onLineCapChange}>
                          <option value={Line.LINE_CAP.BUTT}>butt</option>
                          <option value={Line.LINE_CAP.ROUND}>round</option>
                          <option value={Line.LINE_CAP.SQUARE}>square</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>虚线样式(lineDash)</label>
                      <div className="form-control-input">
                        <input type="text" onChange={this.onLineDashChange} placeholder="交替绘制线段和间距,用,分开" />
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>虚线起始偏移量(lineDashOffset)</label>
                      <div className="form-control-input">
                        <input type="number" onChange={this.onLineDashOffsetChange}/>
                      </div>
                    </div>
                    {
                      type === 'line' && (
                        <React.Fragment>
                          <div className="form-control-box">
                            <label>起始位置</label>
                            <div className="form-control-input">
                              <input onChange={this.onLineFromChange} placeholder="起始位置用,分隔"/>
                            </div>
                          </div>
                          <div className="form-control-box">
                            <label>结束位置</label>
                            <div className="form-control-input">
                              <input onChange={this.onLineToChange} placeholder="结束位置用,分隔" />
                            </div>
                          </div>
                        </React.Fragment>
                      )
                    }
                    <div className="form-control-box">
                      <label>颜色</label>
                      <div className="form-control-input">
                        <input type="color" onChange={this.onColorChange}/>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )
            }
            {/** Line 属性结束 **/}
            {/** Rectangle 属性开始 **/}
            {
              type === 'rectangle' && (
                <React.Fragment>
                  <div className="form-box">
                    <div className="form-control-box">
                      <label>线框(lineWidth)</label>
                      <div className="form-control-input">
                        <input type="number" onChange={this.onLineWidthChange} />
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>位置(position)</label>
                      <div className="form-control-input">
                        <input type="text" onChange={this.onPositionChange} placeholder="用逗号,隔开" />
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>宽(width)</label>
                      <div className="form-control-input">
                        <input type="number" onChange={this.onRectangleWidthChange} />
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>高(height)</label>
                      <div className="form-control-input">
                        <input type="number" onChange={this.onRectangleHeightChange}/>
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>类型</label>
                      <div className="form-control-input">
                        <select onChange={this.onTypeChange}>
                          <option value={Rectangle.TYPE.STROKE}>STROKE</option>
                          <option value={Rectangle.TYPE.FILL}>FILL</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>末端样式(lineCap)</label>
                      <div className="form-control-input">
                        <select onClick={this.onLineCapChange}>
                          <option value={Rectangle.LINE_CAP.BUTT}>butt</option>
                          <option value={Rectangle.LINE_CAP.ROUND}>round</option>
                          <option value={Rectangle.LINE_CAP.SQUARE}>square</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>虚线样式(lineDash)</label>
                      <div className="form-control-input">
                        <input type="text" onChange={this.onLineDashChange} placeholder="交替绘制线段和间距,用,分开" />
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>虚线起始偏移量(lineDashOffset)</label>
                      <div className="form-control-input">
                        <input type="number" onChange={this.onLineDashOffsetChange}/>
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>X方向阴影偏移(shadowOffsetX)</label>
                      <div className="form-control-input">
                        <input type="number" onChange={this.onShadowOffsetXChange}/>
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>Y方向阴影偏移(shadowOffsetY)</label>
                      <div className="form-control-input">
                        <input type="number" onChange={this.onShadowOffsetYChange}/>
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>阴影模糊长度(shadowBlur)</label>
                      <div className="form-control-input">
                        <input type="number" onChange={this.onShadowBlurChange}/>
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>阴影颜色</label>
                      <div className="form-control-input">
                        <input type="color" onChange={this.onShadowColorChange}/>
                      </div>
                    </div>
                    <div className="form-control-box">
                      <label>颜色</label>
                      <div className="form-control-input">
                        <input type="color" onChange={this.onColorChange}/>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )
            }
            {/** Rectangle 属性结束 **/}
          </div>
          <div className="base-chart" ref={this.myRef}/>
        </div>

      </React.Fragment>
    )
  }
}

ReactDOM.render(
  <AxisTest />,
  document.getElementById('root')
)
