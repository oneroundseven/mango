;void function(){
	var plugins = this.widget.Upload.plugins;
	var util = this.util;
	
	plugins.Ready = function(mode){
		var isReady = false;
		var _this = this;
		var handles = [];
		
		var exec = function(){
			while(handles.length){
				handles.shift().call(_this, mode);
			}
		};
		
		this.on('ready', function(){
			this.isReady = isReady = true;
			exec();
		});
		
		this.ready = function(fn){
			util.type(fn) === 'function' && handles.push(fn);
			
			if(isReady){
				exec();
			}
		};
	};
}.call(FOCUS);