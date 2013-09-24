// Copyright 2012 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview ie && ff 3.5 support placeholder
 * @author sheny@made-in-china.com
 * @version v1.1
 */

/**
 * @name Placeholder
 * @class ie6,7,8,9 && ff 3.5 input|textarea support placeholder
 * @requires Clazz
 * @requires Lass
 * @constructor initialize
 * @param {Object} config 组件配置
 * @param {Element|Array} config.carrier <font color=red>*</font> 对象载体或者载体数组
 * @param {Object} config.control 显示控制层
 * @param {Boolean} config.control.unifieddisplay, 是否统一浏览器显示
 * @example
    var p = new Placeholder({
        carrier : {Element}|[Element],
        control : { unifieddisplay : false },
        style : { color : 'red', fontFamily : 'Arial' }
    });

    p.onchange(function() {
        // todo something
    });

    p.show();
    p.hide();
    p.setPlaceholder('tester placeholder');

    // 这里会返回所有带placeholder的input和textarea对象的一个集合
    Placeholer.initPage({
        control : { unifieddisplay : false }
    })
 */
(function(window) {
    var IPlaceholder = new Abstract(/** @lends Placeholder */{
        /**
         * reset placeholder value
         * @param {String} content
         */
        setPlaceholer : function(content) {},
        /**
         * 控制placeholder的input或textarea对象的显示
         */
        show : function() {},
        /**
         * 控制placeholder的input或textarea对象的隐藏
         */
        hide : function() {},
        /**
         * initialize all the placeholder form elements(静态方法)
         * @param {Config} config
         */
        initPage : function(config) {},
        /**
         * 暗注释值改变事件(仅当值发生改变时才会触发)
         * @param {Function} callback
         */
        onchange : function(callback) {}
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
            unifieddisplay : false,
            /**
             * 暗注释的获得焦点之后的展现形式
             * 默认为获得焦点自后暗注释自动消失。
             * Explicit and implicit methods(显隐方式) 支持属性有 [focus|input]
             * @type Config.control.emMethod
             * @default 'focus'
             */
            emMethod : 'focus'
        },
        style : /** @memberOf control */{
            /**
             * 显示的placeholder颜色
             * @type Config.style.color
             * @default #BBB
             */
            color : '#BBB',
            /**
             * 显示placeholder字体
             * @type Config.style.fontFamily
             * @default
             */
            fontFamily : ''
        }
    };

    var Placeholder = new Clazz(IPlaceholder, { config : c, inherit : Component }, function(c) {
        this.setConfig(c);
        this._.support = 'placeholder' in document.createElement('input');
        this._.placeholder = null;

        this.setPlaceholer.implement(this._setPlaceholder);
        this.show.implement(this._show);
        this.hide.implement(this._hide);
        this.onchange.implement(this._onchange);
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
            if (Object.prototype.toString.call(config.carrier) == '[object Array]') {
                var list = [], i, l, item;
                for (i = 0, l = config.carrier.length; i < l; i++) {
                    item = config.carrier[i];
                    if (!!(item && item.nodeType === 1)) {
                        list.push(new Placeholder(_Extend({ carrier : item }, config, false)));
                    }
                }

                return list;
            }

            // check input has placeholder attribute
            if (!config.carrier.getAttribute('placeholder')) {
                throw new Error('Element not has placeholder!');
            }

            Main.call(this);
        },
        _setPlaceholder : function(con) {
            var isChange = (con != this._.placeholder);
            this._.placeholder = con;
            if (!this.config.control.unifieddisplay) {
                this.elems.carrier.setAttribute('placeholder', con);
            }

            if (!this._.support && this.elems.carrier.value === '') {
                this.elems.label.innerHTML = con;
            }
            if (isChange) {
                this.fire('change');
            }
        },
        _show : function() {
            if (this.elems.label) {
                this.elems.label.style.display = '';
            }

            this.elems.carrier.style.display = '';
        },
        _hide : function() {
            if (this.elems.label) {
                this.elems.label.style.display = 'none';
            }

            this.elems.carrier.style.display = 'none';
        },
        _onchange : function(callback) {
            if (callback) {
                this.on('change', callback);
            }
        }
    });

    Placeholder.initPage = function(config) {
        var ps = [], items, i, l;
        if (document.querySelectorAll) {
            items = document.querySelectorAll('input[placeholder]');
            for (i = 0, l = items.length; i < l; i++) {
                ps.push(items[i]);
            }

            items = document.querySelectorAll('textarea[placeholder]');
            for (i = 0, l = items.length; i < l; i++) {
                ps.push(items[i]);
            }
        } else {
            items = document.getElementsByTagName('input');
            for(i = 0, l = items.length; i < l; i++) {
                if (items[i].placeholder) {
                    ps.push(items[i]);
                }
            }

            items = document.getElementsByTagName('textarea');
            for(i = 0, l = items.length; i < l; i++) {
                if (items[i].placeholder) {
                    ps.push(items[i]);
                }
            }
        }

        if (!ps.length) return;

        return new Placeholder(_Extend({ carrier : ps }, config, false));
    };

    // 初始化所有参数
    function Main() {
        var config = this.config;
        this.elems.carrier = config.carrier;
        this._.placeholder = config.carrier.getAttribute('placeholder');
        this._.name = config.carrier.name || '';

        if (config.control.unifieddisplay) {
            config.carrier.removeAttribute('placeholder');
            this._.support = false;
        }

        if (this._.support) return;

        // 用于label for
        if (!config.carrier.id) {
            config.carrier.id = 'p_'+ new Date().getTime();
        }

        this._.id = config.carrier.id;
        this.elems.label = createLabel.call(this, config.carrier);

        if (config.carrier.value === '') {
            this.elems.label.innerHTML = this._.placeholder;
        }
        config.carrier.parentNode.insertBefore(this.elems.label, config.carrier);
        initEvent.call(this);
    }

    // initialize events
    function initEvent() {
        var that = this;
        var lb = this.elems.label;
        var carrier = this.elems.carrier;

        carrier.onblur = (function() {
            return function() {
                blurEvent.call(that,  lb);
            };
        }());

        if (this.config.control.emMethod === 'input') {
            // IE
            carrier.onpropertychange = (function() {
                return function() {
                    blurEvent.call(that, lb);
                };
            }());

            // W3C
            carrier.oninput = (function() {
                return function() {
                    blurEvent.call(that, lb);
                };
            }());
        } else {
            carrier.onfocus = (function() {
                return function() {
                    focusEvent.call(that, lb);
                };
            }());
        }
    }

    function focusEvent(lb) {
        lb.innerHTML = '';
    }

    function blurEvent(lb) {
        if (this.elems.carrier.value === '') {
            lb.innerHTML = this._.placeholder;
        } else {
            lb.innerHTML = '';
        }
    }

    /**
     * create label & style
     * @param {Element} el
     * @return {Element}
     * @private
     */
    function createLabel(el) {
        var padding, margin, fontSize, bt, bl, mt, pl;
        var label = document.createElement('label');
        label.htmlFor = this._.id;

        padding = getStyle(el, 'padding');
        margin = getStyle(el, 'margin');
        fontSize = getStyle(el, 'fontSize');
        pl = getStyle(el, 'paddingLeft');
        bt = getStyle(el, 'borderTopWidth');
        bl = getStyle(el, 'borderLeftWidth');
        mt = getStyle(el, 'marginTop');

        // FF3.6 has not value of margin if not write margin only marginTop
        if (!margin) {
            margin = getComputedStyle(el, null).marginTop + ' 0';
        }
        // end
        // FF can't get padding
        if (!padding) {
            padding = getStyle(el, 'paddingTop') + ' ' + getStyle(el, 'paddingRight') + ' ' +
                getStyle(el, 'paddingBottom') + ' ' + getStyle(el, 'paddingLeft');
        }
        //end

        // fixed
        if (parseInt(bt) !== 0) {
            mt = (mt === 'auto' ? 1 : mt);
            mt = parseInt(mt) + parseInt(bt) +'px';
        }

        if (parseInt(bl) !== 0) {
            pl = (pl === 'auto' ? 0 : pl);
            pl = parseInt(bl) + parseInt(pl) + 'px';
        }

        label.style.cssText = 'position:absolute; color:'+ this.config.style.color +'; cursor:text; padding:' + padding +'; padding-left:'+ pl +
            '; margin:' + margin +'; margin-top:' + mt +'; font-size:' + fontSize + '; font-family:' + this.config.style.fontFamily;

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
        return el.currentStyle ? el.currentStyle[name] : window.getComputedStyle(el, null)[name];
    }


    /**
     * simple extend override destination
     * @param destination {Object} 目标对象
     * @param source {Object} 源对象
     * @param override {Boolean} 是否覆盖目标对象同名属性
     * @return {Object}
     * @private
     */
    function _Extend(destination, source, override) {
        if (typeof override == "undefined") override = true;
        for (var property in source) {
            if (Object.prototype.toString.call(source[property]) === 'Object') {
                arguments.callee(destination, source[property]);
            } else {
                if (!destination[property] || override) {
                    destination[property] = source[property];
                }
            }
        }

        return destination;
    }

    window.Placeholder = Placeholder;
}(window));