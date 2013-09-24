
/**
 * @name Timer
 * @class
 * @description HTML5新计时器兼容
 */
;void function(window) {
    var Timer = this.Timer = {};

    /**
     * HTML5 requestAnimationFrame support
     * @type {*}
     */
    Timer.requestAnimationFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback, element) {
                // 正常浏览器刷新频率为60hz 所有1000/60 得到每次执行间隔
                setTimeout(callback, 1000/60);
            };
    }());

    /**
     * detect browser is support RequestAnimationFrame
     * @return {*}
     */
    Timer.isSupportRequestAnimationFrame = function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            (window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame;
    };

    /**
     * Simulation window.setInterval
     * @param {function} fn The callback function
     * @param {int} delay The delay in milliseconds
     */
    Timer.RequestInterval = function(fn, delay) {
        if (!Timer.isSupportRequestAnimationFrame()) {
            return window.setInterval(fn, delay);
        }

        var start = new Date().getTime();
        var handle = {};

        function loop() {
            var current = new Date().getTime();
            var delta = current - start;

            if (delta >= delay) {
                fn.call();
                start = new Date().getTime();
            }

            handle.value = Timer.requestAnimationFrame.call(window, loop);
        }

        // requestAnimatFrame must be executed in the context of window
        handle.value = Timer.requestAnimationFrame.call(window, loop);
        return handle;
    };

    /**
     * Simulation window.clearInterval
     * @param {int|object} handle The callback function
     */
    Timer.clearRequestInterval = function(handle) {
        window.cancelRequestAnimationFrame ? window.cancelRequestAnimationFrame(handle.value) :
            window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
                window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
                    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
                        window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(handle.value) :
                            window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
                                clearInterval(handle);
    };

    /**
     * Simulation window.setTimeout
     * @param {function} fn The callback function
     * @param {int} delay The delay in milliseconds
     */
    Timer.RequestTimeout = function(fn, delay) {
        if (!Timer.isSupportRequestAnimationFrame()) {
            return window.setTimeout(fn, delay);
        }

        var start = new Date().getTime();
        var handle = {};

        function loop() {
            var current = new Date().getTime();
            var delta = current - start;

            delta >= delay ? fn.call() : handle.value = Timer.requestAnimationFrame.call(window, loop);
        }

        // requestAnimatFrame must be executed in the context of window
        handle.value = Timer.requestAnimationFrame.call(window, loop);
        return handle;
    };

    /**
     * Simulation window.clearTimeout
     * @param {int|object} handle The callback function
     */
    Timer.clearRequestTimeout = function(handle) {
        window.cancelRequestAnimationFrame ? window.cancelRequestAnimationFrame(handle.value) :
            window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
                window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
                    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
                        window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(handle.value) :
                            window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
                                clearTimeout(handle);
    };
}.call(Lass, window);
