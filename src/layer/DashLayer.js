/*
* @Date: 2020/4/30
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/

import React from 'react';
import BaseLayer from './BaseLayer';

export default class extends BaseLayer {
  constructor(canvas, options) {
    super(canvas);
    this.width = options.width || canvas.width;
    this.height = options.height || canvas.height;
  }
}
