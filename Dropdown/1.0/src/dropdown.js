// Copyright 2012 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview DropDown
 * @author sheny@made-in-china.com
 * @version v1.0
 */

// 键盘事件
// 多选select

/**
 * @name DropDown
 * @class DropDown Class
 * @requires jQuery
 * @requires Clazz
 * @requires Lass
 * @constructor initialize
 * @param {Object} config 组件配置
 * @param {Element} config.carrier *, 对象载体
 * @param {Object} style, 元素样式配置
 * @param {Object} control, 显示控制
 * @param {String} trigger, 触发方式
 * @example
    new DropDown({
        carrier : document.getElementById('test'),
        style : {
            dropMenu:'cls',
            dropList:'cls',
            hoverCls:'cls',
            arr:''
        }
    })
 */
;void function ($) {
    // 抽象接口
    var IDropDown = new Abstract(/** @lends DropDown */{
        /**
         * 显示对应的droplist
         */
        show: function () {},
        /**
         * 隐藏对应的droplist
         */
        hide: function () {}
    });

    // 默认配置
    var c = /** @lends DropDown.prototype */{
        /**
         * config.carrier <font color=red>*</font>
         * 对象载体
         * @type Element
         * @default null
         */
        carrier: null,
        /**
         * <font color=green>config.trigger</font>
         * drop fire Event support ['mouseover', 'click']
         * @type String
         * @default mouseover
         */
        trigger: 'mouseover',
        /**
         * <font color=darkgreen>config.arrIcons</font>
         * 箭头图标
         * @type Object arrIcons
         */
        arrIcons : /** @memberOf config */{
            /**
             * <font color=green>config.arrIcons.up</font>
             * 向上的图标
             * @type String
             * @default &#xf0d8;
             */
            up: '&#xf0d8;',
            /**
             * <font color=green>config.arrIcons.right</font>
             * 向右的图标
             * @type String
             * @default &#xf0da;
             */
            right: '&#xf0da;',
            /**
             * <font color=green>config.arrIcons.down</font>
             * 向下的图标
             * @type String
             * @default &#xf0d7;
             */
            down: '&#xf0d7;',
            /**
             * <font color=green>config.arrIcons.left</font>
             * 向左的图标
             * @type String
             * @default &#xf0d9;
             */
            left: '&#xf0d9;'
        },
        /**
         * <font color=darkgreen>config.style</font>
         * 样式结构
         * @type Object
         */
        style: /** @memberOf style */{
            /**
             * <font color=green>config.style.hoverCls</font> <font color=red>*</font>
             * DropDown 下拉列表展现所需要的Class
             * @type String
             * @default Empty
             */
            hoverCls: '',
            /**
             * <font color=green>config.style.dropMenu</font> <font color=red>*</font>
             * DropDown 按钮
             * @type String
             * @default Empty
             */
            dropMenu: '',
            /**
             * <font color=green>config.style.dropList</font> <font color=red>*</font>
             * DropDown 下拉列表
             * @type String
             * @default Empty
             */
            dropList: '',
            /**
             * <font color=green>config.style.arr</font>
             * DropDown 箭头DOM
             * @type String
             * @default Empty
             */
            arr: ''
        }
    };

    // 类声明
    var DropDown = new Clazz(IDropDown, { config: c, inherit: Component }, function (c) {
        this.setConfig(c);

        this.show.implement(this._show);
        this.hide.implement(this._hide);
        this.initialize();
    });

    // 私有变量
    var $carrier, that;
    // api 实现
    DropDown.extend({
        // 校验并初始化参数
        initialize: function () {
            var config = this.config;

            if (!config.carrier) {
                throw new Error('DropDown not support with carrier null!');
            }

            if (config.style.hoverCls === '' || config.style.dropMenu === '' || config.style.dropList === '') {
                throw new Error('DropDown dropMenu & dropList & hoverCls must not be empty!');
            }

            that = this;
            this.elems.$carrier = $carrier = $(config.carrier);
            this.elems.$menu = $carrier.find('.' + config.style.dropMenu);
            this.elems.$list = $carrier.find('.' + config.style.dropList);
            this.elems.$arr = this.elems.$menu.find('.' + config.style.arr);

            this.elems.$menu.bind(config.trigger, function () {
                that.show();
            });

            $carrier.bind('mouseleave', function () {
                that.hide();
            });
        },
        _show: function () {
            var config = this.config;
            this.elems.$carrier.addClass(config.style.hoverCls);
            this.elems.$arr.html(config.arrIcons.up);

            // 与继承对象绑定的on事件对应
            this.fire('show');
        },
        _hide: function () {
            var config = this.config;
            this.elems.$carrier.removeClass(config.style.hoverCls);
            this.elems.$arr.html(config.arrIcons.down);

            // 与继承对象绑定的on事件对应
            this.fire('hide');
        }
    });

    // 导出类名
    window.DropDown = DropDown;
}.call(Lass, jQuery);