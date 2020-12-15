
export default class Point {
  constructor(_x, _y) {
    this.x = parseInt(_x);
    this.y = parseInt(_y);
  }

  add(point, y = 0) {
    if (point instanceof Point) {
      this.x += point.x;
      this.y += point.y;
    } else if (/^[0-9]*\.?[0-9]*/.test(point)) {
      this.x += point;
      this.y += _y;
    } else {
      throw new Error('Type Error');
    }
  }

  sub(point, _y = 0) {
    if (point instanceof Point) {
      this.x -= point.x;
      this.y -= point.y;
    } else if (/^[0-9]*\.?[0-9]*/.test(point)) {
      this.x -= point;
      this.y -= _y;
    } else {
      throw new Error('Type Error');
    }
  }
}
