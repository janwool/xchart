import BaseLayer from './BaseLayer';
import Text from '../base/Text';
import Line from '../base/Line';
import Point from '../core/Point';

export default class AxisLayer extends BaseLayer {
    static AxisType = {
        NUMBER: 1,
        LABEL: 2
    }

    static AxisPosition = {
        INNER: 1,
        BLOCK: 2
    }

    constructor(canvas, style) {
        super(canvas, style);
        this.width = style.width || this.canvas.width; // 宽度
        this.height = style.height || this.canvas.height; // 高度
        this.yAxisType = style.yAxisType || AxisLayer.AxisType.NUMBER;  // Y轴坐标值类型
        this.xAxisType = style.xAxisType || AxisLayer.AxisType.LABEL;   // X轴坐标值类型
        this.xAxisGraduations = style.xAxisGraduations || 5;            // X轴坐标个数
        this.yAxisGraduations = style.yAxisGraduations || 5;            // Y轴坐标个数
        this.yAxisMax = style.yAxisMax || 1;                            // Y轴坐标为数值型时，Y轴最大值
        this.yAxisMin = style.yAxisMin || 0;                            // Y轴坐标为数值型时，Y轴最小值
        this.xAxisMax = style.xAxisMax || 1;                            // X轴坐标为数值型时，X轴最大值
        this.xAxisMin = style.xAxisMin || 0;                            // X轴坐标为数值型时，X轴最小值
        this.xAxisLabels = style.xAxisLabels || [];                     // X轴坐标为字符型时，X轴坐标数组
        this.yAxisLabels = style.yAxisLabels || [];                     // Y轴坐标为字符型时，Y轴坐标数组
        this.xAxisRender = style.xAxisRender || this.xAxisDefaultRender;// X轴坐标渲染函数
        this.yAxisRender = style.yAxisRender || this.yAxisDefaultRender;// Y轴坐标渲染函数
        this.xAxisPosition = style.xAxisPosition || AxisLayer.AxisPosition.BLOCK;//X轴位置类型，BLOCK位于坐标系之外
        this.yAxisPosition = style.yAxisPosition || AxisLayer.AxisPosition.INNER;//Y轴位置类型
    }

    xAxisDefaultRender(label) {
        return {
            text: `${label}`,
            size: 20,
            font: 'PingFang SC',
            color: '#999999'
        };
    }

    yAxisDefaultRender(label) {
        return {
            text: `${label}`,
            size: 20,
            font: 'PingFang SC',
            color: '#999999'
        };
    }

