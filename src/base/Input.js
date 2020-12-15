/*
* @Date: 2020/7/21
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/

import Layer from '../core/Layer';
import Event from '../event/Event';
import Text from './Text';
import Point from '../core/Point';
import Rectangle from './Rectangle';
import Line from './Line';

export default class extends Layer {
  constructor(canvas, style) {
    super(canvas, style);
    this.width = style.width || this.fontSize;
    this.height = this.fontSize;
    this.element = document.createElement('input');
    //this.element.style.width = '0';
    //this.element.style.height = '0';
    //this.element.style.position = 'absolute';
    this.element.style.top = '-999px';
    this.element.style.left = '0';
    this.borderStyle = style.borderStyle || {};
    document.body.appendChild(this.element);
    this.addEventListener(Event.EVENT_CLICK, (e) => {
      this.element.focus();
    });
    this.element.oninput = (e) => {
      const { value } = e.target;
      const font = new Text(this.canvas, {
        text: 'a',
        size: this.fontSize,
        font: this.fontFamily,
      });
      const fontWidth = font.width;
      const lineFontNum = Math.floor(this.width / fontWidth);
      this.childs.splice(0, this.childs.length);
      let lineNum = 0;
      for(let i = 0; i < value.length; i = i + lineFontNum) {
        let text = new Text(this.canvas, {
          text: value.substr(i, lineFontNum),
          size: this.fontSize,
          font: this.fontFamily,
          color: this.fontColor,
          position: new Point(this.position.x, this.position.y - lineNum * font.height),
        });
        this.addChild(text);
        lineNum++;
      }
      let curPoint = this.element.selectionStart;
      console.log('curPoint', curPoint);
      const curLine = Math.floor(curPoint / lineFontNum);
      const xShift = (curPoint - curLine * lineFontNum) * fontWidth;

      this.line = new Line(this.canvas, {
        lineWidth: 1,
        position: new Point(this.position.x + xShift, this.position.y - curLine * font.height),
        to: new Point(this.position.x + xShift, this.position.y - (curLine - 1) * font.height),
      });
      console.log('curPoint', curLine, this.line.position.x, this.line.to.x, this.line.position.y, this.line.to.y);
      // console.log(this.line);
      this.height = (lineNum + 1) * font.height;
      this.border = new Rectangle(this.canvas, {
        width: this.width,
        height: this.height,
        position: new Point(this.position.x + this.width / 2, this.position.y),
        type: Rectangle.TYPE.STROKE,
        ...this.borderStyle
      });
      this.addChild(this.border, this.line);
      this.text = value;
      this.onchange && this.onchange(value);
      this.canvas.paint();
    };
    this.element.addEventListener('keydown', (e) => {
      const { keyCode } = e;
      const font = new Text(this.canvas, {
        text: 'a',
        size: this.fontSize,
        font: this.fontFamily,
      });
      const fontWidth = font.width;
      const lineFontNum = Math.floor(this.width / fontWidth);
      if (keyCode === 39 || keyCode === 37) {
        let curPoint = this.element.selectionStart;
        console.log(curPoint)
        const curLine = Math.floor(curPoint / lineFontNum);
        const xShift = (curPoint - curLine * lineFontNum) * fontWidth;
        const index = this.childs.findIndex(vo => vo === this.line);
        if (index >= 0) {
          this.childs.splice(index, 1);
        }
        this.line = new Line(this.canvas, {
          lineWidth: 1,
          position: new Point(this.position.x + xShift, this.position.y - curLine * font.height),
          to: new Point(this.position.x + xShift, this.position.y - (curLine - 1) * font.height),
        });
        this.addChild(this.line);
        this.canvas.paint();
      }
    });
    this.border = new Rectangle(this.canvas, {
      width: this.width,
      height: this.height,
      position: new Point(this.position.x + this.width / 2, this.position.y  + this.height / 2),
      type: Rectangle.TYPE.STROKE,
      ...this.borderStyle
    });
    this.addChild(this.border);
  }

  focus() {
    this.element.focus();
  }

  get value() {
    return this.text;
  }
}
