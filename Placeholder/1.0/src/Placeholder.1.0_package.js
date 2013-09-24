// Copyright 2012 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview ie && ff 3.5 support placeholder
 * @author sheny@made-in-china.com
 * @version v1.0
 */

/**
 * @name Placeholder
 * @class ie6,7,8,9 && ff 3.5 input|textarea support placeholder
 * @requires Clazz
 * @requires Lass
 * @constructor initialize
 * @param {Object} config 组件配置
 * @param {Element|Array} config.carrier <font color=red>*</font> 对象载体或者载体数组
 * @param {Function} config.onchange 暗注释值改变后触发
 * @param {Object} config.control 显示控制层
 * @param {Boolean} config.control.unifieddisplay, 是否统一浏览器显示
 * @example
    new Placeholder({
        carrier : {Element}
        onchange : function() {
        // to do
        }
    });

    new Placeholder({
        carrier : [{Element}]
        onchange : function() {
        // to do
        }
    });
 */
(function(window) {
    var IPlaceholder = new Abstract({
        /**
         * reset placeholder value
         * @param {String} str
         */
        setValue : function(str) {}
    });

    var c = /** @lends Placeholder.prototype */{
        /**
         * 对象载体或者载体数组
         * @type Element|Array
         * @default null
         */
        carrier : null,
        /**
         * 显示控制层
         * @type Object control
         * @default : null
         */
        control : /** @memberOf control*/{
            /**
             * 是否统一所有浏览器显示，
             * 默认支持placeholder浏览器使用浏览器自带暗注释功能
             * 不支持placeholder的浏览器才进行模拟显示
             * @type Config.control.unifieddisplay
             * @default false
             */
            unifieddisplay : false
        },
        /**
         * 暗注释值发生改变后触发
         * @type Function
         * @default null
         */
        onchange : null
    };

    var label = null;
    var carrier = null;
    var placeholder = '';
    var Placeholder = new Clazz(IPlaceholder, { config : c, inherit : Component }, function(c) {
        this.setConfig(c);
        this._.support = 'placeholder' in document.createElement('input');
        this._.placeholder = null;

        this.setValue.implement(this._setValue);
        return this.initialize();
    });

    Placeholder.extend({
        // 初始化校验config, 初始化默认参数
        initialize : function() {
            var config = this.config;
            if (!config.carrier) {
                throw new Error('Placeholder not support with carrier null!');
            }

            // check array carriers
            if (Lass.Array.isArray(config.carrier)) {
                var list = [], i, l, item;
                for (i = 0, l = config.carrier.length; i < l; i++) {
                    item = config.carrier[i];
                    if (Lass.Element.isElement(item)) {
                        list.push(new Placeholder(Lass.util.extend(true, {}, config, { carrier : config.carrier[i] })));
                    }
                }

                return list;
            } else {
                this.elems.carrier = carrier = config.carrier;
            }

            // check input has placeholder attribute
            if (!carrier.getAttribute('placeholder') || !carrier.getAttribute('id')) {
                throw new Error('Element not has placeholder || id attribute!');
            }

            this._.placeholder = placeholder = carrier.getAttribute('placeholder');

            if (config.control.unifieddisplay) {
                this._.support = false;
                carrier.setAttribute('placeholder', '');
            }
            if (this._.support) return;

            Main.call(this);
        },
        _setValue : function(con) {
            this._.placeholder = con;
            if (!this.config.control.unifieddisplay) {
                this.elems.carrier.setAttribute('placeholder', con);
            }

            if (!this._.support && this.elems.carrier.value === '') {
                this.elems.label.innerHTML = con;
            }
            this.fire('change');
        }
    });

    function Main() {
        if (this.config.onchange) {
            this.on('change', this.config.onchange);
        }

        this.elems.label = label = createLabel(carrier);
        if (carrier.value === '') {
            label.innerHTML = placeholder;
        }
        carrier.parentNode.insertBefore(label, carrier);
        initEvent.call(this);
    }

    function initEvent() {
        var that = this;
        carrier.onfocus = (function() {
            var _lb = label;
            return function() {
                focusEvent.call(this, _lb);
            };
        }());

        carrier.onblur = (function() {
            var _lb = label;
            return function() {
                blurEvent.call(that, carrier, _lb);
            };
        }());
    }

    function focusEvent(lb) {
        lb.innerHTML = '';
    }

    function blurEvent(input, lb) {
        if (input.value === '') {
            lb.innerHTML = this._.placeholder;
        }
    }

    /**
     * create label & style
     * @param {Element} el
     * @return {Element}
     * @private
     */
    function createLabel(el) {
        var padding, margin, fontSize, bt, bb, mt;
        label = document.createElement('label');
        label.id = getLabelId();
        label.htmlFor = carrier.id;

        padding = getStyle(el, 'padding');
        margin = getStyle(el, 'margin');
        fontSize = getStyle(el, 'fontSize');
        bt = getStyle(el, 'borderTopWidth');
        bb = getStyle(el, 'borderBottomWidth');
        mt = getStyle(el, 'marginTop');

        // FF3.6 has not value of margin if not write margin only marginTop
        if (!margin) {
            margin = getComputedStyle(el, null).marginTop + ' 0';
        }
        // end

        // fixed
        if (parseInt(bt) !== 0 || parseInt(bb) !== 0) {
            mt = (mt === 'auto' ? 0 : mt);
            mt = parseInt(mt) + parseInt(bt) + parseInt(bb) +'px';
        }

        label.style.cssText = 'position:absolute; color:#CCC; cursor:text; line-height:1; padding:' +
            padding + '; margin:' + margin +'; margin-top:' + mt +'; font-size:' + fontSize;

        return label;
    }

    /**
     * get Style of Element
     * @param {Element} el
     * @param {String} name
     * @return {*}
     * @private
     */
    function getStyle(el, name) {
        return el.currentStyle ? el.currentStyle[name] : getComputedStyle(el, null)[name];
    }

    /**
     * @private
     * @return {String}
     */
    function getLabelId() {
        return 'placeholder_' + new Date().getTime();
    }

    window.Placeholder = Placeholder;
}(window));