    make() {
        if (this.xAxisGraduations <= 2) {
            throw 'X轴坐标标尺数不能小于等于2';
        }
        if (this.yAxisGraduations <= 2) {
            throw 'Y轴坐标标尺数不能小于等于2';
        }
        this.onBeforeMake && this.onBeforeMake(this);
        this.childs.splice(0, this.childs.length);
        let xLabels = []; // X轴坐标系内容
        let xHeight = 0;  // X轴坐标数据的高度
        let yLabels = []  // Y轴坐标系内容
        let yWidth = 0;   // Y轴坐标数据的宽度
        if (this.xAxisType === AxisLayer.AxisType.NUMBER) {
            // X轴类型为数值
            let xAxisStep = (this.xAxisMax - this.xAxisMin) / (this.xAxisGraduations - 1); // X轴单位数值
            for (let i = 0; i < this.xAxisGraduations; i++) {
                let xAxisStyle = this.xAxisRender(this.xAxisMin + i * xAxisStep); // 获取坐标渲染信息
                let xAxisTextValue = xAxisStyle.text || ''; // x轴坐标值
                let xAxisTextSize = parseInt(xAxisStyle.size) || 20;    // 坐标字体大小
                let xAxisTextFont = xAxisStyle.font || 'PingFang SC';   // 坐标字体
                let xAxisTextColor = xAxisStyle.color || '#999999';     // 字体颜色
                // 构建X轴坐标内容
                let xAxisText = new Text(this.canvas, {
                    text: xAxisTextValue,
                    size: xAxisTextSize,
                    font: xAxisTextFont,
                    color: xAxisTextColor
                });
                if (xAxisText.height > xHeight) {
                    // 确保X轴在最高字体之上
                    xHeight = xAxisText.height;
                }
                xLabels.push(xAxisText);
            }
        } else {
            // X轴坐标为字符型
            for (let i = 0; i < this.xAxisLabels.length; i++) {
                // 构建坐标数据数组
                let xAxisStyle = this.xAxisRender(this.xAxisLabels[i]);
                let xAxisTextValue = xAxisStyle.text || '';
                let xAxisTextSize = parseInt(xAxisStyle.size) || 20;
                let xAxisTextFont = xAxisStyle.font || 'PingFang SC';
                let xAxisTextColor = xAxisStyle.color || '#999999';
                let xAxisText = new Text(this.canvas, {
                    text: xAxisTextValue,
                    size: xAxisTextSize,
                    font: xAxisTextFont,
                    color: xAxisTextColor
                });
                if (xAxisText.height > xHeight) {
                    xHeight = xAxisText.height;
                }
                xLabels.push(xAxisText);
            }
        }
        if (this.yAxisType === AxisLayer.AxisType.NUMBER) {
            // Y轴坐标为数值型
            let yAxisStep = (this.yAxisMax - this.yAxisMin) / (this.yAxisGraduations - 1);
            for (let i = 0; i < this.yAxisGraduations; i++) {
                let yAxisStyle = this.yAxisRender(this.yAxisMin + i * yAxisStep);
                let yAxisTextValue = yAxisStyle.text || '';
                let yAxisTextSize = parseInt(yAxisStyle.size) || 20;
                let yAxisTextFont = yAxisStyle.font || 'PingFang SC';
                let yAxisTextColor = yAxisStyle.color || '#999999';

                let yAxisText = new Text(this.canvas, {
                    text: yAxisTextValue,
                    size: yAxisTextSize,
                    font: yAxisTextFont,
                    color: yAxisTextColor
                });
                if (yAxisText.width > yWidth) {
                    yWidth = yAxisText.width;
                }
                yLabels.push(yAxisText);
            }
        } else {
            // Y轴坐标为字符型
            for (let i = 0; i < this.yAxisLabels.length; i++) {
                let yAxisStyle = this.yAxisRender(this.yAxisLabels[i]);
                let yAxisTextValue = yAxisStyle.text || '';
                let yAxisTextSize = parseInt(yAxisStyle.size) || 20;
                let yAxisTextFont = yAxisStyle.font || 'PingFang SC';
                let yAxisTextColor = yAxisStyle.color || '#999999';
                let yAxisText = new Text(this.canvas, {
                    text: yAxisTextValue,
                    size: yAxisTextSize,
                    font: yAxisTextFont,
                    color: yAxisTextColor
                });
                if (yAxisText.width > yWidth) {
                    yWidth = yAxisText.width;
                }
                yLabels.push(yAxisText);
            }
        }
        // 横向网格0点起点位置
        const xLabelY = this.xAxisPosition === AxisLayer.AxisPosition.INNER ? 0 : xHeight;
        // 纵向网格0点起点位置
        const yLabelX = this.yAxisPosition === AxisLayer.AxisPosition.INNER ? 0 : yWidth;
        // 绘制X轴标尺
        // 纵向网格步进
        const xStep = (this.width - yLabelX) / (this.xAxisGraduations - 1);
        for (let i = 0; i < this.xAxisGraduations; i++) {
            // 纵向网格x方向坐标
            const positionX = this.position.x + yLabelX + i * xStep;
            let xLine = new Line(this.canvas, {
                position: new Point(positionX, this.position.y + xLabelY),
                to: new Point(positionX, this.position.y + this.height),
                color: this.color,
                lineDash: [5, 10],
                lineWidth: 1,
            });
            // 添加纵向网格线
            this.addChild(xLine);
            //设置坐标值
            if (xLabels[i]) {
                if (this.xAxisType === AxisLayer.AxisType.NUMBER) {
                    if (i === 0) {
                        xLabels[i].setPosition(positionX, this.position.y);
                    } else if (i === this.xAxisGraduations - 1) {
                        xLabels[i].setPosition(positionX - xLabels[i].width, this.position.y);
                    } else {
                        xLabels[i].setPosition(positionX - xLabels[i].width / 2, this.position.y);
                    }
                    this.addChild(xLabels[i]);
                }
            }
        }
        if (this.xAxisType === AxisLayer.AxisType.LABEL) {
            const xAxisStep = (this.width - yWidth) / xLabels.length;
            for (let i = 0; i < xLabels.length; i++) {
                const posX = this.xAxisLabels[i].position ? this.xAxisLabels[i].position.x + yWidth : i * xAxisStep + yWidth;
                const posY = this.xAxisLabels[i].position ? this.xAxisLabels[i].position.y + this.position.y : this.position.y;
                xLabels[i].setPosition(posX - xLabels[i].width / 2, posY);
                this.addChild(xLabels[i]);
            }
        }
        // 绘制Y轴标尺
        const yStep = (this.height - xLabelY) / (this.yAxisGraduations - 1);
        for (let i = 0; i < this.yAxisGraduations; i++) {
            const positionY = Math.round(this.position.y + xLabelY + i * yStep);
            let yLine = new Line(this.canvas, {
                position: new Point(this.position.x + yLabelX, positionY),
                to: new Point(this.position.x + this.width, positionY),
                color: this.color,
                lineDash: [5, 10],
                lineWidth: 1,
            });
            this.addChild(yLine);
            if (yLabels[i]) {
                if (this.yAxisType === AxisLayer.AxisType.NUMBER) {
                    if (i === 0) {
                        yLabels[i].setPosition(this.position.x, positionY);
                    } else if (i === this.yAxisGraduations - 1){
                        yLabels[i].setPosition(this.position.x, positionY - yLabels[i].height);
                    } else {
                        yLabels[i].setPosition(this.position.x, positionY - yLabels[i].height / 2);
                    }
                }
                this.addChild(yLabels[i]);
            }
        }
        this.onMaked && this.onMaked(this, {
            xStart: yLabelX,
            yStart: xLabelY
        });
    }


}
