/*
* @Date: 2020/12/15
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Event from './Event';

export default class extends Event {
  constructor(callback) {
    super(Event.EVENT_MOUSE_IN, callback);
  }
}
