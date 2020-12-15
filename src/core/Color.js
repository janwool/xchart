const octToDec = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  'A': 10,
  'B': 11,
  'C': 12,
  'D': 13,
  'E': 14,
  'F': 15
}
export default class Color {
  constructor(_r, _g, _b, _a) {
    if (_r instanceof Color) {
      this.r = _r.r;
      this.g = _r.g;
      this.b = _r.b;
      this.a = _r.a;
    } else if (/^#[ABCDEF0-9]{6,8}$/.test(_r)) {
      this.r = octToDec[_r.substr(1, 1)] * 16 + octToDec[_r.substr(2, 1)];
      this.g = octToDec[_r.substr(3, 1)] * 16 + octToDec[_r.substr(4, 1)];
      this.b = octToDec[_r.substr(5, 1)] * 16 + octToDec[_r.substr(6, 1)];
      if (_r.length > 7) {
        this.a = octToDec[_r.substr(7, 1)] * 16 + octToDec[_r.substr(8, 1)];
      } else {
        this.a = 255;
      }
    } else {
      this.r = _r;
      this.g = _g;
      this.b = _b;
      this.a = _a;
    }
  }

  getColor() {
    const r16 = (this.r > 16) ? (this.r % 256).toString(16) : ('0' + (this.r % 256).toString(16));
    const g16 = (this.g > 16) ? (this.g % 256).toString(16) : ('0' + (this.g % 256).toString(16));
    const b16 = (this.b > 16) ? (this.b % 256).toString(16) : ('0' + (this.b % 256).toString(16));
   // const a16 = (this.a > 16) ? (this.a % 256).toString(16) : ('0' + (this.a % 256).toString(16));
    return `#${r16}${g16}${b16}`;
  }

  add(_c) {
    this.r += _c.r;
    this.g += _c.g;
    this.b += _c.b;
    this.a += _c.a;
  }

  sub(_c) {
    this.r -= _c.r;
    this.g -= _c.g;
    this.b -= _c.b;
    this.a -= _c.a;
    return this;
  }
  digMul(_c) {
    this.r = Math.round(this.r + this.r * _c.r);
    this.g = Math.round(this.g + this.g * _c.g);
    this.b = Math.round(this.b + this.b * _c.b);
    this.a = Math.round(this.a + this.a * _c.a);
  }

  ldMul(lamda) {
    if (lamda < 1 && lamda > 0) {
      this.r = Math.floor(this.r * lamda);
      this.g = Math.floor(this.g * lamda);
      this.b = Math.floor(this.b * lamda);
      this.a = Math.floor(this.a * lamda);
    } else {
      throw new Error('Error Arguments');
    }
  }

  changeAlpha(alpha){
    if (this.a + alpha <= 255 && this.a + alpha >= 0){
      this.a += alpha;
    }
  }

  fadeIn(alpha) {
    if (this.a < 255) {
      this.a += alpha;
    }
  }

  fadeOut(alpha) {
    if (this.a > 0) {
      this.a -= alpha;
    }
  }
}
