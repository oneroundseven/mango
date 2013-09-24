;void function(){
	var util = this.util;
	var noop = function(){};
	var IS_METHOD = '__IS_ABSTRACT_METHOD__';
	
	var __CLASS_PROTO__ = {
		impl: function(apiname, fn){
			util.type(fn) === 'function' && (this[apiname] = fn);
		},
		mix: function(){
			util.extend.apply(null, [true, this].concat([].slice.call(arguments)));
		}/*,
		__getDefaultConfig: function(){
			return defaultConfig;
		}*/
	};

	/**
	* class generation
	* @class
	* @constructor
	* @name Clazz
	* @param {Abstract} [IAbstract] declaration {@link Abstract}
	* @param {JSON} [config]
	* @param {Clazz} [config.inherit] inherit class
	* @param {JSON|JSON[]} [config.mix] mix in instance
	* @param {config} [config.config] default config in class
	* @param {Function} [initilize]
	*/
	var _Clazz = function(){
		//match params: abstract, config, constructor
		var ARGS_LENGTH = 3;
		
		var IAbstract;
		var config;
		var initilize;
		
		var types = [];
		for(var i = 0; i < ARGS_LENGTH; i++){
			types.push(util.type(arguments[i]));
		}
		
		var index;
		
		//constructor
		index = util.indexOf(types, 'function');
		initilize = (index === -1 ? noop : arguments[index]);
		
		index = -1;
		while((index = util.indexOf(types, 'object', index)) !== -1){
			if(!IAbstract && arguments[index].constructor === _Abstract){ //abstract class
				IAbstract = arguments[index];
			}else if(!config){ //configuration
				config = arguments[index];
			}
			
			if(IAbstract && config){
				break;
			}
		};
		
		if(!IAbstract){
			IAbstract = {};
		}
		
		if(!config){
			config = {};
		}
		
		///////////// end of match params
		
		//initialization
		var defaultConfig = config.config || {};
		var mix = [];
		var inherit = config.inherit || noop;
		//wrap mix
		var _mix = config.mix || [{}];
		var t_mix = util.type(_mix);
		if(t_mix === 'object'){
			_mix = [_mix];
		}else if(t_mix !== 'array'){
			_mix = [{}];
		}
		
		for(var i = 0; i < _mix.length; i++){
			if(util.type(_mix[i]) === 'object'){
				mix.push(_mix[i]);
			}
		}
		
		_mix = null;
		
		var constructor = function(){
			/*this._ = {};
			this.elems = {};
			
			this.cfg = util.extend(true, {}, defaultConfig);*/

			//super
			this['super'] = util.extend(true, {}, inherit.prototype);
			inherit.apply(this['super'], [].slice.call(arguments));
			
			//inherit super
			var remove = 'init,impl,super,mix,__getDefaultConfig,__proto__,toString,valueOf'.split(',');
			var inheritedObject = util.extend(true, {}, this['super']);
			for(var i = 0; i < remove.length; i++){
				try{
					delete inheritedObject[remove[i]];
				}catch(ex){ }
			}
			
			util.extend(true, this, inheritedObject, {
				__getDefaultConfig: function(){
					return defaultConfig;
				}
			});
			
			//mix
			this.mix.apply(this, mix);
			
			//add static method 'impl/implement' on abstract method
			for(var key in IAbstract){
				if(util.type(this[key]) === 'function' && this[key][IS_METHOD]){
					this[key] = function(key){
						var fn = function(){
							IAbstract[key]();
						};
						
						fn[IS_METHOD] = IAbstract[key][IS_METHOD];
						
						var _this = this;
						fn.impl = fn.implement = function(fn){
							_this.impl(key, fn);
						};
						
						return fn;
					}.call(this, key);
				}
			}
			
			this.constructor = arguments.callee;
			var ret = initilize.apply(this, [].slice.call(arguments));
			
			//log unimplement method
			for(var key in IAbstract){
				if(util.type(this[key]) === 'function' && this[key][IS_METHOD]){
					IAbstract[key]();
				}
			}
			
			if(typeof ret === 'object' && ret !== null){
				return ret;
			}
		};
		
		constructor.prototype = util.extend(true, {}, __CLASS_PROTO__, IAbstract);
		constructor.extend = function(proto){
			util.extend.apply(null, [true, constructor.prototype].concat([].slice.call(arguments)));
		};

		return constructor;
	};
	
	/**
	* empty class
	* @class
	* @constructor
	* @name Empty
	*/
	var Empty = this.Empty = new _Clazz();
	
	/**
	* abstract base class
	* @class
	* @constructor
	* @name Abstract
	* @param {JSON} declaration declaration of methods or attributes
	* @param {Boolean} [debug] whether warn not implemented methods
	*/
	var _Abstract = new _Clazz({inherit: Empty}, function(declaration, debug){
		var type;
		
		for(var key in declaration){
			type = util.type(declaration[key]);
			if(type === 'function'){
				this[key] = function(key, debug){
					return function(){
						debug && util.console.warn(key + ' method is not implement.');
					};
				}.call(this, key, debug);
				
				this[key][IS_METHOD] = true;
			}else if(type === 'object'){
				this[key] = util.extend(true, {}, declaration[key]);
			}else{
				this[key] = declaration[key];
			}
			
			//TODO: other referencation type
		}
	});
	
	///// initialization
	var toExtends = {
		Clazz: _Clazz,
		Abstract: _Abstract
	};
	
	util.extend(true, this, toExtends);
	util.extend(true, window, toExtends);
}.call(Lass);