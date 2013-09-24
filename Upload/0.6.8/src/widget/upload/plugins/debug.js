/**
* @require FOCUS.widget.Upload.plugins.events.js
*/
;void function(window, document, undefined){
	var plugs = FOCUS.namespace('FOCUS.widget.Upload.plugins');
	var upload = FOCUS.widget.Upload;
	
	plugs.debug = function(mode){
		switch(mode){
			upload.MODE.IFRAME:
			upload.MODE.HTML5: {
				this.debug = function(isDebug){
					
				};
			}; break;
			upload.MODE.FLASH: {
				this.debug = function(){
					this.setDebugEnabled(isDebug);
				};
			}; break;
			default:;
		}
	};
}.call(this, window, document);