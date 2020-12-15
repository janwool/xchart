import Action from '../core/Action';

export default class MoveAction extends Action {
  constructor(_duration, _destination) {
    super(_duration)
    this.destination = _destination
  }

  run(_sprite) {
    let origin = _sprite.getPosition()
    if (this.destination.x != origin.x) {
      let k = (this.destination.y - origin.y) / (this.destination.x - origin.x)
      let deta = (this.destination.x - origin.x) / this.currentFrame
      _sprite.setPosition(origin.x + deta, origin.y + deta * k)
    } else {
      this.deta = (this.destination.y - origin.y) / this.currentFrame
      _sprite.setPosition(origin.x, origin.y + deta)
    }
    this.currentFrame--
    if(this.currentFrame > 0 && this.running) {
      setTimeout(()=>{this.run(_sprite)}, Math.round(1000/60))
    }
  }

  directTo(_destination, _duration) {
    this.destination = _destination
    this.duration = _duration
  }

  reset() {
    this.running = true
    this.currentFrame = this.duration
  }
}