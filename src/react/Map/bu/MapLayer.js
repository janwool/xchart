/*
* @Date: 2020/5/20
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Layer from '../../../core/Layer';
import bound from './100000';
import Point from '../../../core/Point';
import Polygon from '../../../base/Polygon';
import full from './100000_full';
import Event from '../../../event/Event';

const minX = 73.502355;
const minY = 3.39716187;
const maxX = 135.09567;
const maxY = 53.563269;
const centerX = 116.405285;
const centerY = 39.904989;

export default class MapLayer extends Layer {
  constructor(canvas, style) {
    super(canvas, style);
    this.onClick = style.onClick;
  }

  make() {
    this.clearEventListener();
    this.childs.splice(0, this.childs.length);
    const xStep = this.width / (maxX - minX);
    const yStep = this.height / (maxY - minY);
    for (let m = 0; m < bound.features.length; m++) {
      const coordinates =  bound.features[m].geometry.coordinates;
      for (let i = 0; i < coordinates.length; i++) {
        let item = coordinates[i];
        for (let j = 0; j < item.length; j++) {
          let dots = item[j];
          let polygonPoint = [];
          for (let k = 0; k < dots.length; k++) {
            polygonPoint.push(
              new Point(
                (dots[k][0] - minX) * xStep,
                (dots[k][1] - minY) * yStep
              ));
          }
          let polygon = new Polygon(this.canvas, {
            type: Polygon.TYPE.STROKE,
            color: this.color,
          }, polygonPoint);
          this.addChild(polygon);
        }
      }
    }
    // 绘制省界线
    for (let m = 0; m < full.features.length; m++) {
      const coordinates =  full.features[m].geometry.coordinates;
      for (let i = 0; i < coordinates.length; i++) {
        let item = coordinates[i];
        for (let j = 0; j < item.length; j++) {
          let dots = item[j];
          let polygonPoint = [];
          for (let k = 0; k < dots.length; k++) {
            polygonPoint.push(
              new Point(
                (dots[k][0] - minX) * xStep,
                (dots[k][1] - minY) * yStep
              ));
          }
          let polygon = new Polygon(this.canvas, {
            type: Polygon.TYPE.STROKE,
            color: this.color,
            lineDash: [5, 10],
            lineWidth: 1,
          }, polygonPoint);
          polygon.ext = full.features[m].properties;
          (this.onClick && (
            polygon.addEventListener(Event.EVENT_CLICK, (e) => {
              console.log(e);
              this.onClick && this.onClick(e);
            })
          ))

          this.addChild(polygon);
        }
      }
    }
  }
}
