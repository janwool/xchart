/*
* @Date: 2020/6/3
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/

export default class {
  constructor(x, y ,z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.spans = []; // 与该点连接的所有线条
  }

  addSpan = (span) => {
    this.spans.push(span);
  }

  removeSpan = (span) => {
    let index = this.spans.indexOf(span);
    if (index >= 0) {
      this.spans.splice(index, 1);
    }
  }

}
