;void function(){
	var plugins = FOCUS.namespace('FOCUS.widget.Upload.plugins');
	
	plugins.autoTransport = function(mode){
		this.on('dialogComplete', function(){
			this.startUpload();
		});
	};
}.call(this);