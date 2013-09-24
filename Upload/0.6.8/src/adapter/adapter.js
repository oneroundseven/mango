;void function($, undefined){
	if(!$){
		return;
	}
	
	var util = this.util;
	var uuid = this.UUID;
	var order = 0;
	var upload = this.widget.Upload;
	
	util.query = function(selector){
		return [].slice.call($(selector));
	};
	
	var ATTRS = 'mode,action,name,accept,description,size,queue,multiple,timeout,charset,debug,text,params,plugins'.split(',');
	var SPECIAL = {
		params: 'json',
		queue: 'int',
		timeout: 'int',
		mode: 'array',
		text: 'buttonText',
		debug: 'has',
		multiple: 'has'
	};
	
	var SPECIAL_PROCESSORS = {
		json: function(str){
			return util.JSON.parse(str);
		},
		'int': function(str){
			return (parseInt(str) || 0);
		},
		array: function(str){
			return str.split(/[,;\s]+/);
		},
		bool: function(str){
			return util.trim(str) === 'true';
		},
		buttonText: function(str){
			return { text: str };
		},
		has: function(str, $el, key){
			return (str !== undefined || (key in $el[0]));
		}
	};
	
	var DIC_ATTR2CFG = {
		mode: 'priority',
		action: 'uploadURL',
		name: 'filePostName',
		accept: 'fileTypes',
		size: 'sizeLimit',
		queue: 'queueLimit',
		params: 'postParams',
		text: 'button'
	};
	
	var getAttr = function($el, key, cfg){
		var val = $el.attr(key);
		val = (key in SPECIAL) ? SPECIAL_PROCESSORS[ SPECIAL[key] ](val, $el, key, cfg) : val;
		
		if(val !== undefined){
			cfg[ DIC_ATTR2CFG[key] || key ] = val;
		}
	};
	
	var getConfig = function(el){
		var $el = $(el);
		var cfg = {};
		
		for(var i = 0; i < ATTRS.length; i++){
			getAttr($el, ATTRS[i], cfg);
		}
		
		return cfg;
	};
	
	$.fn.Upload = function(cfg){
		var instances = [];
		var config;
		
		this.each(function(i, el){
			config = getConfig(el);
			instances.push(new upload(util.extend(true, {}, config, cfg, { placeholder: el })));
		});
		
		return instances;
	};
	
}.call(FOCUS, window.jQuery);