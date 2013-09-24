/**
* @requires UploadEvents
*/
;void function(){
	var plugs = this.namespace('FOCUS.widget.Upload.plugins');
	
	plugs.AutoDisabled = function(mode){
		this.on('uploadStart', function(){
			this.turn('off');
		}).on('uploadComplete', function(){
			this.turn('on');
		});
	};
}.call(FOCUS);