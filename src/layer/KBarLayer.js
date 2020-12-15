import BaseLayer from './BaseLayer';
import Node from '../core/Node';

class Bar extends Node {
    constructor(canvas, options) {
        super(canvas);
        this.open = options.bar.open;
        this.high = options.bar.high;
        this.low = options.bar.low;
        this.close = options.bar.close;
        this.datetime = options.bar.datetime;
        this.width = options.width || 20;
        this.delta = options.delta || 10;
        this.baseLine = options.baseLine || 0;
        this.redColor = new Color(options.redColor || '#F75A5A');
        this.redHollow = options.redHollow || false;
        this.greenColor = new Color(options.greenColor || '#1CC262');
        this.greenHollow = options.greenHollow || false;
        if (this.open > this.close) {
            this.color = this.greenColor;
        } else {
            this.color = this.redColor;
        }
    }
    setBar(open, high, low, close, datetime) {
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.datetime = datetime;
        if (this.open > this.close) {
            this.color = this.greenColor;
        } else {
            this.color = this.redColor;
        }
    }

    draw(painter) {
        let barHeight = Math.round(Math.abs(this.close - this.open) * this.delta);
        const isRed = this.close > this.open;
        barHeight = barHeight > 0 ? barHeight : 2;
        const color = this.color.getColor();
        painter.strokeStyle = color;
        painter.strokeWidth = '3px';
        painter.fillStyle = color;

        const stroke = isRed ? this.redHollow : this.greenHollow;
        if (stroke) {
            let top = 0;
            let bottom = 0;
            if (isRed) {
                top = this.close;
                bottom = this.open;
            } else {
                top = this.open;
                bottom = this.close;
            }
            painter.beginPath();
            painter.moveTo(this.position.x + this.width / 2, this.position.y - (this.high - this.baseLine) * this.delta);
            painter.lineTo(this.position.x + this.width / 2, this.position.y - (top - this.baseLine) * this.delta);
            painter.closePath();
            painter.stroke();
            painter.beginPath();
            painter.moveTo(this.position.x + this.width / 2, this.position.y - (this.low - this.baseLine) * this.delta);
            painter.lineTo(this.position.x + this.width / 2, this.position.y - (bottom - this.baseLine) * this.delta);
            painter.closePath();
            painter.stroke();
            painter.strokeRect(
                this.position.x + Math.round(0.1 * this.width),
                this.position.y - Math.round(((this.close > this.open ? this.close : this.open) - this.baseLine) * this.delta),
                Math.round(this.width * 0.8),
                barHeight
            );
        } else {
            painter.beginPath();
            painter.moveTo(this.position.x + this.width / 2, this.position.y - (this.high - this.baseLine) * this.delta);
            painter.lineTo(this.position.x + this.width / 2, this.position.y - (this.low - this.baseLine) * this.delta);
            painter.closePath();
            painter.stroke();
            painter.fillRect(
                this.position.x + Math.round(0.1 * this.width),
                this.position.y - Math.round(((this.close > this.open ? this.close : this.open) - this.baseLine) * this.delta),
                Math.round(this.width * 0.8),
                barHeight
            );
        }
    }

    containsPoint(point) {
        return false;
    }
}

export default class KBarLayer extends BaseLayer {
    constructor(canvas, options) {
        super(canvas);
        this.width = options.width || this.canvas.width;
        this.height = options.height || this.canvas.height;
        this.barNum = options.barNum || 30;
        this.data = options.data || [];
        this.redHollow = options.redHollow || false;
        this.greenHollow = options.greenHollow || false;
        this.redColor = options.redColor || '#F75A5A';
        this.greenColor = options.greenColor || '#1CC262';
    }

    make() {
        if (this.data.length === 0) {
            return;
        }
        this.clearEventListener();
        this.childs.splice(0, this.childs.length);
        const barWidth = this.width / this.barNum;
        let kLeft = Math.floor(this.position.x / barWidth);
        let barEnd = this.data.length - 1;
        if (kLeft > 0 && this.data.length > kLeft + this.barNum) {
            barEnd = this.data.length - 1 - kLeft;
        } else if (kLeft > 0) {
            barEnd = this.barNum;
        }
        let barStart = this.data.length > (kLeft + this.barNum)
            ? this.data.length - 1 - kLeft - this.barNum
            : 0;
        if (barStart >= this.data.length) {
            if (this.data.length - this.barNum < 0) {
                barStart = 0;
            } else {
                barStart = this.data.length - this.barNum;
            }
        }
        if (barEnd >= this.data.length) {
            barEnd = this.data.length - 1;
        }

        let max = this.data[barStart].high;
        let min = this.data[barEnd].low;
        for (let i = barStart; i <= barEnd; i++) {
            if (this.data[i].high > max) {
                max = this.data[i].high;
            }
            if (this.data[i].low < min) {
                min = this.data[i].low;
            }
        }
        let yDelta = this.height / (max - min);
        for (let i = barStart; i <= barEnd; i++) {
            const bar = new Bar(this.canvas, {
                bar: this.data[i],
                width: barWidth,
                delta: yDelta,
                baseLine: min,
                redHollow: this.redHollow,
                greenHollow: this.greenHollow,
                redColor: this.redColor,
                greenColor: this.greenColor
            });
            bar.setPosition(this.position.x + (i - barStart) * barWidth, this.position.y);
            this.addChild(bar);
        }

    }
}
