/*
 * @Date: 2019-12-2
 * @Author: xuechengwu <xuechengwu@erayt.com>
 * @Description: 加速度Action
 */
import Action from '../core/Action';

export default class AccelerateAction extends Action {
    constructor(duration,  option) {
        super(duration, 10);
        this.speedX = option.speedX || 0;
        this.speedY = option.speedY || 0;
        this.accelerateX = option.accelerateX || 0;
        this.accelerateY = option.accelerateY || 0;
        this.beforeUpdate = option.beforeUpdate;
    }

    /**
     * 更新函数
     * @param node
     * @param frame
     */
    update(node, frame) {
        if (this.allFrames === 0 && this.status !== Action.STATUS.RUNNING) {
            return;
        }
        const t = 1 / this.fps;
        const vX = this.speedX + frame / this.fps * this.accelerateX / 1000;
        const vY = this.speedY + frame / this.fps * this.accelerateY / 1000;
        console.log('accelerate',this.speedX,  frame, vX, vY);
        const distX = vX * t + 0.5 * this.accelerateX * t * t;
        const distY = vY * t + 0.5 * this.accelerateY * t * t;
        if (!node.locked) {
            node.setPosition(node.position.x + distX, node.position.y + distY);
            this.beforeUpdate && this.beforeUpdate(node, frame);
            node.canvas.paint();
        }
    }
}
