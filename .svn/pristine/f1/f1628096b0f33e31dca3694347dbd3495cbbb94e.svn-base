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
	* 事件对象
	* @class
	* @constructor
	* @name Event
	* @param {String} type 事件类型
	* @param {JSON} [data] 事件句柄触发的数据
	* @link Events
	*/
	var Event = function(type, data){
		this.type = type;
		this.data = data;
	};
	
	;(/** @lends Event.prototype */
	{
		/**
		* 事件类型
		*/
		type: 'xx',
		/**
		* 事件句柄触发的数据
		*/
		data: {}
	});
	
	/**
	* 自定义事件类
	* @name Events
	* @class
	* @constructor
	* @requires Clazz
	* @requires Abstract
	* @requires Event
	* @requires Listener
	* @link Clazz
	* @link Abstract
	* @link Event
	*/
	var IEvents = new Abstract(/** @lends Events.prototype */{
		/**
		* 绑定事件
		* @param {String} type 事件类型
		* @param {JSON} [data] 绑定事件句柄触发的数据
		* @param {Function|Function[]} handle 事件句柄/侦听
		*/
		on: function(type, data, handle){},
		/**
		* 绑定执行一次的事件
		* @param {String} type 事件类型
		* @param {JSON} [data] 绑定事件句柄触发的数据
		* @param {Function|Function[]} handle 事件句柄/侦听
		*/
		one: function(type, data, handle){},
		/**
		* 解绑定事件
		* @param {String} type 事件类型
		* @param {Function|Function[]} [handle] 事件句柄/侦听。若无此参数，将移除所有该类型的句柄
		*/
		off: function(type, handle){},
		/**
		* 触发事件
		* @param {String} type 事件类型
		* @param {JSON} [data] 触发的事件时发送的数据。所有被触发的句柄含有默认参数 event {@link Event}
		*/
		fire: function(type, data){}
	});
	
}.call(Lass);