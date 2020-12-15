export default class Event {
  static EVENT_MOUSE_DOWN = 1;  // 鼠标按下 MouseDownEvent
  static EVENT_MOUSE_MOVE = 2;  // 鼠标移动 MouseMoveEvent
  static EVENT_MOUSE_UP = 3;    // 鼠标弹起 MouseUpEvent
  static EVENT_CLICK = 4;       // 鼠标单击 ClickEvent
  static EVENT_LONG_CLICK = 5;  // 长按鼠标 LongClickEvent
  static EVENT_DRAG = 6;        // 拖拽事件（鼠标或手势）DragEvent
  static EVENT_DRAG_END = 14;   // 拖拽结束事件 DragEndEvent
  static EVENT_TOUCH_START = 7; // TOUCH START事件 TouchStartEvent
  static EVENT_TOUCH_MOVE = 8;  // TOUCH MOVE事件 TouchMoveEvent
  static EVENT_TOUCH_END = 10;  // TOUCH END事件  TouchEndEvent
  static EVENT_TAP = 11;        // 手势TAP事件  TapEvent
  static EVENT_LONG_TAP = 12;   // 手势长按事件 LongTouchEvent
  static EVENT_SCALE = 13;      // 缩放事件 ScaleEvent
  static EVENT_WHEEL = 15;      // 滚轮事件 WheelEvent
  static EVENT_MOUSE_IN = 16;   // 鼠标进入事件 MouseInEvent
  static EVENT_MOUSE_OUT = 17;  // 鼠标移除事件 MouseOutEvent

  constructor(_event, _callback) {
    this.event = _event;        // 事件类型
    this.callback = _callback;  // 事件回调函数
    this.node = null;           // 图元对象
    this.isProcessed = false;   // 事件处理标志，事件是否被处理
    this.eventPoint = null;     // 事件发生坐标
    this.clientPoint = null;    // 事件发生的文档坐标
    this.manager = null;        // 事件管理器
  }

  /**
   * 事件处理函数
   */
  doEvent() {
    if (!this.isProcessed) {
      this.callback && this.callback(this);
      this.isProcessed = true;
    }
  }
}
