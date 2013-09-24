;void function(){
	var util = this.util;
	var Clazz = this.Clazz;
	var Abstract = this.Abstract;
	
	/**
	* event listener
	* @private
	*/
	var Listener = function(handle, once, data){
		this.handle = handle;
		this.once = !!once;
		this.data = data || {};
	};
	
	/**
	* event object
	* @class
	* @constructor
	* @name Event
	* @param {String} type event type
	* @param {JSON} [data] event data
	*/
	var Event = function(type, data){
		this.type = type;
		this.data = data;
	};
	
	;(/** @lends Event.prototype */
	{
		/**
		* event type
		*/
		type: 'xx',
		/**
		* event data
		*/
		data: {}
	});
	
	/**
	* Events
	* @name Events
	* @class
	*/
	var IEvents = new Abstract({
		/**
		* bind events
		* @param {String} type event type
		* @param {JSON} [data] data on event
		* @param {Function|Function[]} handle event listener
		*/
		on: function(type, /*[data],*/ handle){},
		/**
		* bind once excuted events
		* @param {String} type event type
		* @param {JSON} [data] data on event
		* @param {Function|Function[]} handle event listener
		*/
		one: function(type, /*[data],*/ handle){},
		/**
		* unbind events
		* @param {String} type event type
		* @param {Function|Function[]} [handle] event listener.if no this param,remove all event listeners on this type of event
		*/
		off: function(type, handle){},
		/**
		* trigger events
		* @param {String} type event type
		* @param {JSON} [data] data on event
		*/
		fire: function(type, data){}
	});
	
	/**
	* Events
	* @class
	* @constructor
	* @name Events
	*/
	var Events = new Clazz(IEvents, function(){
		if(!this._){
			this._ = {};
		}

		this._.events = {};
	});
	
	// extend Events.prototype
	Events.extend(/** @lends Events.prototype */{
		/**
		* @private
		*/
		__initEvent: function(type){
			if(!this._.events[type]){
				this._.events[type] = [];
			}
			
			return this._.events[type];
		},
		/**
		* @private
		*/
		__eventParams: function(data, handle){
			var t_data = util.type(data);
			if(t_data === 'function'){
				handle = [data];
			}else if(t_data === 'array'){
				handle = data;
			}else if(t_data !== 'object'){
				data = {};
			}
			
			var t_handle = util.type(handle);
			if(t_handle === 'function'){
				handle = [handle];
			}else if(t_handle !== 'array'){
				handle = [];
			}
			
			return {
				data: data,
				handle: handle
			};
		},
		/**
		* @private
		*/
		__bindEvent: function(type, data, handle, one){
			type = util.trim(type);
			var events = this.__initEvent(type);
			var params = this.__eventParams(data, handle);
			
			for(var i = 0; i < params.handle.length; i++){
				if(util.type(params.handle[i]) === 'function'){
					events.push(new Listener(params.handle[i], !!one, util.extend(true, {}, params.data)));
				}
			}
		},
		/**
		* @private
		* search event
		*/
		__search: function(events, handle){
			var ret = -1;
			for(var i = 0; i < events.length; i++){
				if(events[i].handle === handle){
					ret = i;
					break;
				}
			}
			
			return ret;
		},
		/**
		* bind event
		* @param {String} type event type
		* @param {JSON} [data] event data
		* @param {Function|Function[]} handle event handle
		*/
		on: function(type, data, handle){
			this.__bindEvent(type, data, handle, false);
			return this;
		},
		/**
		* bind once excuted event
		* @param {String} type event type
		* @param {JSON} [data] event data
		* @param {Function|Function[]} handle event handle
		*/
		one: function(type, data, handle){
			this.__bindEvent(type, data, handle, true);
			return this;
		},
		/**
		* unbind event
		* @param {String} type event type
		* @param {Function|Function[]} [handle] event handle.if no this param, remove all handles with this type of events
		*/
		off: function(type, handle){
			type = util.trim(type);
			
			if(util.type(handle) === 'function'){
				handle = [handle];
			}
			
			if(util.type(handle) === 'array'){
				var events = this.__initEvent(type);
				var index;
				for(var i = 0; i < handle.length; i++){
					if(util.type(handle[i]) === 'function'){
						index = this.__search(events, handle[i]);
						if(index !== -1){
							events.splice(index, 1);
						}
					}
				}
			}else{
				this._.events[type] = [];
			}

			return this;
		},
		/**
		* trigger event
		* @param {String} type event type
		* @param {JSON} [data] event data
		* @example
		* 	this.on('xx', function(e){
		* 		//e {@link Event}
		* 		console.log(e);
		* 	});
		*/
		fire: function(type, data){
			type = util.trim(type);
			data = (util.type(data) === 'object' && data) || {};
			
			var events = this.__initEvent(type);
			var once = [];
			var event;
			
			for(var i = 0; i < events.length; i++){
				event = events[i];
				event.handle.call(this, new Event(type, util.extend(true, {}, event.data, data)));
				if(event.once){
					once.push(event.handle);
				}
			}
			
			this.off(type, once);

			return this;
		}
	});
	
	this.Events = Events;
}.call(Lass);