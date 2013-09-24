/**
* @requires UploadEvents
*/
;void function(window){
	var plugs = FOCUS.namespace('FOCUS.widget.Upload.plugins');
	
	plugs.AutoDisabled = function(mode){
		this.on('uploadStart', function(){
			this.turn('off');
		}).on('uploadComplete', function(){
			this.turn('on');
		});
	};
}.call(this);