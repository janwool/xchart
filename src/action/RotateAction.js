import Action from '../core/Action';

export default class RotateAction extends Action {
  constructor(duration, fps, angle) {
    super(duration, fps);
    this.angle = angle;
  }
  update(_sprite, frame) {
    _sprite.rotation += this.angle
    _sprite.canvas.paint();
  }
}
