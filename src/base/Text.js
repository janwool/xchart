import Node from '../core/Node';
import Color from '../core/Color';

export default class Text extends Node{
  constructor(canvas, style) {
    super(canvas, style);
    this.text = style.text || '';
    this.font = style.font;
    this.size = style.size;
    this.color = new Color(style.color || '#000000FF');
  }

  get width() {
    this.canvas.painter.save();
    this.canvas.painter.font = `${this.size}px ${this.font}`;
    const width = this.canvas.painter.measureText(this.text).width;
    this.canvas.painter.restore();
    return width;
  }

  get height() {
    return this.size;
  }

  containsPoint(point) {
    return point.x >= this.position.x
      && point.x <= this.position.x + this.text.length * parseInt(this.size)
      && point.y >= this.position.y
      && point.y <= this.position.y + parseInt(this.size);
  }

  draw(painter) {
    painter.font = `${this.size}px ${this.font}`;
    painter.fillStyle = this.color.getColor();
    painter.fillText(this.text, this.position.x / this.scaleX, this.position.y / this.scaleY);
  }
}
