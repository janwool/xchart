import Node from './Node';

export default class Layer extends Node {
  constructor(canvas, style) {
    super(canvas, style);
    this.width = style.width || canvas.width;
    this.height = style.height || canvas.height;
    this.childs = [];
  }

  addChild() {
    for (const i in arguments) {
      if (arguments[i] instanceof Node) {
        if (this.childs.indexOf(arguments[i]) === -1) {
          arguments[i].canvas = this.canvas;
          this.childs.push(arguments[i]);
          if (arguments[i] instanceof Layer) {
            arguments[i].build()
          }
        }
      }
    }
  }

  removeChild(child) {
    if (this.childs.indexOf(child) !== -1) {
      this.childs.splice(this.childs.indexOf(child), 1);
    }
  }

  clearEventListener() {
    for (let i = 0; i < this.childs.length; i++) {
      this.childs[i].clearEventListener();
    }
    super.clearEventListener();
  }

  build() {
    return false;
  }

  paint(config) {
    if (this.visible) {
      config.before && config.before(this);
      this.beforePaint && this.beforePaint();
      for (const child of this.childs) {
        child.paint(config);
      }
      config.after && config.after(this);
    }
    super.paint(config);
  }

  containsPoint (point) {
    return (
      point.x < this.position.x + this.width / 2
      && point.x > this.position.x - this.width / 2
      && point.y < this.position.y + this.height / 2
      && point.y > this.position.y - this.height / 2
    );
  }
}
