;void function(window, document){
	FOCUS.namespace('FOCUS.widget');
	var noop = function(){};
	
	var util = this.util;
	var query = this.query;
	var widget = this.widget;
	var upload = widget.Upload;
	var CSS = upload.CSS;
	var MODE = upload.MODE;
	var UPLOAD_ERROR = upload.UPLOAD_ERROR;
	var FILE_STATUS = upload.FILE_STATUS;
	
	widget.UploadBase = function(){
		/*this.elems = {};
		this.cfg = {
			priority: FOCUS.widget.Upload.PRIORITY.DEFAULT,
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
				text: 'Upload'
			},
			// single or multi file(s) selection dialog
			// except: some browser such as ie6-9 not support multiple on input:file
			multiple: true,
			sizeLimit: -1,
			//uploadLimit: -1, //not support now
			queueLimit: -1,
			fileTypes: FOCUS.widget.Upload.MIME_TYPE.ALL,
			fileTypesDescription: 'All Files',
			uploadURL: '',
			filePostName: '',
			placeholder: '',
			charset: FOCUS.widget.Upload.CHARSET.DEFAULT,
			debug: false,
			timeout: 100000
		};
		
		this._ = {
			queue: [],
			uploadingFile: null
		};*/
	};
	widget.UploadBase.prototype = {
		init: noop,
		set: function(cfg){
			this.cfg = util.extend(true, this.cfg, cfg);
		},
		debug: function(stat){
			util.log.turn(!!stat);
		},
		//Propertis
		//TODO
		
		////////Methods
		startUpload: noop,
		getFile: noop,
		
		//////implementation methods
		cancelUpload: function(callback){
			var file = this.getQueueFile();
			if(file){
				file.status = FILE_STATUS.CANCELLED;
				if(util.type(callback) === 'function'){
					this.one('uploadError', callback);
				}
				this.cfg.events.uploadError.call(this, file, UPLOAD_ERROR.FILE_CANCELLED, 'file cancelled.');
				this.elems.poster && this.elems.poster.abort();
			}
		},
		stopUpload: function(callback){
			var file = this.getQueueFile();
			if(file){
				file.status = FILE_STATUS.QUEUED;
				if(util.type(callback) === 'function'){
					this.one('uploadError', callback);
				}
				this.cfg.events.uploadError.call(this, file, UPLOAD_ERROR.UPLOAD_STOPPED, 'upload stopped.');
				this.elems.poster && this.elems.poster.abort();
				this._.queue.unshift(file);
			}
		},
		getQueueFile: function(arg){
			arg = arg || 0;
			var type = util.type(arg);
			var queue = this._.queue;
			var file = null;
			
			if(type === 'number'){
				if(arg <= queue.length - 1){
					file = queue[arg];
				}else{ }
			}else if(type === 'string'){
				for(var i = 0; i < queue.length; i++){
					if(queue[i].id === arg){
						file = queue[i];
						break;
					}
				}
			}
			
			return file;
		},
		////set
		setPostParam: function(params){
			if(!this.cfg.postParams){
				this.cfg.postParams = {};
			}
			
			util.extend(true, this.cfg.postParams, params);
		},
		addPostParam: function(key, value){
			if(!this.cfg.postParams){
				this.cfg.postParams = {};
			}
			
			this.cfg.postParams[key] = value;
		},
		removePostParam: function(key){
			if(!this.cfg.postParams || !key){
				this.cfg.postParams = {};
				return;
			}
			
			if(key in this.cfg.postParams){
				delete this.cfg.postParams[key];
			}
		},
		setUploadURL: function(url){
			this.cfg.uploadURL = url + '';
		},
		setFilePostName: function(name){
			this.cfg.filePostName = name + '';
		},
		//require override
		setFileTypes: function(types){
			switch(this.mode){
				case MODE.IFRAME:
				case MODE.HTML5: {
					this.cfg.fileTypes = this.elems.selector.accept = util.convert2MimeTypes(types);
				}; break;
				case MODE.FLASH: {
					//types = util.convertMimeTypes(types);
				}; break;
				default:;
			}
			
			//this.cfg.fileTypes = types;
		},
		setFileSizeLimit: function(limit){
			this.cfg.sizeLimit = limit;
		},
		//not support now
		/*setFileUploadLimit: function(limit){
			this.cfg.uploadLimit = limit;
		},*/
		setFileQueueLimit: function(limit){
			this.cfg.queueLimit = limit;
			this.elems.selector.multiple = limit !== 1;
		},
		__setStyle: function(mode, wrap, selector, text){
			wrap.className = CSS.WRAP;
			
			if(util.browser.firefox){
				selector.size = 6;
			}
			
			selector.className = CSS.SELECTOR;
			
			var label;
			label = wrap.getElementsByTagName('label');
			if(label.length){
				wrap.removeChild(label[0]);
			}
			
			label = document.createElement('label');
			label.className = CSS.TEXT;
			label.innerHTML = text;
			wrap.insertBefore(label, selector);
			
			//hover
			util.event.bind(wrap, 'mouseover', function(e){
				e.cancelBubble = true;
				e.returnValue = false;
				
				util.addClass(wrap, CSS.HOVER);
			});
			util.event.bind(wrap, 'mouseout', function(e){
				e.cancelBubble = true;
				e.returnValue = false;
				
				util.removeClass(wrap, CSS.HOVER);
			});
		},
		__translateStatus: function(status){
			// status: ON / OFF / true / false
			// disable / able
			var type = util.type(status);
			if(type === 'string'){
				status = util.trim(status);
				if(status.length){
					status = !!upload.TURNING[status.toUpperCase()];
				}else{
					status = upload.TURNING.OFF;
				}
			}else if(type === 'undefined'){
				status = !this._.status;
			}else{
				status = !!status;
			}
			
			return status;
		},
		turn: function(status){
			status = this.__translateStatus(status);
			// TODO: switch able status
			// flash version require override
			
			if(status !== this._.status){
				this.elems.selector.disabled = !status;
				this._.status = status;
				
				util[status ? 'removeClass' : 'addClass'](this.elems.holder, CSS.DISABLED);
			}
		},
		multiple: function(isMulti){
			this.elems.selector.multiple = !!isMulti;
		},
		/**
		* try to queue files.
		* -not support flash edition
		*/
		queue: function(){
			if(this.mode === MODE.IFRAME || this.mode === MODE.HTML5){
				//TODO
			}
		},
		/**
		* remove file out of queue. will not cause the error event.
		* @param {Int|String|Boolean} [arg] remove file out of queue.
			Int: index of the queue, greater than or equal 0
			String: file id of the queue files
			undefined: remove first file in the queue
			Boolean: -true empty the queue. -false remove first file in the queue
		*/
		dequeue: function(arg){
			if(this.mode === MODE.IFRAME || this.mode === MODE.HTML5){
				switch(util.type(arg)){
					case 'string': {
						for(var i = 0; i < this._.queue.length; i++){
							if(this._.queue[i].id === arg){
								arg = i;
								break;
							}
						}
					};
					case 'number': {
						this._.queue.splice(arg, 1);
					}; break;
					case 'undefined': {
						arg = false;
					}; break;
					case 'boolean': {
						if(arg){
							this._.queue.splice(0);
						}else{
							this._.queue.splice(0, 1);
						}
					}; break;
					default:;
				}
			}else if(this.mode === MODE.FLASH){
				switch(util.type(arg)){
					case 'string':
					case 'number': {
						this.instance.cancelUpload(arg, false);
					}; break;
					case 'undefined': {
						arg = false;
					};
					case 'boolean': {
						if(arg){
							var file;
							while(file = this.instance.getQueueFile()){
								this.instance.cancelUpload(file.file_id, false);
							}
						}else{
							this.instance.cancelUpload(0, false);
						}
					}; break;
					default:;
				}
			}
		}
	};
}.call(FOCUS, this, this.document);