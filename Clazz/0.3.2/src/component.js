;void function(){
	var util = this.util;
	var Clazz = this.Clazz;
	var Events = this.Events;
	var Empty = this.Empty;
	var __COMPONENT_PROTO__ = /** @lends Component.prototype */{
		_: {},
		elems: {},
		config: {},
		setConfig: function(config){
			return this.config = util.extend(true, {}, this.__getDefaultConfig(), this.config, config);
		}
	};
	
	/**
	* Component Base class
	* @class
	* @constructor
	* @name Component
	* @param [cfg] configuration
	*/
	var _Component = new Clazz({ mix: __COMPONENT_PROTO__, inherit: Empty });
	_Component.extend(new Events());
	
	window.Component = this.Component = _Component;
}.call(Lass);