/*
* @Date: 2020/5/6
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import BaseLayer from './BaseLayer';

export default class extends BaseLayer {
  constructor(canvas, option) {
    super(canvas);
    this.width = option.width || this.canvas.width;
    this.height = option.height || this.canvas.height;
    this.data = option.data || [];

  }

  make() {
    this.childs.splice(0, 1);
  }

}
