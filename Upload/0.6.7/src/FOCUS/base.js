;void function(window, document, undefined){
	if(!window.FOCUS){
		window.FOCUS = {};
	}
	
	FOCUS.namespace = function(){
		var args = [].slice.call(arguments);
		var ns, tmp, prev;
		var ret = [];

		while(args.length){
			ns = args.shift().split(/\./);
			prev = window;

			while(ns.length){
				tmp = ns.shift();
				if(!prev[tmp]){
					prev[tmp] = {};
				}

				prev = prev[tmp];
			}
			
			ret.push(prev);
		}
		
		return ret.length > 1 ? ret : ret[0];
	};
	

	FOCUS.BASEPATH = window.FOCUS_BASEPATH || function(scripts){
		var location = window.location;
		var domain = /^(\w+\:\/{2,3}.+?)\//.exec(location.href)[1];
		var r_base = /(^\/?|.*?\/)FOCUS\/[^?#]+\.js(?:[?#].*)?$/;
		var r_isAbsPath = /^\w+\:\/\//;
		var r_isBackslash = /^\//;
		var r_path = /^.*\//;
		var base;
		var match;
		
		for(var i = 0, len = scripts.length; i < len; i++){
			var url = scripts[i].src;
			if(!r_isAbsPath.test(url)){
				if(r_isBackslash.test(url)){
					url = domain + url;
				}else{
					url = r_path.exec(location.href)[0] + url;
				}
			}else{ }
			
			match = r_base.exec(url);
			
			if(match){
				base = match[1];
				break;
			}
		}
		
		if(!base){
			base = r_path.exec(location.href)[0];
		}else{
			//if(location.protocol !== 'file:'){
				//if(base.indexOf(location.protocol) !== -1){
					base = base.replace(new RegExp(location.protocol + '\\/\\/' + location.host, 'i'), '');
				//}
				
				base = location.protocol + '\/\/' + location.host + base + 'FOCUS/';
			//}else{ }
		}
		
		return base;
	}(document.getElementsByTagName('script'));
}.call(this, this, this.document);