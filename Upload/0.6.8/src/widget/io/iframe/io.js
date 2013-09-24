;void function(window, document, undefined){
	var io = this.namespace('FOCUS.widget.io.iframe');
	var noop = function(){};
	var util = this.util;
	//elems generator
	var createElem = util.createElement;
	
	//io
	var IO_Iframe = function(cfg){
		this.cfg = {
			events: {
				load: noop,
				error: noop
			},
			timeout: 100000,
			charset: 'UTF-8'
		};
		
		util.extend(true, this.cfg, cfg);
		this.elems = {};
		this._ = {};
		
		this.init();
	};
	IO_Iframe.prototype = {
		init: function(){
			var _this = this;

			this.elems.io = createElem({
				el: 'iframe',
				name: 'FOCUS_UPLOAD_IO_' + util.random(0, 1000),
				src: util.browser.msie
					? ('javascript:document.open();' + (document.domain === window.location.hostname
						? ''
						: ('document.domain=\'' + document.domain + '\';')) + 'void(0)')
					: 'about:blank'
				//src: 'javascript:document.open();document.domain="' + document.domain + '";void(0)'
			});
			
			this.elems.io.style.cssText = 'position:absolute; width:1px; height:1px; top: -9999px; left:-9999px;';

			document.body.appendChild(_this.elems.io);

			setTimeout(function(){
				_this.elems.win = _this.elems.io.contentWindow;
				_this.elems.doc = _this.elems.io.contentWindow.document;
			}, 25);
			
			//onload & onerror
			this._.timer = -1;
			this._.handle = {
				load: function(){
					if(_this._.submited){
						clearTimeout(_this._.timer);
						var data = _this._.handle.getData(_this.elems.io);
						if(util.type(data) === 'undefined'){
							_this.cfg.events.error.call(this, 'IO_ERROR');
						}else{
							_this.cfg.events.load.call(this, data);
						}
						_this._.submited = false;
						
						setTimeout(function(){
							_this._deleteForm();
						}, 25);
					}
				},
				error: function(){
					_this.cfg.events.error.call(this);
					_this._.submited = false;
				},
				//default getData, when Xdomain, override it
				getData: function(ifr){
					var data;
					try{
						//[Problem in chrome]
						// if cross domain, try...catch.. could not catch the 'unsafe error' tip
						var win = ifr.contentWindow;
						var doc = win.document;
						var body = doc.body;
						
						data = body.innerHTML.replace(/(^|)\<\/?pre[^\>]*\>(|$)/gi, '');
					}catch(ex){}
					
					return data;
				}
			};
			
			//bind load event
			this.elems.io.attachEvent
				? this.elems.io.attachEvent('onload', this._.handle.load)
				: (this.elems.io.onload = this._.handle.load);
		},	
		open: function(method, url/*, async*/){
			this._.openCfg = {
				method: method.toUpperCase() === 'GET' ? 'GET' : 'POST',
				action: url
			};
		},
		send: function(data, charset){
			var _this = this;
			setTimeout(function(){
				var ie67 = util.browser.msie && (util.browser.version == 6 || util.browser.version == 7);

				var formCfg = {
					el: 'form',
					name: 'FOCUS_UPLOAD_FORM_' + util.random(0, 1000),
					method: _this._.openCfg.method,
					/*enctype: 'multipart/form-data',*/
					action: _this._.openCfg.action || ''
				};
				
				//if(ie67){
					formCfg.target = _this.elems.io.name;
				//}
				
				var dataArray = [];
				var hasFile = false;
				var tmpElem;
				for(var key in data.elems){
					tmpElem = data.elems[key];
					if(tmpElem.type === 'file'){
						hasFile = true;
					}
					
					dataArray.push(tmpElem);
				}
				
				formCfg.enctype = hasFile ? 'multipart/form-data' : 'application/x-www-form-urlencoded';
				
				_this._deleteForm();
				var form = _this.elems.__submit_form = createElem(formCfg);
				form.style.cssText = 'position:absolute; width:1px; height:1px; top: -9999px; left:-9999px;';
				
				var doc = document;//ie67 ? document : _this.elems.doc;
				doc.body.appendChild(form);
				
				while(dataArray.length){
					form.appendChild(dataArray.shift());
				}
				
				charset = charset || _this.cfg.charset || 'UTF-8';
				//<-- [fixed] charset setting will lead form submit with other charset in ie
				//record the original document charset
				var originalCharset;
				util.browser.msie && (originalCharset = doc.charset);
				//-->
				util.browser.msie
					? (doc.charset = charset)
					: (form.acceptCharset = charset);
				
				/*_this._.timer = setTimeout(function(){
					_this._.handle.error.call(_this);
				}, _this.cfg.timeout);*/
				
				setTimeout(function(){
					_this._.submited = true;
					form.submit();
					
					//restore charset
					setTimeout(function(){ //make sure submit action executed
						util.browser.msie && (doc.charset = originalCharset);
					}, 1);
				}, 25);
			}, 100);
		},
		onload: function(fn){
			//this.event.bind('load', function(){});
			this.cfg.events.load = fn;
		},
		onerror: function(fn){
			this.cfg.events.error = fn;
		},
		overrideGetData: function(fn){
			this._.handle.getData = fn;
		},
		setUrl: function(url){
			this.elems.__submit_form.action = url;
		},
		_deleteForm: function(){
			try{
				if(this.elems.__submit_form){
					this.elems.__submit_form.parentNode.removeChild(this.elems.__submit_form);
				}
			}catch(ex){}
			
			delete this.elems.__submit_form;
		},
		_deleteIO: function(){
			try{
				if(this.elems.io){
					this.__removeOnloadEvent();
					this.elems.io.parentNode.removeChild(this.elems.io);
				}
			}catch(ex){}
			
			delete this.elems.doc;
			delete this.elems.win;
			delete this.elems.io;
		},
		dispose: function(){
			this._deleteForm();
			this._deleteIO();
		},
		__removeOnloadEvent: function(){
			if(this.elems.io){
				this.elems.io.detachEvent
					? this.elems.io.detachEvent('onload', this._.handle.load)
					: this.elems.io.onload = noop;
			}
		}
	};
	
	//
	io.IO_Iframe = IO_Iframe;
}.call(FOCUS, window, document);