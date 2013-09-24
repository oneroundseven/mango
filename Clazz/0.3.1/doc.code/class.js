;void function(){
	var util = this.util;
	var noop = function(){};
	var IS_METHOD = '__IS_ABSTRACT_METHOD__';

	/**
	* 类工厂
	* @class
	* @constructor
	* @name Clazz
	* @param {Abstract} [IAbstract] 声明 {@link Abstract}
	* @param {JSON} [config] 配置
	* @param {Clazz} [config.inherit] 继承的类
	* @param {JSON|JSON[]} [config.mix] 混入实例的对象
	* @param {config} [config.config] 类的默认配置
	* @param {Function} [initialize] 初始化函数
	* @link Abstract
	* @example
	* 	var ClassA = new Clazz(IClassA, {
	* 		config: {},
	* 		inherit: ClassB,
	* 		mix: {}
	* 	}, function(params){
	* 		this.setConfig({});
	* 	});
	*/
	var Clazz = function(){};
	
	var __CLASS_PROTO__ = /** @lends Clazz.prototype */{
		/**
		* 实现接口的方法
		* @param {String} apiname 接口方法名称
		* @param {Function} fn 实现的方法
		*/
		impl: function(apiname, fn){
			util.type(fn) === 'function' && (this[apiname] = fn);
		},
		/**
		* 混入对象到类实例
		* @param [args,..] 对象列表
		*/
		mix: function(args){
			util.extend.apply(null, [true, this].concat([].slice.call(arguments)));
		},
		/**
		* @public
		* 获取默认配置
		* @return {JSON} config
		*/
		__getDefaultConfig: function(){
			return defaultConfig;
		}
	};
	
	;(/** @lends Clazz */{
		/**
		* 扩展类的原型
		* @param [proto,..] 要附加的对象列表
		*/
		extend: function(proto){}
	});
	
	
	/**
	* 抽象类工厂
	* @class
	* @constructor
	* @name Abstract
	* @param {JSON} declaration 属性或接口的声明
	* @param {Boolean} [debug] 是否在实例化类时提示未实现的接口
	* @link Clazz
	* @example
	* 	var IClass = new Abstract({
	* 		attr: null,
	* 		method: function(){}
	*  	}, true);
	*/
	var Abstract = function(declaration, debug){};
}.call(Lass);