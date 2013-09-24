;void function(window, document, undefined){
	var that = this;
	var util = this.util;
	var upload = this.widget.Upload;
	var plugs = upload.plugins;
	var MODE = upload.MODE;
	var BASEPATH = this.BASEPATH;
	var UUID = this.UUID;
	var PATH_CHARSET = this.PATH_CHARSET;
	
	plugs.Patch4Charset = function(mode){
		if(mode === MODE.HTML5 && swfobject && util.flash.has && window.FormData && window.FormData.customized){
			var id = "FOCUS_UPLOAD_PATCH_CHARSET_" + UUID;
			if(swfobject.getObjectById(id)){
				return;
			}
			
			var div = document.createElement('div');
			div.style.cssText = ';position:absolute; top:0; right:2px; float:none; display:block; width:1px; height:1px; margin:0; padding:0; border:0 none; font-size:0; line-height:0; background-color:transparent;';
			var span = document.createElement('span');
			span.id = id
			
			document.body.appendChild(div);
			div.appendChild(span);
			
			swfobject.embedSWF(this.cfg.pathCharset || that.PATH_CHARSET || BASEPATH + 'widget/upload/html5/transformCharset/transformCharset.swf', span.id, 1, 1, '9.0.0', null, null, null, null, function(){
				var timer = window.setInterval(function(){
					var swf = swfobject.getObjectById(span.id);
					if(swf){
						window.clearInterval(timer);
						util.transformCharset = function(str, charset){
							charset = charset || 'UTF-8';
							
							return swf.transformCharset(str, charset);
						};
					}else{ }
				}, 25);
			});
		}
	};
	
}.call(FOCUS, this, document);