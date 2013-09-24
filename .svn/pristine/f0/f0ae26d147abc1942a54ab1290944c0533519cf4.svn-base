// Copyright 2013 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview MaskSelect
 * @author sheny@made-in-china.com
 * @version v0.1
 */


/**
 * @name MaskSelect
 * @requires Clazz
 * @requires jQuery
 * @constructor initialize
 * @param {Object} options 组件配置
 * @param {Element} options.carrier 模拟select的warp对象
 * @param {String} options.trigger 下拉列表的触发事件 也可通过配置 data-trigger
 * @param {Object} options.control 显示控制
 * @param {Object} style 模拟对象相关样式
 * @example
<div class="choice hover" data-width="0" data-trigger="click" id="demo">
    <!-- real data -->
    <select style="display:none;">
        <!-- 列表中的分割线 data-type="line":生成choice-line样式在dt上面 -->
        <optgroup data-type="line"></optgroup>
    </select>
    <div class="choice-hd"></div>
    <dl class="choice-list">
        <dd class="choice-option"><a href="#" >China</a></dd>
    </dl>
</div>

<script type="text/javascript">
var mask = new MaskSelect({
    carrier : document.getElementById('demo')
});

mask.onchange(function() {
    // do something
})
</script>
 */
;void function() {
    var ISelect = new Abstract(/** @lends MaskSelect */{
        /**
         * 下拉列表选择发生改变时出发，支持重复加入多个触发函数
         * @param {Function} fn
         */
        onchange : function(fn) {},
        /**
         * 通过设置索引来设置当前MaskSelect的选中项
         * @param {Number} index
         */
        selectedIndex : function(index) {},
        /**
         * 返回当前下拉列表所有option对象
         */
        options : function() {},
        /**
         * 返回当前下拉别表中所有optgroup对象
         */
        optgroups : function() {},
        /**
         * 设置当前下拉列表是否为禁用状态
         * @param {Boolean} bol
         */
        disabled : function(bol) {},
        /**
         * 设置当前列表展开和收缩
         */
        unfold : function() {},
        /**
         * 获取当前选中项的值
         */
        value : function() {}
    });

    var options = /** @lends MaskSelect.prototype */{
        carrier : null,
        trigger : 'click',
        control : {
            /**
             * 限制当前下拉列表显示行数(包含optgroup所占行数)，超过则出滚动条
             * <font color=green>options.control.dropRows</font>
             */
            dropRows : null
        },
        style : {
            tagName : 'choice',
            listCls : 'choice-list',
            menuCls : 'choice-hd',
            optCls : 'choice-option',
            optgroupCls : 'choice-optgroup',
            chooseCls : 'selected',
            unfoldCls : 'hover',
            unfoldReverseCls : 'hover-reverse'
        }
    };

    var Select = new Clazz(ISelect, { config: options, inherit: Component }, function(config) {
        this.setConfig(config);
        if (!paramsValidata.call(this)) {
            return;
        }

        initialize.call(this);
        initEvent.call(this);

        this.onchange.implement(this._onchange);
        this.selectedIndex.implement(this._selectedIndex);
        this.disabled.implement(this._disabled);
        this.unfold.implement(this._unfold);
        this.options.implement(this._options);
        this.optgroups.implement(this._optgroups);
        this.value.implement(this._value);
    });

    Select.extend({
        _onchange : function(fn) {
            this._.changeEvents.push(fn);
        },
        _selectedIndex : function(index) {
            if (parseInt(index) > this._.options().length) {
                return;
            }

            this._.selectedIndex = index;
            selectedOption.call(this);
        },
        _disabled : function(bol) {
            this._.disabled = bol;
        },
        _unfold : function() {
            if (!this._.disabled) {
                if (reversePos.call(this)) {
                    this._.showPos = this.config.style.unfoldReverseCls;
                    if (this.elems.$list.css('display') !== 'none') {
                        this.elems.$carrier.addClass(this._.showPos);
                    }
                    this.elems.$carrier.removeClass(this.config.style.unfoldCls);
                } else {
                    this._.showPos = this.config.style.unfoldCls;
                    if (this.elems.$list.css('display') !== 'none') {
                        this.elems.$carrier.addClass(this._.showPos);
                    }
                    this.elems.$carrier.removeClass(this.config.style.unfoldReverseCls);
                }

                this.elems.$carrier.toggleClass(this._.showPos);
                selectedOption.call(this);
            }
        },
        _options : function() {
            if (this.config.style.optCls) {
                return this.elems.$list.find(getClass(this.config.style.optCls));
            }

            return null;
        },
        _optgroups : function() {
            if (this.config.style.optgroupCls) {
                return this.elems.$list.find(getClass(this.config.style.optgroupCls));
            }
        },
        _value : function() {
            return this._.options[this._.selectedIndex].value;
        }
    });

    function paramsValidata() {
        var err = new Error();
        var config = this.config;

        try {
            err.name = 'selectInit';
            if (!config.carrier) {
                err.message = 'Carrier must not be null.';
            }

            if (!config.style.menuCls || !config.style.listCls || !config.style.optCls) {
                err.message = 'Style structure insufficiency.';
            }

            throw err;
        } catch (e) {
            if (window.console && e.message) {
                console.log(e.message);
                return null;
            }
        }

        return true;
    }

    function initialize() {
        this._.selectedIndex = 0;
        this._.triggerEvent = this.config.trigger;
        this._.selectedOption = null;
        this._.optsWidth = null;
        this._.disabled = false;
        this._.changeEvents = [];
        this._.showPos = this.config.style.unfoldCls;

        this.elems.$carrier = $(this.config.carrier);
        this.elems.$menu = this.elems.$carrier.find(getClass(this.config.style.menuCls));
        this.elems.$list = this.elems.$carrier.find(getClass(this.config.style.listCls));

        this._.target = this.elems.$carrier.find('select')[0];
        this._.data = select2Json(this._.target, []);
        this._.options = options2Json(this._.target.options);

        if (this.elems.$carrier.attr('data-trigger')) {
            this._.triggerEvent = this.elems.$carrier.attr('data-trigger');
        }

        if (this.elems.$carrier.attr('data-width')) {
            this._.optsWidth = this.elems.$carrier.attr('data-width');
            this.elems.$list.css('width', this._.optsWidth);
        }

        this.elems.$list.empty();
        this.elems.$list[0].appendChild(createList.call(this, this._.data, document.createDocumentFragment()));
        selectedOption.call(this);

        // 根据限制的行数计算当前应该显示的行高,并且设置的行数小于最大行数
        if (this.config.control.dropRows &&
            this.config.control.dropRows < this._.target.options.length + this._.target.getElementsByTagName('optgroup').length) {
            this.elems.$list.css({
                'overflow' : 'auto',
                'height' : parseInt(this._.selectedOption.outerHeight()) * this.config.control.dropRows
            });
        }
    }

    function initEvent() {
        var _this = this;

        if (this._.triggerEvent === 'click') {
            this.elems.$menu.on(this._.triggerEvent, function(e) {
                e.stopPropagation();
                _this._unfold.call(_this);
            });

            $(document).on('click', function(e) {
                e.stopPropagation();
                _this.elems.$carrier.removeClass(_this._.showPos);
            });
        }

        if (this._.triggerEvent === 'mouseover') {
            this.elems.$carrier.hover(function() {
                _this._unfold.call(_this);
            }, function() {
                _this.elems.$carrier.removeClass(_this._.showPos);
            });
        }

        this.elems.$list.on('mouseover', function(e) {
            _this.elems.$list.find(getClass(_this.config.style.chooseCls)).removeClass(_this.config.style.chooseCls);
        });

        this.elems.$list.on('click', function(e) {
            var index = _this._.selectedIndex;
            e.stopPropagation();

            if (e.target.nodeName.toLowerCase() === 'a') {
                _this._.selectedIndex = getOrder.call(_this, e.target.innerText);
                selectedOption.call(_this);
                _this.elems.$carrier.removeClass(_this._.showPos);
                if (index !== _this._.selectedIndex) {
                    fireChange.call(_this);
                }
            }
        });
    }

    /**
     * maskSelect show position
     * @return {Boolean}
     */
    function reversePos() {
        if (parseInt(this.elems.$carrier.offset().top) + parseInt(this.elems.$list.outerHeight()) + parseInt(this.elems.$menu.outerHeight()) >
            $(window).height() + document.body.scrollTop) {
            return true;
        }
        return false;
    }

    /**
     * selected the mask option
     */
    function selectedOption() {
        if (!this._options()) {
            return;
        }

        this._.selectedOption = this._options().eq(this._.selectedIndex);
        this._options().removeClass(this.config.style.chooseCls);
        this._.selectedOption.addClass(this.config.style.chooseCls);
        this.elems.$menu.find('span').html((getData.call(this) && getData.call(this).name));
        this._.target.selectedIndex = this._.selectedIndex;
    }

    /**
     * get data from cache options
     * @return {Object}
     */
    function getData() {
        if (this._.options[this._.selectedIndex]) {
            return this._.options[this._.selectedIndex];
        }
        return null;
    }

    /**
     * get the click target current order
     * @param txt
     * @return {Number}
     */
    function getOrder(txt) {
        var i, l;
        for (i = 0, l = this._.options.length; i < l; i++) {
            if (txt === this._.options[i].name) {
                return i;
            }
        }

        return -1;
    }

    /**
     * trigger all change events
     */
    function fireChange() {
        if (!this._.changeEvents.length) {
            return;
        }
        var i = 0;
        while(this._.changeEvents[i]) {
            if (this._.changeEvents[i] instanceof Function) {
                this._.changeEvents[i].call(this);
            }
            i++;
        }
    }

    /**
     * create dom list
     * @param {JSON} data
     * @param {DocumentFragment} dfrag
     * @return {DocumentFragment}
     */
    function createList(data, dfrag) {
        var i, l, item, cItem;

        for (i = 0, l = data.length; i < l; i++) {
            item = document.createElement('dd');
            if (data[i].value instanceof Array) {
                var container = document.createElement('dl');
                cItem = document.createElement('dt');

                if (!data[i].value.length && data[i].type) {
                    cItem.className = this.config.style.tagName + '-' + data[i].type;
                    container.appendChild(cItem);
                } else {
                    cItem.innerHTML = data[i].name;
                    container.appendChild(cItem);
                    container.className = this.config.style.optgroupCls;
                    container.appendChild(arguments.callee.call(this, data[i].value, document.createDocumentFragment()));
                }

                item.appendChild(container);
            } else {
                item.className = this.config.style.optCls;
                item.innerHTML = '<a href="javascript:;">'+ data[i].name +'</a>';
            }

            dfrag.appendChild(item);
        }

        return dfrag;
    }

    /**
     * Serialization select options
     * @param options
     * @return {Array}
     */
    function options2Json(options) {
        var i, l, data = [];

        for (i = 0, l = options.length; i < l; i++) {
            data.push({
                name : options[i].text,
                value : options[i].value
            });
        }
        return data;
    }

    /**
     * convert select options value to JSON
     * @param {Element} node Select
     * @param {Array} data
     * @return {Array}
     */
    function select2Json(node, data) {
        if (!node) {
            return null;
        }
        var items = node.childNodes, i, item;

        for (i = 0; i < items.length; i++) {
            if (items[i] && items[i].nodeType === 1) {
                if (items[i].nodeName.toLowerCase() === 'optgroup') {
                    item = {
                        name : items[i].label,
                        value : arguments.callee(items[i], [])
                    };

                    if (items[i].getAttributeNode('data-type')) {
                        item.type = items[i].getAttributeNode('data-type').nodeValue;
                    }
                } else {
                    item = {
                        name : items[i].text,
                        value : items[i].value
                    };
                }

                data.push(item);
            }
        }

        return data;
    }

    /**
     * convert className to correct query string
     * @param {String} cls
     * @return {String}
     */
    function getClass(cls) {
        if (cls.substring(0, 1) === '.') {
            return cls;
        } else {
            return '.'+ cls;
        }
    }

    window.MaskSelect = Select;
}.call(window);


