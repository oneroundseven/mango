;void function(window, document, undefined){
	var io = this.namespace('FOCUS.widget.io.iframe');
	var IO_FormData = io.IO_FormData;
	var IO_Iframe = io.IO_Iframe;
	var util = this.util;
	var noop = function(){};

	//poster
	var Poster = function(cfg){
		this.cfg = {
			events: {
				//abort: noop,
				error: noop,
				load: noop,
				progress: noop,
				abort: noop
			},
			progressURL: '',
			charset: 'UTF-8',
			timeout: 100000
		};
		this._ = {
			cancel: false,
			timeout: false,
			loaded: false,
			timeoutTimer: -1
		};
		this.elems = {};		
		this.set(cfg);
		
		this.init();
	};
	Poster.prototype = {
		init: function(){
			var _this = this;
			this._.getProgress = function(){
				var me = arguments.callee;

				if(_this.cfg.progressURL && !_this._.loaded){
					_this.elems.io_progress = new IO_Iframe;
					//getData result: {loaded: xx, total: xx}
					_this.elems.io_progress.onload(function(data){
						setTimeout(function(){
							_this.elems.io_progress.dispose();
						}, 25);
						if(!_this._.loaded){
							data = util.JSON.parse(data);
							_this.cfg.events.progress.call(data);
							
							setTimeout(function(){
								me();
							}, 100);
						}
					});
					
					_this.elems.io_progress.open('GET', _this.cfg.progressURL, true);
					var data = new IO_FormData();
					data.append('progress', 'loaded');
					_this.elems.io_progress.send(data);
				}
			};
		},
		send: function(data){
			/*var formData = new IO_FormData;
			
			if(data){
				var type = FOCUS.util.type(data);
				var name;
				
				if(type === 'object'){
					for(var key in data){
						name = 'FOCUS_DATA_' + key + FOCUS.util.random(0, 1000);
						formData.append(name, data[key]);
					}
				}else{
					name = 'FOCUS_DATA_' + FOCUS.util.random(0, 1000);
					formData.append(name, data);
				}
			}*/
			
			if(this._.cancel){
				return;
			}
			
			var _this = this;
			this._.timeoutTimer = setTimeout(function(){ //timeout trigger
				_this.timeout();
			}, this.cfg.timeout);
			
			this.elems.io.send(data, this.cfg.charset);
			setTimeout(function(){//adjust the progress event trigger timing
				if(!_this._.cancel){
					_this.cfg.events.progress.call(_this, {loaded: 0, total: 100});
				}
			}, 1);

			this._.getProgress();
		},
		open: function(method, url/*, async*/){
			this._.fullProgress = false;
			this.reset();
			this.elems.io.open(method, url/*, async*/);
		},
		set: function(cfg){
			util.extend(true, this.cfg, cfg);
		},
		reset: function(){
			var _this = this;
			
			if(this.elems.io){
				this.elems.io.dispose();
			}
			
			if(this.elems.io_progress){
				this.elems.io_progress.dispose();
			}
			
			this.elems.io = new IO_Iframe({timeout: this.cfg.timeout});
			
			this.elems.io.onload(function(data){
				if(_this._.timeout){
					return;
				}
				
				if(!_this._.fullProgress){
					_this.cfg.events.progress.call(_this, {loaded: 100, total: 100});
					_this._.fullProgress = true;
				}
				
				clearTimeout(_this._.timeoutTimer);
				
				if(!_this._.cancel){ // not canceled
					_this._.loaded = true;
					_this.cfg.events.load.call(_this, data, this);
				}else{
					//_this.cfg.events.error.call(_this, data, this);
				}
			});
			
			this.elems.io.onerror(function(msg){
				clearTimeout(_this._.timeoutTimer);
				if(!_this._.cancel){ // not canceled
					_this.cfg.events.error.call(_this, this, msg);
				}else{
					//TODO
				}
			});
			
			this._.cancel =  false;
			this._.timeout = false;
			this._.loaded = false;
			this._.timeoutTimer = -1;
		},
		dispose: function(){
			if(this.elems.io){
				this.elems.io.dispose();
				delete this.elems.io;
			}
			
			if(this.elems.io_progress){
				this.elems.io_progress.dispose();
				delete this.elems.io_progress;
			}

			//TODO
		},
		timeout: function(){
			this._.timeout = true;
			this.elems.io.__removeOnloadEvent();
			this.cfg.events.error.call(this, this, 'timeout');
		},
		abort: function(){
			this._.cancel = true;
			clearTimeout(this._.timeoutTimer);
			this.elems.io && this.elems.io.__removeOnloadEvent();
			
			this.cfg.events.abort();
		}
	};
	
	//
	io.Poster = Poster;
}.call(FOCUS, window, document);