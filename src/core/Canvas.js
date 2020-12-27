import Node from './Node';
import EventManager from '../event/EventManager';
import Layer from './Layer';
export default class Canvas {
  constructor(config) {
    if (config.ele === undefined) {
      throw new Error('Not found config of canvas element');
    }
    this.container = config.ele;
    this.canAction = config.canAction;
    this.ratio = config.ratio || 2;
    this.canvas = document.createElement('canvas');
    this.childs = [];
    this.eventManager = new EventManager(this);
    this.init();
  }

  /**
   * 重新定义Canvas的大小
   */
  repaint() {
    this.container.innerHTML = '';
    this.canvas = document.createElement('canvas');
    this.init();
  }

  set onmousedown(func) {
    this.canvas.onmousedown = func;
  }

  set onmouseup(func) {
    this.canvas.onmouseup = func;
  }

  set onmousemove(func) {
    this.canvas.onmousemove = func;
  }

  set ontouchstart(func) {
    this.canvas.ontouchstart = func;
  }

  set ontouchend(func) {
    this.canvas.ontouchend = func;
  }

  set ontouchmove(func) {
    this.canvas.ontouchmove = func;
  }

  set onmousewheel(func)  {
    this.canvas.onmousewheel = func;
  }

  set onmouseout(func) {
    this.canvas.onmouseout = func;
  }

  set onmouseleave(func) {
    this.canvas.onmouseleave = func;
  }

  set onmouseenter(func) {
    this.canvas.onmouseenter = func;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  init() {
    const styles = getComputedStyle(this.container, null);
    const width = parseInt(styles.width);
    const height = parseInt(styles.height);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.canvas.width = this.ratio * width;
    this.canvas.height = this.ratio * height;
    this.canvas.style.outline = 'none';
    this.canvas.onclick = (e) => { this.canvas.focus(); };
    this.container.appendChild(this.canvas);
    this.painter = this.canvas.getContext('2d');
  }

  addChild() {
    for (const i in arguments) {
      if (arguments[i] instanceof Node) {
        if (this.childs.indexOf(arguments[i]) === -1) {
          arguments[i].canvas = this;
          this.childs.push(arguments[i]);
          if (arguments[i] instanceof Layer) {
            arguments[i].build();
          }
        }
      }
    }
  }

  removeChild() {
    for (const i in arguments) {
      if (arguments[i] instanceof Node) {
        if (this.childs.indexOf(arguments[i]) !== -1) {
          arguments[i].canvas = this;
          this.childs.splice(this.childs.indexOf(arguments[i]), 1);
        }
      }
    }
  }

  stopAction() {
    this.canAction = false;
  }

  startAction() {
    this.canAction = true;
    this.paint();
  }

  getClientPosition(point) {
    const box = this.canvas.getBoundingClientRect();
    const clientX = box.width * point.x / this.width + box.left;
    const clientY = box.height * (this.height - point.y) / this.height + box.top;
    return { clientX, clientY };
  }

  paint(before, after) {
    this.painter.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.childs.length; i++) {
      before && before(this);
      this.childs[i].paint({ before, after });
      after && after(this);
    }
    if (this.canAction) {
      setTimeout(() => {
        this.paint(before, after);
      }, Math.round(this.fps ? Math.round(1000 / this.fps) : Math.round(1000 / 60)));
    }
  }
}
