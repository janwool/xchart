/*
* @Date: 2020/6/2
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
import Polygon from '@/base/Polygon';
import Canvas from '@/core/Canvas';
import Point from '@/core/Point';
import Camera from '@/3d/core/Camera';
import Point3 from '@/3d/core/Point3';
import Line from '@/base/Line';
function rotationX(point, angle) {
  const xAngle = angle / 180 * Math.PI;
  const xTrans = point.x;
  const yTrans = Math.cos(xAngle) * point.y + Math.sin(xAngle) * point.z;
  const zTrans = - Math.sin(xAngle) * point.y + Math.cos(xAngle) * point.z;
  return {
    x: xTrans,
    y: yTrans,
    z: zTrans
  };
}

function rotationY(point, angle) {
  const yAngle = angle / 180 * Math.PI;
  const xTrans = Math.cos(yAngle) * point.x - Math.sin(yAngle) * point.z;
  const yTrans = point.y;
  const zTrans = Math.sin(yAngle) * point.x + Math.cos(yAngle) * point.z;
  return {
    x: xTrans,
    y: yTrans,
    z: zTrans
  };
}

function rotationZ(point, angle) {
  const zAngle = angle / 180 * Math.PI;
  const xTrans = Math.cos(zAngle) * point.x - Math.sin(zAngle) * point.y;
  const yTrans = Math.sin(zAngle) * point.x + Math.cos(zAngle) * point.y;
  const zTrans = point.z;
  return {
    x: xTrans,
    y: yTrans,
    z: zTrans
  };
}

function translateZ(point, x, y, z) {
  return {
    x: point.x + x,
    y: point.y + y,
    z: point.z + z
  };
}

function projection(point, v = 1) {
  console.log(point);
  return {
    x: point.x * v / point.z,
    y: point.y * v / point.z
  }
}

const cube1 = [{
  x: 0,
  y: 0,
  z: 0,
}, {
  x: 100,
  y: 0,
  z: 0,
}, {
  x: 100,
  y: 0,
  z: 100,
}, {
  x: 0,
  y: 0,
  z: 100,
}];
const cube2 = [{
  x: 0,
  y: 0,
  z: 0,
}, {
  x: 0,
  y: 100,
  z: 0
}, {
  x: 0,
  y: 100,
  z: 100,
}, {
  x: 0,
  y: 0,
  z: 100,
}];

const cube3 = [
  {
    x: 100,
    y: 0,
    z: 100,
  }, {
    x: 0,
    y: 0,
    z: 100,
  }, {
    x: 0,
    y: 100,
    z: 100
  }, {
    x: 100,
    y: 100,
    z: 100
  }
];

const cube4 = [
  {
    x: 0,
    y: 0,
    z: 0
  },
  {
    x: 100,
    y: 0,
    z: 0
  },
  {
    x: 100,
    y: 100,
    z: 0
  },
  {
    x: 0,
    y: 100,
    z: 0
  },
]

const cube5 = [
  {
    x: 100,
    y: 100,
    z: 0
  },
  {
    x: 100,
    y: 100,
    z: 100
  },
  {
    x: 0,
    y: 100,
    z: 100
  },
  {
    x: 0,
    y: 100,
    z: 0
  },
]
const cube6 = [
  {
    x: 100,
    y: 100,
    z: 0
  },
  {
    x: 100,
    y: 100,
    z: 1
  },
  {
    x: 100,
    y: 0,
    z: 1
  },
  {
    x: 100,
    y: 0,
    z: 0
  },
];
const ele = document.getElementById('root');
ele.style.width = '100%';
ele.style.height = '400px';
const canvas = new Canvas({
  ele
});
const cube = [cube1, cube2, cube3, cube4, cube5, cube6];
const color1 = ['#3424DD', '#4565BD', '#DDAA33', '#AB45D2', '#89D6DD', '#987823']
const camera = new Camera(new Point3(0, 300, 50), 5);
function screenPointTrans(originP) {
  return new Point(originP.x * 100 + canvas.width / 2, originP.y * 100 + canvas.height / 2);
}
function draw(left, top) {
  camera.setPosition(rotationZ(camera.position, left), top);
  canvas.childs.splice(0, canvas.childs.length);
  let transCube = [];
  for (let i = 0; i < cube.length; i++) {
    let trans = [];
    for (let j = 0; j < cube[i].length; j++) {
      const transPoint = camera.getCameraPosition(cube[i][j]);
      const point = camera.getScreenPosition(transPoint);
      const screenPoint = new Point(point.x * 100 + canvas.width / 2, point.y * 100 + canvas.height / 2);
      trans.push(screenPoint);
    }
    transCube.push(trans);
  }

  for (let i = 0; i < transCube.length; i++) {
    let polygon = new Polygon(canvas, {
      type: Polygon.TYPE.FILL,
      color: color1[i],
    }, transCube[i]);
    canvas.addChild(polygon);
  }
  let originP = camera.getScreenPosition(camera.getCameraPosition(new Point3(0, 0, 0)));
  let origin = screenPointTrans(originP);
  let zP= camera.getScreenPosition(camera.getCameraPosition(new Point3(0, 0, 300)));
  let z = screenPointTrans(zP);
  let xP = camera.getScreenPosition(camera.getScreenPosition(new Point3(300, 0, 0)));
  let x = screenPointTrans(xP);
  let yP = camera.getScreenPosition(camera.getCameraPosition(new Point3(0, 300, 0)));
  let y = screenPointTrans(yP);
  let lineX = new Line(canvas, {
    lineWidth: 5,
    color: '#FF0000',
    position: origin,
    to: x
  });
  let lineY = new Line(canvas, {
    lineWidth: 5,
    color: '#00FF00',
    position: origin,
    to: y,
  });
  let lineZ = new Line(canvas, {
    lineWidth: 5,
    color: '#0000FF',
    position: origin,
    to: z,
  });
  console.log(lineX);
  canvas.addChild(lineX, lineY, lineZ);
  // console.log(canvas);
  canvas.paint();
}
let globalLeft = 0;
let globalTop = 300;
draw(135, 0);
let mouseX = 0;
let mouseY = 0;
let mouseDown = false;
window.addEventListener('mousedown', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  mouseDown = true;
})

window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    let x = e.clientX;
    let y = e.clientY;
    globalLeft = (x - mouseX) / x * 360;
    globalTop = (mouseY - y) / mouseY * 360;
    draw(globalLeft, globalTop);
    mouseX = x;
    mouseY = y;
  }

})

window.addEventListener('mouseup', (e) => {
  mouseDown = false;
})
