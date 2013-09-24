;void function(window, document, undefined){
	FOCUS.namespace('FOCUS.util');
	
	/**
	* type
	*/
	FOCUS.util.type = function(o){};
	
	/*
	* trim
	*/
	FOCUS.util.trim = function(str){};
	
	/*
	* JSON
	*/
	FOCUS.util.JSON = {};
	
	
	/**
	* browser
	*/
	FOCUS.util.browser = {
		msie:
		firefox:
		chrome:
		safari:
		opera:
		webkit:
		mozilla:
		version:
	};
	
	/*
	* flash plugin
	*/
	FOCUS.util.flash = {
		has: false,
		version: 0
	};


	/**
	* extend
	*/
	FOCUS.util.extend = function([override], target, args){};
	
	/*
	* log4js
	*/
	FOCUS.util.console = {
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
	
	/*
	* indexOf
	*/
	FOCUS.util.indexOf = function(items, value){};
	
	/*
	* unique array
	*/
	FOCUS.util.unique = function(arr){};
	
	/*
	* random  -- Int
	*/
	FOCUS.util.random = function(min, max, clear){};
	
	/**
	* create element
	*/
	FOCUS.util.createElement = function(config){
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

		var r_unit = /^(\d+)\s*([A-Za-z]*)$/g;
		var r_hasUnit = /([A-Za-z]*)$/;
		
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
			size = size || -1;

			return size;
		};
		
		
		/*
		* convert Size in bytes to Size with Unit
		*/
		var _bytes2Unit = function(bytes){
			var size = 0;
			var unitList = ['GB', 'MB', 'KB'];
			
			var unit = '';
			for(var i = 0; i < unitList.length; i++){
				if(bytes > Unit[unitList[i]]){
					unit = unitList[i];
					break;
				}
			}
			
			if(unit){
				size = bytes / Unit[unit];
			}
			
			size = size || -1;
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

	/*
	* '*.*; *.jpg' to MIME_TYPE
	*/
	FOCUS.util.convert2MimeTypes = function(types){};
	
	/*
	* MIME_TYPE to '*.*; *.jpg'
	*/
	FOCUS.util.convertMimeTypes = function(mime){};
	
	/*
	* validate mime type
	*/
	FOCUS.util.mimeValidation = function(mimeSet, sub){};
	
}.call(this, this, this.document);