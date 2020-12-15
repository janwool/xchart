import Point from './Point';
import Scheduler from './Scheduler';
import Action from './Action';
import Event from '../event/Event';
import Listener from '../event/Listener';

export default class Node {
  constructor(canvas, style = {}) {
    this.canvas = canvas || null;                         // 画布
    this.position = style.position || new Point(0, 0);    // 图元坐标
    this.visible = style.visible || true;                 // 是否显示
    this.rotation = style.rotation || 0;                  // 旋转角度
    this.scaleX = style.scaleX || 1;                      // X方向旋转
    this.scaleY = style.scaleY || 1;                      // Y方向
    this.alpha = style.alpha || 1;                        // 透明度
    this.color = style.color || '#000000';                // 颜色
    this.shadowOffsetX = style.shadowOffsetX || '';       // X方向阴影
    this.shadowOffsetY = style.shadowOffsetY || '';       // Y方向阴影
    this.shadowBlur = style.shadowBlur || '';             // 模糊程度
    this.shadowColor = style.shadowColor || '';           // 阴影颜色
    this.linearGradient = style.linearGradient || [];    // 渐变数组
    this.fontSize = style.fontSize || '20';               // 字体大小
    this.fontFamily = style.fontFamily || 'PingFang SC';  // 字体
    this.fontColor = style.fontColor || style.color || '#000000'; // 字体颜色
    this.lineWidth = style.lineWidth || 3;                // 线宽
    this.textAlign = style.textAlign || 'left';
    this.ext = null;                                      // 节点关联数据
  }


  setPosition(_x, _y = 0) {
    if (_x instanceof Point) {
      this.position = _x;
    } else {
      this.position.x = parseInt(_x);
      this.position.y = parseInt(_y);
    }
  }

  scheduleUpdate(dt) {
    this.updateScheduler = setInterval((dt) => {
      this.update(dt);
    }, dt);
  }

  unschedulerUpdate() {
    clearInterval(this.updateScheduler);
  }

  update(dt) {
    // 用于继承
  }

  schedule(callback, dt) {
    const scheduler = setInterval(callback(dt), dt);
    this.schedulers.push(new Scheduler(scheduler, callback));
  }

  runAction(action, callback) {
    if (action instanceof Action) {
      action.reset(this);
      action.run(this, callback);
    } else {
      throw new Error('Error Arguments: action is not a instance of class Action');
    }
  }

  stopAction(action) {
    if (action instanceof Action) {
      action.stop();
    } else {
      throw new Error('Error Arguments: action is not a instance of class Action');
    }
  }

  unscheduler(callback) {
    for (const i in this.schedulers) {
      const scheduler = this.schedulers[i];
      if (scheduler.callback === callback) {
        this.schedulers.slice(i, 1);
        clearInterval(scheduler.scheduler);
        break;
      }
    }
  }

  containsPoint(point) {
    return false;
  }

  addEventListener(event, callback) {
    if (this.canvas === undefined || this.canvas === null) {
      throw new Error('No Canvas Found');
    }
    const ev = new Event(event, callback);
    const listener = new Listener(this, ev);
    this.canvas.eventManager.addEventListener(listener);
  }

  removeEventListener(event, callback) {
    if (this.canvas === undefined || this.canvas === null) {
      throw new Error('No Canvas Found');
    }
    const ev = new Event(event, callback);
    const listener = new Listener(this, ev);
    this.canvas.eventManager.removeEventListener(listener);
  }

  clearEventListener() {
    const listeners = this.canvas.eventManager.listeners.filter(item => item.obj === this);
    if (listeners) {
      for (const l of listeners) {
        this.canvas.eventManager.listeners.splice(this.canvas.eventManager.listeners.indexOf(l), 1);
      }
    }
  }

  draw(painter) {
    // Node 绘制函数
  }

  paint(config) {
    if (this.visible) {
      const { painter } = this.canvas;
      config.before && config.before(this, painter);
      painter.save();
      painter.globalAlpha = this.alpha;
      painter.translate(this.position.x, this.canvas.height - this.position.y);
      painter.rotate(this.rotation * Math.PI / 180);
      painter.translate(- this.position.x, - this.position.y);
      painter.scale(this.scaleX, this.scaleY);
      painter.textAlign = this.textAlign;
      this.draw(painter);
      painter.restore();
      config.after && config.after(this, painter);
    }
  }
}
