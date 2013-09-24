;void function(window, document, undefined){
	if(swfobject && FOCUS.util.flash.has && window.FormData && window.FormData.customized){
		var div = document.createElement('div');
		div.style.cssText = ';position:absolute; top:0; right:2px; float:none; display:block; width:1px; height:1px; margin:0; padding:0; border:0 none; font-size:0; line-height:0; background-color:transparent;';
		var span = document.createElement('span');
		span.id = "FOCUS_UPLOAD_PATCH_CHARSET_" + (new Date).valueOf().toString(16).toUpperCase();
		
		document.body.appendChild(div);
		div.appendChild(span);
		
		swfobject.embedSWF(FOCUS.BASEPATH + 'widget/upload/html5/transformCharset/transformCharset.swf', span.id, 1, 1, '9.0.0', null, null, null, null, function(){
			var timer = window.setInterval(function(){
				var swf = swfobject.getObjectById(span.id);
				if(swf){
					window.clearInterval(timer);
					FOCUS.util.transformCharset = function(str, charset){
						charset = charset || 'UTF-8';
						
						return swf.transformCharset(str, charset);
					};
				}else{ }
			}, 25);
		});
	}
}.call(this, this, document);