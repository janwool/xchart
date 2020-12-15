/*
 * @Date: 2019-12-2
 * @Author: xuechengwu <xuechengwu@erayt.com>
 * @Description: 滚轮
 */
import Event from './Event';

export default class MouseWheelEvent extends Event {
    constructor(callback, wheelEvent) {
        super(Event.EVENT_MOUSE_WHEEL, callback);
        this.nativeEvent = wheelEvent;
    }

    /**
     * 事件处理
     */
    doEvent() {
        if (!this.isProcessed) {
            setTimeout(() => {
                this.callback && this.callback(this);
            }, 0);
        }
        super.doEvent();
    }
}
