/*
* @Date: 2020/6/3
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/

import Point3 from "./Point3";
import Point from '../../core/Point';

export default class {
  constructor(position, focal) {
    this.position = position;
    this.focal = focal;
    let dist = Math.sqrt(position.x * position.x + position.y * position.y + position.z * position.z);
    this.direct = [-this.position.x / dist, -this.position.y / dist, -this.position.z / dist]; // 相机平面的法向量
    this.xBase = [this.direct[1], this.direct[0], 0];
    const xDist = Math.sqrt(this.xBase[0] * this.xBase[0] + this.xBase[1] * this.xBase[1] + this.xBase[2] * this.xBase[2]);
    this.xBase = [this.xBase[0] / xDist, this.xBase[1] / xDist, this.xBase[2] / xDist];
    this.yBase = [-this.direct[2] * this.xBase[1], this.direct[2] * this.xBase[0], this.direct[0] * this.xBase[1] - this.direct[1] * this.xBase[0]];
    const yDist = Math.sqrt(this.yBase[0] * this.yBase[0] + this.yBase[1] * this.yBase[1] + this.yBase[2] * this.yBase[2]);
    this.yBase = [Math.abs(this.yBase[0] / yDist), Math.abs(this.yBase[1] / yDist), Math.abs(this.yBase[2] / yDist)];
    this.dist = dist;
  }

  setPosition(position) {
    this.position = position;
    let dist = Math.sqrt(position.x * position.x + position.y * position.y + position.z * position.z);
    this.direct = [-this.position.x / dist, -this.position.y / dist, -this.position.z / dist]; // 相机平面的法向量
    this.xBase = [this.direct[1], this.direct[0], 0];
    const xDist = Math.sqrt(this.xBase[0] * this.xBase[0] + this.xBase[1] * this.xBase[1] + this.xBase[2] * this.xBase[2]);
    this.xBase = [this.xBase[0] / xDist, this.xBase[1] / xDist, this.xBase[2] / xDist];
    this.yBase = [-this.direct[2] * this.xBase[1], this.direct[2] * this.xBase[0], this.direct[0] * this.xBase[1] - this.direct[1] * this.xBase[0]];
    const yDist = Math.sqrt(this.yBase[0] * this.yBase[0] + this.yBase[1] * this.yBase[1] + this.yBase[2] * this.yBase[2]);
    this.yBase = [Math.abs(this.yBase[0] / yDist), Math.abs(this.yBase[1] / yDist), Math.abs(this.yBase[2] / yDist)];
    this.dist = dist;
  }

  getCameraPosition(p) {
    let px = this.xBase[0] * p.x + this.xBase[1] * p.y + this.xBase[2] * p.z;
    let py = this.yBase[0] * p.x + this.yBase[1] * p.y + this.yBase[2] * p.z;
    let pz = this.direct[0] * p.x + this.direct[1] * p.y + this.direct[2] * p.z;
    return new Point3(px, py, pz);
  }

  getScreenPosition(p) {
    const x = p.x * this.focal / (p.z + this.dist);
    const y = p.y * this.focal / (p.z + this.dist);
    return {x, y};
  }

}
