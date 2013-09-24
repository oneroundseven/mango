;void function(window, document){
	var plugs = this.namespace('FOCUS.widget.Upload.plugins');
	var util = this.util;
	var upload = this.widget.Upload;
	var UPLOAD_ERROR = upload.UPLOAD_ERROR;

	//<!-- Event -->
	/**
	* Class Event
	* @constructor
	* @name Event
	* @param {String} type event type
	*/
	var Event = function(type, thisObj){
		this.type = type;
		this.listeners = [];
		this._ = {
			thisObj: thisObj
		};
	};
	Event.prototype = {
		/**
		* @private
		* search handle in listeners
		* @param {Function} handle
		* @param {Number=0} startIndex
		* @return {Number} index of listeners
		*/
		__search: function(handle, startIndex){
			var ret = -1;
			for(var i = startIndex || 0; i < this.listeners.length; i++){
				if(this.listeners[i].handle === handle){
					ret = i;
					break;
				}
			}
			
			return ret;
		},
		/**
		* add events
		* @param {Object} cfg
		* @param {Function[]} cfg.handles
		* @param {Boolean} [cfg.once]
		* @param [cfg.thisObj]
		* @param [args,..]
		*/
		add: function(cfg, args){
			var handles = cfg.handles;
			var thisObj = cfg.thisObj || null;
			var once = cfg.once || false;
			var args = [].slice.call(arguments, 1)

			if(util.type(handles) === 'function'){
				handles = [handles];
			}
			if(util.type(handles) === 'array'){
				for(var i = 0; i < handles.length; i++){
					if(util.type(handles[i]) === 'function'){
						this.listeners.push({
							handle: handles[i],
							thisObj: thisObj,
							once: !!once,
							args: args
						});
					}
				}
			}
		},
		/**
		* add events
		* @param {Object} cfg
		* @param {Function[]} cfg.handles
		* @param {Boolean} [cfg.once]
		* @param [cfg.thisObj]
		* @param [args,..]
		*/
		one: function(cfg, args){
			if(util.type(cfg) !== 'object'){
				return;
			}
			
			cfg.once = true;
			this.add(cfg, [].slice.call(arguments, 1));
		},
		/**
		* remove event
		* @param {Function|Function[]} handles
		*/
		remove: function(handles){
			if(!handles){
				this.listeners = [];
				return;
			}
			if(util.type(handles) === 'function'){
				handles = [handles];
			}
			
			var index;
			for(var i = 0; i < handles.length; i++){
				if(util.type(handles[i]) === 'function' && (index = this.__search(handles[i])) !== -1){
					this.listeners.splice(index, 1);
				}
			}
		},
		/**
		* excute event
		* @param [args,..] event params
		*/
		exec: function(args){
			var listener;
			var onceEvents = [];
			for(var i = 0; i < this.listeners.length; i++){
				listener = this.listeners[i];
				if(listener.once){
					onceEvents.push(listener.handle);
				}
				
				listener.handle.apply(listener.thisObj || this._.thisObj || this, [].concat.call(listener.args, [].slice.call(arguments)));
			}
			
			this.remove(onceEvents);
		},
		/**
		* set this object in event handle excution context
		* @param thisObj
		*/
		bindThisObj: function(thisObj){
			this._.thisObj = thisObj;
		}
	};
	//<!-- Event END -->
	
	//<!-- Upload Events -->
	/**
	* events plugin for upload component
	* @constructor
	* @name UploadEvents
	* @requires FOCUS.base
	* @requires FOCUS.util
	* @requires FOCUS.widget.Upload
	* @requires Event
	* @param events {Object} added events on init
	* @param [thisObj]
	*/
	var UploadEvents = function(events, thisObj){
		this._ = {
			events: {},
			thisObj: thisObj
		};
		
		this.events = {};
		for(var type in events){
			this.on(type, events[type]);
			this.events[type] = function(type){
				var _this = this;
				if(type === 'uploadError'){
					return function(file, code, msg){
						switch(code){
							case UPLOAD_ERROR.FILE_CANCELLED: {
								_this.fire.apply(_this, ['cancel', file, UPLOAD_ERROR.FILE_CANCELLED, 'file cancelled.']);
							}; break;
							case UPLOAD_ERROR.UPLOAD_STOPPED: {
								_this.fire.apply(_this, ['stop', file, UPLOAD_ERROR.UPLOAD_STOPPED, 'upload stopped.']);
							}; break;
							default: {
								_this.fire.apply(_this, [type].concat([].slice.call(arguments)));
							};
						}
					};
				}else{
					return function(){
						_this.fire.apply(_this, [type].concat([].slice.call(arguments)));
					};
				}
			}.call(this, type);
		}
	};
	UploadEvents.prototype = {
		/**
		* @private
		*/
		__initEvent: function(type, handles, thisObj){
			if(!(type in this._.events)){
				this._.events[type] = new Event(type, this._.thisObj);
			}
			
			var cfg = {
				handles: handles,
				thisObj: thisObj
			};
			
			return cfg;
		},
		/**
		* bind event
		* @param {String} type event type
		* @param {Function|Function[]} handles event handles
		* @param [thisObj]
		* @param [args,..]
		*/
		on: function(type, handles, thisObj, args){
			var cfg = this.__initEvent(type, handles, thisObj);
			this._.events[type].add.apply(this._.events[type], [cfg].concat([].slice.call(arguments, 3)));
		},
		/**
		* remove event
		* @param {String} type event type
		* @param {Function|Function[]} [handles] remove handles
		*/
		off: function(type, handles){
			if(type in this._.events){
				this._.events[type].remove(handles);
			}
		},
		/**
		* bind once excuted event
		* @param {String} type event type
		* @param {Function|Function[]} handles event handles
		* @param [thisObj]
		* @param [args,..]
		*/
		one: function(type, handles, thisObj, args){
			var cfg = this.__initEvent(type, handles, thisObj);
			this._.events[type].one.apply(this._.events[type], [cfg].concat([].slice.call(arguments, 3)));
		},
		/**
		* trigger some event with the type
		* @param {String} type event type
		* @param [args,..]
		*/
		fire: function(type, args){
			if(type in this._.events){
				this._.events[type].exec.apply(this._.events[type], [].slice.call(arguments, 1));
			}
		},
		/**
		* set this object in all event handle excution context
		* @param thisObj
		*/
		bindThisObj: function(thisObj){
			this._.thisObj = thisObj;
			for(var type in this._.events){
				this._.events[type].bindThisObj(thisObj);
			}
		}
	};
	
	plugs.UploadEvents = UploadEvents;
	//<!-- Upload Events END -->
	
}.call(FOCUS, window, window.document);