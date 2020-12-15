import Layer from '../core/Layer';

export default class BaseLayer extends Layer {
    constructor(canvas, style) {
        super(canvas, style);
    }

    setOnMaked(makedCallback) {
        this.onMaked = makedCallback;
    }

    setOnBeforeMake(beforeMakeCallback) {
        this.onBeforeMake = beforeMakeCallback;
    }
    make() {
        return;
    }
}
