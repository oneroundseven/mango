;void function(window, document, undefined){
	this.namespace('FOCUS.widget');
	
	var util = this.util;
	var widget = this.widget;
	var noop = function(){};
	
	////required swfupload
	//FOCUS.widget.Upload_Flash = SWFUpload;
	
	var envir = function(){
		var feature = util.feature_upload;
		return {
			flash: feature.flash,
			html5: feature.html5 && (feature.html5.upload && /*feature.html5.file && */(feature.html5.sendAsBinary || feature.html5.FormData)),
			iframe: true
		}
	}.call(this);
	
	var upload = widget.Upload = function(cfg){
		this.cfg = {
			priority: upload.PRIORITY.DEFAULT,
			events: {
				ready: noop,
				loadFailed: noop,
				dialogStart: noop,
				dialogComplete: noop,
				queued: noop,
				queueError: noop,
				uploadStart: noop,
				uploadProgress: noop,
				uploadSuccess: noop,
				uploadError: noop,
				uploadComplete: noop
			},
			button: {
				//width: 120,
				//height: 32,
				text: 'Upload'
			},
			multiple: true,
			sizeLimit: -1,
			uploadLimit: -1,
			queueLimit: -1,
			fileTypes: upload.MIME_TYPE.ALL,
			uploadURL: '',
			filePostName: '',
			placeholder: '#uploader',
			debug: false,
			plugins: 'UploadEvents,AutoDisabled,Ready,Patch4Charset',
			fileTypesDescription: 'All Files'
		};
		
		this.set(cfg);
		if(upload.plugins.UploadEvents){
			this.uploadEvents = new upload.plugins.UploadEvents(this.cfg.events);
			this.set({
				events: this.uploadEvents.events
			});
		}
		this._ = {};
		this.init();
		
		return this.instance;
	};
	
	upload.prototype = {
		init: function(){
			var _this = this;
			var that;
			var priority = this.cfg.priority;
			
			//setTimeout(function(){
				var type;
				for(var i = 0; i < priority.length; i++){
					if(envir[priority[i]]){
						type = priority[i];
						break;
					}
				}
				
				var CLZ = {
					'html5': 'Upload_HTML5',
					'flash': 'Upload_Flash',
					'iframe': 'Upload_Iframe'
				};
				
				if(type){
					if(type === upload.MODE.FLASH){
						//wrap file object in flash event
						for(var ename in this.cfg.events){
							this.cfg.events[ename] = function(handle, ename){
								var _File = upload.File4Flash;
								return function(file){
									if(file && file.id){
										handle.apply(this, [new _File(file)].concat([].slice.call(arguments, 1)));
									}else{
										handle.apply(this, [].slice.call(arguments, 0));
									}
								};
							}.call(this, this.cfg.events[ename], ename);
						}
				
						this.cfg.fileTypes = util.convertMimeTypes(this.cfg.fileTypes); // mimetype ==> suffix type  ------> TODO
						//this.cfg.placeholder = this.cfg.placeholder.replace(/^#/, '');

						var ready = this.cfg.events.ready;
						this.cfg.events.ready = function(ready){
							return function(){
								// make sure the flash loaded success
								setTimeout(function(){
									ready.call(_this.instance, type);
								}, 25);
							};
						}(ready);
					}else{ //
						this.cfg.fileTypes = util.convert2MimeTypes(this.cfg.fileTypes);
					}
					
					// UI & Events contruct
					this.instance = new widget[CLZ[type]](this.cfg);
					
					if(type !== upload.MODE.FLASH){
						// make sure the dom elements loaded && script excuted
						setTimeout(function(){
							// callback for choose which type to initialize
							_this.cfg.events.ready.call(_this.instance, type);
						}, 25);
					}else{ //Flash
						//that = this.instance;
						//this.instance = this.instance.instance;
					}
					
					var plugs = upload.plugins;
					//bind event handle
					if(plugs.UploadEvents){
						this.uploadEvents.bindThisObj(this.instance);
						'on,one,off,fire'.replace(/(\w+)/g, function($1){
							_this.instance[$1] = function(){
								_this.uploadEvents[$1].apply(_this.uploadEvents, arguments);
								return _this.instance;
							};
						});
					}
					
					//<--
					//execute plugins
					for(var pname in plugs){
						pname.replace(/([\$\^\[\]\\/\,\?\:\|\{\}\!\(\)\*\-\+])/g, '\\$1');
						if(pname !== 'UploadEvents' && new RegExp('(^|,)' + pname + '(,|$)').exec(this.cfg.plugins)){
							plugs[pname].call(this.instance, this.instance.mode);
						}
					}
					/////-->
				}else{
					throw 'not support this constructor.'
				}
			//}, 25);
		},
		set: function(cfg){
			var plugins = this.cfg.plugins;
			if(cfg && cfg.plugins && util.type(cfg.plugins) === 'string'){
				plugins += (',' + cfg.plugins);
				plugins = util.unique(plugins.split(/[,;\s]+/)).join(',');
			}
			
			util.extend(true, this.cfg, cfg);
			
			this.cfg.plugins = plugins;
		}
	};
}.call(FOCUS, this, this.document);









































