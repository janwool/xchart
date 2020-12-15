/*
* @Date: 2020/6/3
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
export default class Span{
  constructor(point1, point2) {
    this.point1 = point1;
    this.point2 = point2;
    this.point1.push(this);
    this.point2.push(this);

  }

  /**
   * 由一个点将该线端切割成两个线段
   * @param point1
   */
  cut(point1) {
    this.point1.removeSpan(this);
    this.point2.removeSpan(this);
    let span1 = new Span(this.point1, point1);
    let span2 = new Span(point1, this.point2);

  }
}
