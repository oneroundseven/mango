;void function(){
	var plugins = FOCUS.namespace('FOCUS.widget.Upload.plugins');
	
	plugins.transportAllFiles = function(mode){
		this.on('uploadComplete', function(){
			this.startUpload();
		});
	};
}.call(this);