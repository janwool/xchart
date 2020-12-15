/*
* @Date: 2020/5/22
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Layer from '../../../core/Layer';
import Circle from '../../../base/Circle';
import Text from '../../../base/Text';
import Point from '../../../core/Point';
import Line from '../../../base/Line';
import Event from '../../../event/Event';

export default class RelationLayer extends Layer {
  constructor(canvas, style, data = { roles: {}, relation: [] }) {
    super(canvas, style);
    this.roles = data.roles; // 关系中的角色数组，格式{role1: {label: '', color: ''}, role2: {label: '', color: ''}}
    this.relation = data.relation; // 关系数组，格式[[key1, key2, value], [...]]
    this.roleUnits = {};
    // 构建各个角色
    for(let key in this.roles) {
      const role = this.roles[key];
      const randX = Math.random() * this.width * 0.8; // 随机坐标X
      const randY = Math.random() * this.height * 0.8; // 随机坐标Y
      const txt = new Text(this.canvas, {
        text: role.label,
        color: this.color,
        font: this.fontFamily,
        size: this.fontSize,
      });
      txt.position = new Point(randX - txt.width / 2, randY - txt.height / 2);
      let circle = new Circle(this.canvas, {
        radius: Math.max(txt.width, txt.height) / 2 + 10,
        color: role.color || '#999999',
        position: new Point(randX, randY),
        type: Circle.TYPE.FILL,
      });
      // 构建角色图层，便于管理
      const layer = new Layer(this.canvas, {
        position: new Point(randX, randY),
        width: (Math.max(txt.width, txt.height) / 2 + 10) * 2,
        height: (Math.max(txt.width, txt.height) / 2 + 10) * 2,
      });
      // 监听拖拽事件，重置节点并重绘
      layer.addEventListener(Event.EVENT_DRAG, (e) => {
        // 重新计算节点位置
        e.node.position = new Point(e.node.position.x + e.distanceX, e.node.position.y + e.distanceY);
        for (let i = 0; i < e.node.childs.length; i++) {
          if (e.node.childs[i] instanceof Text) {
            e.node.childs[i].position = new Point(
              e.node.position.x + e.distanceX - e.node.childs[i].width / 2,
              e.node.position.y + e.distanceY - e.node.childs[i].height / 2
            );
          } else {
            e.node.childs[i].position = e.node.position;
          }

        }
        if (e.node.canvas) {
          this.make();
          e.node.canvas.paint();
        }
      });

      layer.addChild(circle, txt);
      this.roleUnits[key] = layer;
    }
  }

  /**
   * 设置data的时候重置角色单位
   * @param data
   */
  set data(data) {
    this.clearEventListener();
    this.roles = data.roles;
    this.relation = data.relation;
    this.roleUnits = {};
    // 构建各个角色
    for(let key in this.roles) {
      const role = this.roles[key];
      const randX = Math.random() * this.width;
      const randY = Math.random() * this.height;
      const txt = new Text(this.canvas, {
        text: role.label,
        color: this.color,
        font: this.fontFamily,
        size: this.fontSize,
      });
      txt.position = new Point(randX - txt.width / 2, randY - txt.height / 2);
      let circle = new Circle(this.canvas, {
        radius: Math.max(txt.width, txt.height) / 2 + 10,
        color: role.color || '#999999',
        position: new Point(randX, randY),
        type: Circle.TYPE.FILL,
      });

      // 构建角色图层，便于管理
      const layer = new Layer(this.canvas, { position: new Point(randX, randY) });
      layer.addEventListener(Event.EVENT_DRAG, (e) => {
        // 重新计算节点位置
        e.node.position = new Point(e.node.position.x + e.distanceX, e.node.position.y + e.distanceY);
        for (let i = 0; i < e.node.childs.length; i++) {
          if (e.node.childs[i] instanceof Text) {
            e.node.childs[i].position = new Point(
              e.node.position.x + e.distanceX - e.node.childs[i].width / 2,
              e.node.position.y + e.distanceY - e.node.childs[i].height / 2
            );
          } else {
            e.node.childs[i].position = e.node.position;
          }

        }
        // 重新绘制画布
        if (e.node.canvas) {
          this.make();
          e.node.canvas.paint();
        }
      });
      layer.addChild(circle, txt);
      this.roleUnits[key] = layer;
    }
  }

  make() {
    this.childs.splice(0, this.childs.length);
    if (this.relation.length < 0) {
      return;
    }
    // 遍历关系数组，连接各个角色
    for (let i = 0; i < this.relation.length; i++) {
      const relation = this.relation[i];
      const role1 = this.roleUnits[relation[0]];
      const role2 = this.roleUnits[relation[1]];
      // 计算两个角色坐标的斜率
      const slope = (role1.position.y - role2.position.y) / (role1.position.x - role2.position.x);
      // 计算与水平线的夹角
      const angle = Math.atan(slope);
      // 计算角色1连线的节点1
      const point1 = new Point(
        role1.position.x + role1.childs[0].radius * Math.cos(angle),
        role1.position.y + role1.childs[0].radius * Math.sin(angle)
      );
      // 计算角色2连线的节点2
      const point2 = new Point(
        role2.position.x - role2.childs[0].radius * Math.cos(angle),
        role2.position.y - role2.childs[0].radius * Math.sin(angle)
      );
      // 绘制连接线段
      const line = new Line(this.canvas, {
        position: point1,
        to: point2,
        lineWidth: this.lineWidth || 2,
        color: this.color
      });
      // 关联数值
      const txt = new Text(this.canvas, {
        font: this.fontFamily,
        size: this.fontSize,
        color: this.fontColor,
        text: relation[2],
        position: new Point((role1.position.x + role2.position.x) / 2, (role1.position.y + role2.position.y) / 2),
      });
      // 旋转角度，使其与直线平行
      txt.rotation = -angle / Math.PI * 180;
      this.addChild(line, txt);
    }
    // 将角色加入图层
    for (let key in this.roleUnits) {
      this.addChild(this.roleUnits[key]);
    }
  }
}
