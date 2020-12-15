/*
* @Date: 2019/12/5
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Event from './Event';

export default class MouseUpEvent extends Event {
  constructor(callback) {
    super(Event.EVENT_MOUSE_UP, callback);
    this.curPoint = null;
    setTimeout(() => {
      this.doEvent();
    }, 0);
  }

  /**
   * 事件处理
   */
  doEvent() {
    if (!this.isProcessed) {
      this.callback(this);
    }
    super.doEvent();
  }
}
