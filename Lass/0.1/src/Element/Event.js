
;void function() {
    var Event = function() {
        this.listeners = {};
    };

    Event.prototype = {
        constructor : this,
        /**
         * @param {String} type
         * @param {Function} fn
         */
        on : (function() {
            if (window.addEventListener) {
                return function(type, fn) {
                    // 默认采用冒泡统一浏览器的机制
                    this.addEventListener(type, fn, false);

                };
            } else if(window.attachEvent) {
                return function(type, fn) {
                    var el = this;
                    this.attachEvent('on' + type, function() {
                        fn.call(el);
                    });
                };
            }
        }()),
        /**
         * @param {String} type
         * @param {Function} fn
         */
        off : (function() {
            if (window.addEventListener) {
                return function(type, fn) {
                    this.removeEventListener(type, fn, false);
                };
            } else if (window.attachEvent) {
                return function(type, fn) {

                    this.detachEvent('on' + type, fn);
                };
            }
        }()),
        hasEvent : function() {},
        trigger : function() {}
    };

    this.LE = Event;
}.call(lass);