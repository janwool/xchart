export default class Action {
  static STATUS = {
    BEFORE_RUN: 1,  // 动画运行前
    RUNNING: 2,     // 动画运行中
    PAUSE: 3,       // 动画暂停
    STOP: 4,        // 动画终止
  }

  /**
   * @param _duration 运行时长 以秒为单位
   */
  constructor(_duration, fps = 60) {
    this.status = Action.STATUS.BEFORE_RUN;     // 动作状态
    this.duration = _duration;
    this.allFrames = Math.round(_duration * fps); // 根据运行时间与帧率，计算该动作所有帧率
    this.fps = fps;
    this.currentFrame = 0;                // 当前帧
    this.fpsRatio = 60 / fps;            // 帧率控制 浏览器帧率为60，如果fps为30，那么以为着浏览器每两次刷新运行一次动作
    this.fpsCount = 0;                   // 帧率计数器
    this.runCallback = undefined;        // 动作运行回调函数
  }

  /**
   * 运行函数
   * @param node
   * @param callback 每一帧回调函数，暴露给外围使用
   */
  run(node, callback) {
    if (this.fpsCount < this.fpsRatio) {
      this.fpsCount++;
      requestAnimationFrame((timestamp) => {
        //console.log(timestamp);
        this.run(node, callback);
      });
      return;
    }
    if(!this.runCallback) {
      this.runCallback = callback;
    }
    // 调用动画更新函数
    this.update(node, this.currentFrame, this.allFrames);
    callback && callback(node, this);
    if (this.status === Action.STATUS.RUNNING) {
      // 当动作为运行状态
      if (this.duration < 0 || this.currentFrame < this.allFrames) {
        // 如果总帧数小于0 或者 总帧数大于0 且当前帧小于总帧数, 动作进入下一帧
        this.currentFrame += 1;
        this.fpsCount = 0; // 帧率计数器置0
        requestAnimationFrame(() => {
          this.run(node, callback);
        });
      } else {
        // 运行结束
        // 设置动画为停止
        this.status = Action.STATUS.STOP;
        // 调用动画生命周期停止回调函数
        this.onStop && this.onStop(node);
      }
    }
  }

  /**
   * 抽象方法，由子类继承
   * @param node
   * @param frame
   */
  update(node, frame, frames) {

  }

  /**
   * 动作控制函数，停止操作
   */
  stop() {
    this.status = Action.STATUS.STOP;
    if (this.allFrames > 0) {
      // 确保当前帧为最后一帧
      this.currentFrame = this.allFrames;
    }
    // 调用动画生命周期停止回调函数
    this.onStop && this.onStop(node);
  }

  /**
   * 动作控制函数， 暂停操作
   */
  pause() {
    this.status = Action.STATUS.PAUSE;
    // 调用动画生命周期暂停回调函数
    this.onPause && this.onPause();
  }


  /**
   * 动作控制函数，暂停重新启动
   * @param node
   */
  restart(node) {
    if (this.status === Action.STATUS.PAUSE) {
      this.fpsCount = 0;
      this.status = Action.STATUS.RUNNING;
      this.run(node, this.runCallback);
      // 生命周期函数 暂停启动回调
      this.onRestart && this.onRestart();
    }
  }

  /**
   * 动画重新启动
   * @param node
   */
  reset(node) {
    this.currentFrame = 0;
    this.fpsCount = 0;
    this.status = Action.STATUS.RUNNING;
    this.run(node, this.runCallback);
    // 生命周期函数 重启回调
    this.onReset && this.onReset()
  }
}
