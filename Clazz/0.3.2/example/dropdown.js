// Copyright 2012 FOCUS Inc.All Rights Reserved.

;void function($){
	// 抽象接口
    var IDropDown = new Abstract({
        show: function(){},
        hide: function(){}
    });

	// 默认配置
    var config = {
        /**
         * 元素占位
         * @type Element
         */
        carrier: null,
        /**
         * drop fire Event support ['mouseover', 'click']
         * @default mouseover
         * @type String
         */
        trigger: '',
        arrUp: '&#xf0d8;',
        arrRight: '(&#xf0da;',
        arrDown: '&#xf0d7;',
        arrLeft: '&#xf0d9;',
        style: {
            hoverCls: 'hover',
            dropMenu: 'dropmenu-hd',
            dropList: 'dropmenu-list',
            arr: 'icon'
        }
    };

	// 类声明
    var DropDown = new Clazz(IDropDown, { config: config, inherit: Component }, function(cfg){
        this.setConfig(cfg);
		var cfg = this.config;
		
        if(cfg.carrier === null || !cfg.carrier.length) {
            return;
        }

        if(cfg.style.dropMenu === '' || cfg.style.dropList === ''){
            return;
        }
		
		this.init();
    });
	
	// api 实现
	DropDown.extend({
		init: function(){
			var that = this;
			var cfg = this.config;
			
			var $carrier = this.elems.$carrier = $(cfg.carrier);
			this.elems.$menu = $carrier.find('.' + cfg.style.dropMenu);
			this.elems.$list =$carrier.find('.' + cfg.style.dropList);
			this.elems.$arr = this.elems.$menu.find('.' + cfg.style.arr);

			this.elems.$menu.bind(cfg.trigger || 'mouseover', function(){
				that.show();
			});

			$carrier.bind('mouseleave', function(){
				that.hide();
			});
		},
		show: function(){
			var cfg = this.config;
			this.elems.$carrier.addClass(cfg.style.hoverCls);
			this.elems.$arr.html(cfg.arrUp);
			
			this.fire('show');
		},
		hide: function(){
			var cfg = this.config;
			this.elems.$carrier.removeClass(cfg.style.hoverCls);
			this.elems.$arr.html(cfg.arrDown);
			
			this.fire('hide');
		}
	});
	
	// 导出类名
	window.DropDown = DropDown;
}.call(Lass, jQuery);