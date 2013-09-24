var CSSRuleOperator = function(){
	var extend = function(o, o1){
		for(var key in o1){
			o[key] = o1[key];
		}
	};
	
	//parse the tagName in css selector text to lowercase
	var lowerTagName = function( selector ){
		var reg = /(^|\s+)[A-Z]+/g;
		return selector.replace(reg, function($1){ return $1.toLowerCase() });
	};
	
	// CSS Rule Operations Class
	var Rule = function(style){
		if(!style){
			style = document.createElement('style');
			style.type = 'text/css';
			document.getElementsByTagName('head')[0].appendChild(style);
		}
		
		this.sheet = style.sheet || style.styleSheet || style;
		this.rules = this.sheet.cssRules || this.sheet.rules;
	};
	
	Rule.prototype = {
		get: function(selector){
			var ret;
			var i = parseInt(selector);
			
			if(typeof i === 'number' && i > -1 && i < this.rules.length){ //selector is a index number
				ret = this.rules[i];
			}else if(typeof selector === 'string'){ //seleector is a selectorText
				selector = lowerTagName(selector);
				var text;
				this.each(function(i, rule){
					text = lowerTagName(rule.selectorText);
					if(text === selector){
						ret = this.rules[i];
						return true;
					}
				});
			}
			
			return ret ? {
				selectorText: ret.selectorText,
				cssText: ret.cssText || ret.selectorText + '{' + ret.style.cssText + '}',
				style: this.split(ret.cssText || ret.style.cssText)
			}
			: ret;
		},
		/**
		* @param override {Boolean = false}: true: replace the old rule, false: inhert the old rule
		*/
		set: function(selector, style, index, override){
			var old = { selectorText: selector, style: {} };
			if(override){
				old = this.get(selector) || old;
				try{
					this.del(old.selectorText);
				}catch(ex){ }
			}
			
			if(typeof style === 'string'){
				style = this.split(style);
			}
			
			extend(old.style, style);
			
			index = index || this.rules.length;
			index = (index >= this.rules.length || index < 0) ? this.rules.length : index;
			
			if(this.sheet.insertRule){ //other browsers
				this.sheet.insertRule(this.toCssText(old.selectorText, old.style), index);
			}else{ //IE
				index = index > this.rules.length ? -1 : index;
				this.sheet.addRule(old.selectorText, this.toRuleStr(old.style), index);
			}
		},
		del: function(selector){
			if(this.sheet.removeRule){ // IE
				this.sheet.removeRule(selector);
				return true;
			}
			
			//other browsers
			var i = parseInt(selector);
			
			if(typeof i === 'number' && i > -1 && i < this.rules.length){ //selector is a index number
				this.sheet.deleteRule(i);
			}else if(typeof selector === 'string'){ //selector is a selectorText
				selector = lowerTagName(selector);
				var text;
				this.each(function(i, rule){
					text = lowerTagName(rule.selectorText);
					if(text === selector){
						this.sheet.deleteRule(i);
						return true;
					}
				});
			}
		},
		exist: function(selector){
			selector = lowerTagName(selector);
			var text, ret;
			this.each(function(i, rule){
				text = lowerTagName(rule.selectorText);
				if(text === selector){
					ret = true;
					return true;
				}
			});
			
			return ret;
		},
		each: function(callback){
			var i = 0, len = this.rules.length;
			var ret;
			for(; i < len; i++){
				ret = callback.call(this, i, this.rules[i]);
				if(ret){
					break;
				}
			}
			
			return this;
		},
		split: function(cssText){
			var reg = /([-a-zA-Z]+)\s*\:\s*([^;]+)/g;
			var ret = {};
			
			cssText.replace(reg, function($1, $2, $3){
				ret[$2.toLowerCase()] = $3;
			});
			
			return ret;
		},
		toRuleStr: function(style){
			var ret = [];
			for(var key in style){
				ret.push(key, ':', style[key], ';');
			}
			
			return ret.join('');
		},
		toCssText: function(selector, style){
			var ret = [ selector, '{' ];
			ret.push(this.toRuleStr(style));
			ret.push('}');
			
			return ret.join('');
		}
	};
	
	return Rule;
}.call(this);