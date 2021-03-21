class AnimateText { 
    constructor({
        frameMs, // <Number>
        animation, // <Array>
        animationCallback // <Function>
    }) {
        this.frameMs = frameMs;
        this.animation = animation;
        this.animationCallback = animationCallback;

        // const loadingAnimation = setInterval(() => {
        //     editMsg(query.message.chat.id, query.message.message_id + 1, 'Wait, update in process' + '.'.repeat(Math.round(Date.now() / 1000) % 3 + 1))
        // }, 1000);
    }

    startLinearAnimate() {
        let end = 0;

        this.timeout = setInterval(() => {
            const animateState = this.animation.join('').substring(0, end);

            this.animationCallback(animateState);

            if (this.animation.length === end) {
                end = 0
            } else {
                end += 1;
            }
        }, this.frameMs);
    }

    startRandomAnimate() {
        let end = 0;

        this.timeout = setInterval(() => {
            const animateState = this.animation.join('').substring(0, end);

            this.animationCallback(animateState);

            end =  Math.random() * (this.animation.length - 1) + 1;
        }, this.frameMs);
    }

    startFrameAnimate() {
        let end = 0;

        this.timeout = setInterval(() => {
            const animateState = this.animation.join('')[end];

            this.animationCallback(animateState);

            if (this.animation.length - 1 === end) {
                end = 0
            } else {
                end += 1;
            }
        }, this.frameMs);
    }

    stopAnimate() {
        clearInterval(this.timeout);
    }

}

export default AnimateText;