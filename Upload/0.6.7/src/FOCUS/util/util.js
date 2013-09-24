;void function(window, document, undefined){
	FOCUS.namespace('FOCUS.util');
	
	/**
	* type
	*/
	FOCUS.util.type = function(o){
		var _type;
		var r_native = /\{\s*\[native\s*code\]\s*\}/i;
		
		if(o === null){
			//for IE, use toString, it's '[object Object]'
			//for FF/Opera, it's '[object Window]'
			_type = 'null';
		}else if(typeof o === 'undefined'){
			//for IE, use toString, it's '[object Object]'
			//for FF/Opera, it's '[object Window]'
			_type = 'undefined';
		}else{
			_type = Object.prototype.toString.call(o).match(/\w+/g)[1].toLowerCase();
			
			//IE native function
			if(_type === 'object' && r_native.test(o + '')){
				_type = 'function';
			}
		}
		
		return _type;
	};
	
	/*
	* trim
	*/
	FOCUS.util.trim = function(str){
		return (str + '').replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, '');
	};
	
	/*
	* JSON
	*/
	FOCUS.util.JSON = function(JSON){
		var _JSON = {};
		if(JSON){
			_JSON.stringify = JSON.stringify;
		}else{
			_JSON.stringify = function(){ return '' };
		}
		
		_JSON.parse = function(jsonStr){
			var ret;
			
			if(FOCUS.util.type(jsonStr) === 'string'){
				try{
					ret = new Function('return ' + jsonStr)();
				}catch(ex){
					ret = {};
				}
			}else{
				ret = jsonStr;
			}
			
			return ret;
		};
		
		return _JSON;
	}.call(this, window.JSON);
	
	
	/**
	* browser
	*/
	FOCUS.util.browser = function(ua){
		var r_msie = /msie\s*(\d+\.\d+)/;
		var r_ff = /firefox\/(\d+\.\d+)/;
		var r_webkit = /webkit\/(\d+\.\d+)/;
		var r_chrome = /chrome\/(\d+\.\d+)/;
		var r_safari = /safari\/(\d+\.\d+)/;
		var r_opera = /opera/;
		var r_ver = /version\/(\d+\.\d+)/;
		
		var ret = {};
		var match;
		
		match = r_msie.exec(ua);
		if(match){
			ret.msie = true;
			ret.version = match[1];
			
			return ret;
		}
		
		match = r_ff.exec(ua);
		if(match){
			ret.mozilla = ret.firefox = true
			ret.version = match[1];
			
			return ret;
		}
		
		match = r_webkit.exec(ua);
		if(match){
			ret.webkit = true;
			ret.version = match[1];
			
			if(window.chrome){
				ret.chrome = true;
				ret.version = r_chrome.exec(ua)[1];
				
				return ret;
			}
			
			match = r_safari.exec(ua);
			if(match){
				ret.safari = true;
				ret.version = [1];
			}
			
			return ret;
		}
		
		match = r_opera.exec(ua);
		if(match && window.opera){
			ret.opera = true;
			ret.version = r_ver.exec(ua)[1];
		}

		return ret;
		
	}.call(this, window.navigator.userAgent.toLowerCase());
	
	/*
	* flash plugin
	*/
	FOCUS.util.flash = function(nav, plugins){
		var flash = {
			has: false,
			version: 0
		};

		//flash check
		var SHOCKWAVE_FLASH = "Shockwave Flash";
		var SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash";
		var FLASH_MIME_TYPE = "application/x-shockwave-flash";
		
		if(plugins.length && plugins[SHOCKWAVE_FLASH]){
			if (plugins[SHOCKWAVE_FLASH].description && !(typeof nav.mimeTypes !== 'undefined' && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
				flash = {
					has: true,
					version: /\d+\.\d+/.exec(plugins[SHOCKWAVE_FLASH].description)[0]
				};
			}
		}else if(window.ActiveXObject){
			var ax;
			var rv = /\d+/g;

			try{
				ax = new ActiveXObject(SHOCKWAVE_FLASH_AX);
			}catch(ex){}

			if(ax){
				rv.exec('');
				flash = {
					has: true,
					version: ax.GetVariable("$version").match(rv).join('.')
				};
			}
		}
		
		return flash;
	}.call(this, window.navigator, window.navigator.plugins);
	
	/**
	* extend
	*/
	FOCUS.util.extend = function(){
		var me = arguments.callee;
		var start, override;

		if(FOCUS.util.type(arguments[0]) !== 'object'){
			start = 1;
			override = !!arguments[0];
		}else{
			start = 0;
			override = false;
		}

		var tar = arguments[start] || {};
		var args = [].slice.call(arguments, start + 1);
		
		var tmp;
		var type;
		while(args.length){
			tmp = args.shift();
			if(FOCUS.util.type(tmp) !== 'object'){
				continue;
			}
			
			var t;
			for(var key in tmp){
				t = tmp[key];
				
				if(FOCUS.util.type(t) === 'object'){
					if(t == window || t == document || ('childNodes' in t && 'nextSibling' in t && 'nodeType' in t)){
						if(!(!override && (key in tar))){
							tar[tar] = t;
						}
						
						continue;
					}
					
					type = FOCUS.util.type(tar[key]);
					if(!(key in tar) || type === 'undefined' || type === 'null'){
						tar[key] = {};
					}
					
					if(FOCUS.util.type(tar[key]) === 'object'){
						me(override, tar[key], t);
					}
				}else if(!(!override && (key in tar))){
					tar[key] = t;
				}
				
			}
		}
		
		return tar;
	};
	
	/*
	* log4js
	*/
	FOCUS.util.console = function(console){
		var logStat = false;
		var noop = function(){};
		
		var SWITCH = {
			ON: true,
			OFF: false
		};
		
		var _loger = {
			SWITCH: SWITCH,
			turn: function(stat){
				logStat = SWITCH[!!stat ? 'ON' : 'OFF'];
			},
			log: noop,
			info: noop,
			warn: noop,
			error: noop,
			debug: noop
		};
		
		if(!console){
			return _loger;
		}
		
		if(!console.debug){
			console.debug = console.log;
		}
		
		if(!console.error){
			console.error = console.warn;
		}
		
		return FOCUS.util.extend(true, _loger, {
			log: function(msg){
				if(logStat === SWITCH.ON){
					console.log(msg);
				}
			},
			info: function(msg){
				if(logStat === SWITCH.ON){
					console.info(msg);
				}
			},
			warn: function(msg){
				if(logStat === SWITCH.ON){
					console.warn(msg);
				}
			},
			error: function(msg){
				if(logStat === SWITCH.ON){
					console.error(msg);
				}
			},
			debug: function(msg){
				if(logStat === SWITCH.ON){
					console.debug(msg);
				}
			}
		});
	}.call(window, window.console);
	
	/*
	* indexOf
	*/
	FOCUS.util.indexOf = function(items, value){
		if(items.indexOf){
			return items.indexOf(value);
		}
		
		var ret = -1;
		var i = 0, len = items.length;
		for(; i < len; i++){
			if(items[i] === value){
				ret = i;
				break;
			}
		}
		
		return ret;
	};
	
	/*
	* unique array
	*/
	FOCUS.util.unique = function(arr){
		var ret = [];
		
		for(var i = 0, len = arr.length; i < len; i++){
			if(FOCUS.util.indexOf(ret, arr[i]) === -1){
				ret.push(arr[i]);
			}
		}
		
		return ret;
	};
	
	/*
	* random  -- Int
	*/
	FOCUS.util.random = function(){
		var cache = {};
		
		return function(min, max, clear){
			min = min || 0;
			max = FOCUS.util.type(max) === 'number' && !isNaN(max)
				? max === min
					? max + 10
					: max
				: min + 10;
			
			var group = min + '_' + max;
			
			if(!cache[group]){
				cache[group] = [];
			}
			
			if(cache[group].length === max - min){
				cache[group] = [];
				FOCUS.util.type(clear) === 'function' && clear.call(this);
			}
			
			var ret;
			while(true){
				ret = min + ~~(Math.random() * (max - min));
				if(FOCUS.util.indexOf(cache[group], ret) === -1){
					cache[group].push(ret);
					break;
				}
			}
			
			return ret;
		};
	}.call(this);
	
	/**
	* create element
	*/
	FOCUS.util.createElement = function(){
		var closeSelf = ',meta,base,link,img,input,br,hr,area,sharp,';
	
		var tagStrConstructor = function(config){
			var cfg = FOCUS.util.extend(true, {}, config);
			
			var fragment = ['<', cfg.el];
			var el = cfg.el;
			delete cfg.el;
			
			for(var name in cfg){
				fragment.push(' ', name, '="', cfg[name], '"');
			}
			
			fragment.push((closeSelf.indexOf(',' + el + ',') === -1 ? ('></' + el + '>') : ' />'));
			
			return fragment.join('');
		};
		
		//elems generator
		var _createElem = function(config){
			var cfg = {};
			FOCUS.util.extend(true, cfg, config);
			
			var el = tagStrConstructor(cfg);
			var elem;

			var fail = false;
			
			try{
				elem = document.createElement(el);
			}catch(ex){
				fail = true;
				elem = document.createElement(cfg.el);
				delete cfg.el;
			}
			
			if(fail){
				for(var key in cfg){
					elem[key] = cfg[key];
				}
			}
			
			if(elem.tagName.toLowerCase() === 'input'){
				var type = cfg.type ? cfg.type : 'text';
				elem.type = type;
			}
			
			return elem;
		};
		
		return _createElem;
	}.call(this);
	
	/*
	* event
	*/
	FOCUS.util.event = function(){
		var __bind = function(standard){
			return standard
				? function(elem, type, event){
					elem.addEventListener(type, event, false);
				}
				: function(elem, type, event){
					elem.attachEvent('on' + type, event);
				}
		}.call(this, !!window.addEventListener);
		
		var __remove = function(standard){
			return standard
				? function(elem, type, event){
					elem.removeEventListener(type, event);
				}
				: function(elem, type, event){
					elem.detachEvent('on' + type, event);
				}
		}.call(this, !!window.removeEventListener);
		
		var prefix = 'FOCUS_EVENTS_'
		var uuid = (new Date).valueOf();
		var group = prefix + uuid;
		
		var execEvent = function(e, events){
			for(var i = 0, len = events.length; i < len; i++){
				events[i].handler.apply(this, [e].concat(events[i].params));
			}
		};
		
		var find = function(events, event){
			var ret = -1;
			for(var i = 0, len = events.length; i < len; i++){
				if(events[i].handler === event){
					ret = i;
					break;
				}
			}
			
			return ret;
		};
		
		var _bind = function(elem, type, event){
			if(!elem[group]){
				elem[group] = {};
			}
			
			var events = elem[group];
			
			if(!events[type]){
				events[type] = [];
				__bind(elem, type, function(e){
					e = e || window.event;
					
					execEvent.call(elem, e, events[type]);
				});
			}
			
			events[type].push({
				handler: event,
				params: [].slice.call(arguments, 3)
			});
		};
		var _remove = function(elem, type, event){
			if(!elem[group] || (elem[group] && !elem[group][type]) || (elem[group] && !elem[group][type].length)){
				return; 
			}
			
			var events = elem[group][type];
			if(!event){
				events = [];
				return;
			}
			
			var index = find(events, event);
			if(index == -1){
				return;
			}
			
			events.splice(index, 1);
		};
		
		return {
			bind: _bind,
			remove: _remove
		};
	}.call(this);
	
	/*
	* upload environment feature
	*/
	FOCUS.util.feature_upload = function(nav){
		var _flash = function(){
			var flash = FOCUS.util.flash;
			var ret = flash.has;
			
			//win vista/7 + flash plugin 11.3 + ff 4-13 == problem
			if(flash && flash.has && nav.oscpu && FOCUS.util.browser.firefox && FOCUS.util.browser.version >= 4 && FOCUS.util.browser.version <= 13){
				var r_sys = /windows\s*nt\s*([\d\.]+)/i;
				var match = r_sys.exec(nav.oscpu);
				
				if(match && (/^6\.0/.test(match[1]) || /^6\.1/.test(match[1])) && /^11\.3/.test(flash.version)){
					ret = false;
				}
			}
			
			return ret;
		}.call(this);
		
		var _html5 = function(){
			if(FOCUS.util.browser.firefox && FOCUS.util.browser.version < 3.6){
				return false;
			}
			
			var ret = {};
			
			var fileElem = document.createElement('input');
			fileElem.type = 'file';
			fileElem.style.cssText = 'position:absolute; top:-999px; height:-999px;';
			document.body.appendChild(fileElem);
			
			//setTimeout(function(){
				ret.file = !!fileElem.files;
				ret.multiple = ('multiple' in fileElem) && !(FOCUS.util.browser.apple && FOCUS.util.browser.version < 6);
				
				document.body.removeChild(fileElem);
				delete fileElem;
			//}, 25);
			
			if(!window.XMLHttpRequest){
				ret = false;
				return ret;
			}
			
			var xhr = new XMLHttpRequest();
			//standard html5 xhr object
			ret.upload = !!xhr.upload;
			//ff
			ret.sendAsBinary = !!xhr.sendAsBinary;
			//native FormData
			ret.FormData = !!window.FormData && !window.FormData.customized;
			
			delete xhr;
			
			return ret;
		}.call(this);
		
		var _iframe = function(){
			var ret = {};
			var domain = document.domain;
			var host = window.location.host || window.location.hostname;
			
			ret.sameDomain = domain === host;
			
			return ret;
		}.call(this);
		
		return {
			html5: _html5,
			flash: _flash,
			iframe: _iframe
		};
	}.call(this, window.navigator);
	
	FOCUS.util.sizeConvert = function(){
		var Unit = {
			KB: 1024,
			MB: 1024 * 1024,
			GB: 1024 * 1024 * 1024/*,
			TB: 1024 * 1024 * 1024,
			PB: 1024 * 1024 * 1024 * 1024*/
		};
		
		var UnitSize = function(size, unit){
			this.size = size;
			this.unit = unit;
		};
		
		UnitSize.prototype = {
			toString: function(){
				return this.size + ' ' + this.unit;
			},
			valueOf: function(){
				return this.size;
			}
		};

		var r_unit = /^((?:\d+)(?:\.\d+)?)\s*([A-Za-z]*)$/g;
		var r_hasUnit = /([A-Za-z]+)$/;
		
		/*
		* convert Size with Unit to Size in bytes
		*/
		var _unit2Bytes = function(unitSize){
			var size = 0;
			
			if(r_hasUnit.test(unitSize)){
				r_unit.exec('');
				var unit = r_unit.exec(unitSize);
				if(unit){
					size = (parseFloat(unit[1]) || 0) * (unit[2] ? Unit[unit[2].toUpperCase()] : 1024);
				}else{}
			}else{
				size = parseInt(unitSize) || 0;
			}
			
			//size === 0  ===> no size limit(-1)
			size = size || 0;

			return size;
		};
		
		
		/*
		* convert Size in bytes to Size with Unit
		*/
		var _bytes2Unit = function(bytes, unit){
			var size = 0;
			var unitList = ['GB', 'MB', 'KB'];
			
			unit = unit || '';
			if(!unit){
				for(var i = 0; i < unitList.length; i++){
					if(bytes > Unit[unitList[i]]){
						unit = unitList[i];
						break;
					}
				}
			}
			
			if(unit){
				size = bytes / Unit[unit];
			}
			
			size = size || 0;
			size = new UnitSize(size, unit);
			
			return size;
		};
		
		return {
			unit2Bytes: _unit2Bytes,
			bytes2Unit: _bytes2Unit
		};
	}.call(this);
	
	//FormData  -- for FireFox 3.x (has no class FromData, has xhr.sendAsBinary)
	if(!window.FormData && FOCUS.util.feature_upload.html5.sendAsBinary){
		window.FormData = function(charset){
			this.charset = charset || 'UTF-8';
			this.reset();
		};
		window.FormData.prototype = {
			append: function(name, content){
				var _data = '';
				var EOL = this.EOL;
				var boundary = '--' + this.boundary;
				
				var type = FOCUS.util.type(content);
				
				if(type === 'object'){
					content = JSON.stringify(content);
					type = 'string';
				}
				
				_data += boundary + EOL;
				_data += 'Content-Disposition: form-data; ';
				
				if(type === 'file'){
					_data += 'name="' + this.encode(name) + '"; ';
					_data += 'filename="' + this.encode(content.filename || content.name) + '"' + EOL;
					_data += 'Content-Type: ' + (content.type ? content.type : 'application/octet-stream') + EOL + EOL;
					_data += content.getAsBinary() + EOL;
				}else{
					_data += 'name="' + this.encode(name) + '"' + EOL + EOL;
					_data += this.encode(content) + EOL;
				}
				
				this.data += _data;
			},
			getData: function(){
				return this.data + '--' + this.boundary + '--' + this.EOL;
			},
			valueOf: function(){
				return this.getData();
			},
			toString: function(){
				return this.getData();
			},
			reset: function(){
				this.data = '';
				// 71 -- Firefox's tradition
				this.boundary = "---------------------------71" + (new Date).valueOf().toString(16).replace(/^0x/, '');
				this.EOL = '\r\n';
			},
			encode: function(str){
				if(FOCUS.util.transformCharset){
					return FOCUS.util.transformCharset(str, this.charset);
				}else{
					return encodeURI(str);
				}
			}
		};
		
		//customized flag
		window.FormData.customized = true;
	}
	
	
	var MIME_TYPE = {
		'*/*':			'*.*',
		'image/*':		'*.jpg; *.jpeg; *.jpe; *.png; *.gif',
		'image/png':	'*.png',
		'image/jpeg':	'*.jpg; *.jpeg; *.jpe',
		'image/jpg':	'*.jpg; *.jpeg; *.jpe',
		'image/gif':	'*.gif',
		'application/gzip':		'*.gz',
		'application/zip':		'*.zip',
		'application/vnd.ms-excel':	'*.xls',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':	'*.xlsx',
		'application/msword':	'*.doc',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document':	'*.docx',
		'application/vnd.ms-powerpoint':	'*.ppt',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation':	'*.pptx',
		'application/mshelp':		'*.hlp; *.chm',
		'application/pdf':			'*.pdf',
		'application/mp3':	'*.mp3',
		'text/html':		'*.html; *.htm; *.xhtml',
		'text/javascript':	'*.js',
		'text/css':			'*.css',
		'text/plain':		'*.txt',
		'default':		'*.*'
	};
	
	var FILE_TYPE = function(mime){
		var exclude = ['image/*', 'image/jpg', 'default'];
		var type = {};
		
		for(var key in mime){
			if(FOCUS.util.indexOf(exclude, key) === -1){
				mime[key].replace(/[^\;\u0020]+/g, function($1){
					type[$1] = key;
				});
			}
		}
		
		return type;
	}(MIME_TYPE);
	
	/*
	* '*.*; *.jpg' to MIME_TYPE
	*/
	FOCUS.util.convert2MimeTypes = function(types){
		types = types.split(/[\;\,]\s*/);
		
		var tmpRet = [];
		var ret = '';
		if(types.length){
			var r = /^[^\/]+\/[^\/]+$/;
			for(var i = 0; i < types.length; i++){
				if(r.test(types[i])){
					tmpRet.push(types[i]);
					continue;
				}
				
				if(types[i] in FILE_TYPE && types[i] !== '*.*'){
					tmpRet.push(FILE_TYPE[types[i]]);
				}else{
					ret = '*/*';
					break;
				}
			}
			
			if(!ret){
				ret = FOCUS.util.unique(tmpRet).join(', ');
			}
		}else{
			ret = '*/*';
		}
		
		return ret;
	};
	
	/*
	* MIME_TYPE to '*.*; *.jpg'
	*/
	FOCUS.util.convertMimeTypes = function(mime){
		mime = mime.split(/[\;\,]\s*/);
		
		var tmpRet = [];
		var ret = '';
		if(mime.length){
			var r = /^[^\\\/]+\.[^\\\/]+$/;
			for(var i = 0; i < mime.length; i++){
				if(r.test(mime[i])){
					tmpRet.push(mime[i]);
					continue;
				}
				
				if(mime[i] in MIME_TYPE && mime[i] !== '*/*'){
					tmpRet.push(MIME_TYPE[mime[i]]);
				}else{
					ret = '*.*';
					break;
				}
			}
			
			if(!ret){
				ret = FOCUS.util.unique(tmpRet).join('; ');
			}
		}else{
			ret = '*.*';
		}
		
		return ret;
	};
	
	/*
	* validate mime type
	*/
	FOCUS.util.mimeValidation = function(mimeSet, sub){
		if((mimeSet + '').indexOf('*/*') !== -1){
			return true;
		}
		
		sub = sub + '';
		var type = FOCUS.util.type(mimeSet);
		if(type === 'string'){
			mimeSet = mimeSet.split(/[\;\,\s]+/);
		}
		
		var ret = false;
		var r = /^([^\/]+)\/([^\/]+)$/;
		var matchSub = r.exec(sub);
		var match;
		
		if(!matchSub){
			return false;
		}
		
		for(var i = 0; i < mimeSet.length; i++){
			match = r.exec(mimeSet[i]);
			if(mimeSet[i] === sub
			|| (match[1] === matchSub[1] && (match[2] === '*' || match[2] === matchSub[2]))){
				ret = true;
				break;
			}
		}
		
		return ret;
	};
	
	/**
	* class
	*/
	FOCUS.util.addClass = function(elem, clazz){
		var clz = FOCUS.util.trim(elem.className).split(/\s+/);
		clz.push(clazz);
		elem.className = FOCUS.util.unique(clz).join(' ');
	};
	FOCUS.util.removeClass = function(elem, clazz){
		var clz = FOCUS.util.unique(FOCUS.util.trim(elem.className).split(/\s+/));
		var index = FOCUS.util.indexOf(clz, clazz);
		if(index !== -1){
			clz.splice(index, 1);
		}
		
		elem.className = clz.join(' ');
	};

}.call(this, this, this.document);





































