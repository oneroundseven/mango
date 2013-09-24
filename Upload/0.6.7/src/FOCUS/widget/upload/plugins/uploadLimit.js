/*;void function(){
	var plugins = FOCUS.namespace('FOCUS.widget.Upload.plugins');
	
	plugins.uploadLimit = function(mode){
		var uploaded = 0;
		
		this.on('uploadStart', function(){
			if(this.cfg.uploadLimit !== -1 && ++uploaded === this.cfg.uploadLimit){
				this.stopUpload(null, true);
				this.fire('uploadError', this.getQueueFile(), FOCUS.widget.Upload.UPLOAD_ERROR.UPLOAD_LIMIT, 'upload limit.');
			}
		});
	};
}.call(this);
*/