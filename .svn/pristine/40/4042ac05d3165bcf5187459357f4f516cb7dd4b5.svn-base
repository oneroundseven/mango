/**
* util
* @requires Namespace Lass
*/
;void function(){
	var util = this.util = {};
	
	/**
	* type
	*/
	util.type = function(o){
		var _type;
		var r_native = /\{\s*\[native\s*code\]\s*\}/i;
		
		if(o === null){
			//for IE, use toString, it's '[object Object]'
			//for FF/Opera, it's '[object Window]'
			_type = 'null';
		}else if(typeof o === 'undefined'){
			//for IE, use toString, it's '[object Object]'
			//for FF/Opera, it's '[object Window]'
			_type = 'undefined';
		}else{
			_type = Object.prototype.toString.call(o).match(/\w+/g)[1].toLowerCase();
			
			//IE native function
			if(_type === 'object' && r_native.test(o + '')){
				_type = 'function';
			}
		}
		
		return _type;
	};
	
	/*
	* trim
	*/
	util.trim = function(str){
		return (str + '').replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, '');
	};
	
	/**
	* extend
	*/
	util.extend = function(){
		var me = arguments.callee;
		var start, override;

		if(util.type(arguments[0]) !== 'object'){
			start = 1;
			override = !!arguments[0];
		}else{
			start = 0;
			override = false;
		}

		var tar = arguments[start] || {};
		var args = [].slice.call(arguments, start + 1);
		
		var tmp;
		var type;
		while(args.length){
			tmp = args.shift();
			if(util.type(tmp) !== 'object'){
				continue;
			}
			
			var t;
			for(var key in tmp){
				t = tmp[key];
				
				if(util.type(t) === 'object'){
					if(t == window || t == document || ('childNodes' in t && 'nextSibling' in t && 'nodeType' in t)){
						if(!(!override && (key in tar))){ //window, dom in IE, do not deep copy these.
							tar[key] = t;
						}
						
						continue;
					}
					
					if(t.jquery && /^[\d\.]+$/.test(t.jquery)){
						tar[key] = t;
						continue;
					}
					
					/*if('length' in t && t.length >= 0){
						var isFakeArray = true;
						for(var m = 0; m < t.length; m++){
							if(!(m.toString() in t)){
								isFakeArray = false;
								break;
							}
						}
						
						if(isFakeArray){
							//TODO: deep copy each element in fake array
							for(var m = 0; m < t.length; m++){
								if(!(!override && (key in tar))){
									tar[key] = t;
								}
							}
							
							continue;
						}
					}*/
					
					type = util.type(tar[key]);
					if(!(key in tar) || type === 'undefined' || type === 'null'){
						tar[key] = {};
					}
					
					if(util.type(tar[key]) === 'object'){
						me(override, tar[key], t);
					}
				}else if(!(!override && (key in tar))){
					tar[key] = t;
				}
				
			}
		}
		
		return tar;
	};
	
	/*
	* log4js
	*/
	util.console = function(console){
		var logStat = true;
		var noop = function(){};
		
		var SWITCH = {
			ON: true,
			OFF: false
		};
		
		var _loger = {
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
		
		if(!console){
			return _loger;
		}
		
		if(!console.debug){
			console.debug = console.log;
		}
		
		if(!console.error){
			console.error = console.warn;
		}
		
		return util.extend(true, _loger, {
			log: function(msg){
				if(logStat === SWITCH.ON){
					console.log(msg);
				}
			},
			info: function(msg){
				if(logStat === SWITCH.ON){
					console.info(msg);
				}
			},
			warn: function(msg){
				if(logStat === SWITCH.ON){
					console.warn(msg);
				}
			},
			error: function(msg){
				if(logStat === SWITCH.ON){
					console.error(msg);
				}
			},
			debug: function(msg){
				if(logStat === SWITCH.ON){
					console.debug(msg);
				}
			}
		});
	}.call(window, window.console);
	
	/*
	* indexOf
	*/
	util.indexOf = function(items, value, start){
		/*if(items.indexOf){
			return items.indexOf(value, start);
		}*/
		
		var ret = -1;
		var i = ((util.type(start) === 'number' ? start : -1) + 1), len = items.length;
		for(; i < len; i++){
			if(items[i] === value){
				ret = i;
				break;
			}
		}
		
		return ret;
	};
	
	/*
	* unique array
	*/
	util.unique = function(arr){
		var ret = [];
		
		for(var i = 0, len = arr.length; i < len; i++){
			if(util.indexOf(ret, arr[i]) === -1){
				ret.push(arr[i]);
			}
		}
		
		return ret;
	};
	
	return util;
}.call(Lass);