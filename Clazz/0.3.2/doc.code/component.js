;void function(){
	var util = this.util;
	var Clazz = this.Clazz;
	var Abstract = this.Abstract;
	var Events = this.Events;
	var Empty = this.Empty;
	
	/**
	* 组件基类
	* @class
	* @constructor
	* @name Component
	* @requires Clazz
	* @requires Abstract
	* @requires Events
	* @link Clazz
	* @link Abstract
	* @link Events
	* @example
	* 	var IDialog = new Abstract({
	* 		show: function(){},
	* 		hide: function(){}
	* 	});
	*
	* 	var Dialog = new Clazz(IDialog, { inherit: Component }, function(cfg){
	* 		this.setConfig(cfg);
	* 		this.show.impl(function(msg){alert(msg)});
	* 	});
	*
	* 	Dialog.extend({
	* 		hide: function(){ 'hide'; }
	* 	});
	*/
	var Component = new Clazz({ mix: __COMPONENT_PROTO__, inherit: Empty });
	Component.extend(new Events());
	
	var __COMPONENT_PROTO__ = /** @lends Component.prototype */{
		/**
		* 私有变量命名空间
		*/
		_: {},
		/**
		* dom元素命名空间
		*/
		elems: {},
		/**
		* 配置文件
		*/
		config: {},
		/**
		* 设置配置文件
		* @param {JSON} config 包含新属性的配置文件
		* @return {JSON} config 当前实例的配置文件
		*/
		setConfig: function(config){
			this.config = util.extend(true, {}, this.__getDefaultConfig(), this.config, config);
		}
	};
	
	;(/** @lends Component.prototype */{
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