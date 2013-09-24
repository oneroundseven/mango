;void function(window, document, undefined){
	var noop = function(){};
	var util = this.util;
	var widget = this.widget;
	var upload = widget.Upload;
	var MODE = upload.MODE;
	var UPLOAD_ERROR = upload.UPLOAD_ERROR;
	var FILE_STATUS = upload.FILE_STATUS;
	var QUEUE_ERROR = upload.QUEUE_ERROR;
	
	widget.Upload_HTML5 = function(cfg){
		this.constructor = arguments.callee;
		this.mode = MODE.HTML5;
		
		this.elems = {};
		this.cfg = {
			//priority: FOCUS.widget.Upload.PRIORITY.DEFAULT,
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
			queueLimit: -1,
			fileTypes: upload.MIME_TYPE.ALL,
			fileTypesDescription: 'All Files',
			uploadURL: '',
			filePostName: '',
			placeholder: '#uploader',
			charset: upload.CHARSET.DEFAULT,
			debug: false,
			timeout: 100000
		};
		
		this._ = {
			queue: [],
			uploadingFile: null,
			cancel: false,
			status: upload.TURNING.ON
		};
		
		this.set(cfg);
		this.init();
	};
	
	widget.Upload_HTML5.prototype = new widget.UploadBase();
	util.extend(true, widget.Upload_HTML5.prototype, {
		init: function(){
			var _this = this;
			
			//EVENTS
			this._.start = function(){
				var file = _this.getQueueFile();
				if(file){
					if(!_this.cfg.uploadURL || util.type(_this.cfg.uploadURL) !== 'string'){
						_this.cfg.events.uploadError.call(_this, file, UPLOAD_ERROR.MISSING_UPLOAD_URL, 'missing upload url.');
						
						_this.stopUpload();
						return;
					}
					
					file.status = FILE_STATUS.IN_PROGRESS;
					_this._.uploadingFile = file;
					_this.cfg.events.uploadStart.call(_this, file);
					_this._.post(file);
				}
			};
			
			this._.success = function(e){
				var poster = _this.elems.poster;
				var file = _this.getQueueFile();
				_this.cfg.events.uploadSuccess.call(_this, file, poster.responseText || poster.responseXML, poster);
				//_this._.uploadComplete();
			};
			
			this._.error = function(e, code, msg){
				if(!_this._.cancel){
					var file = _this.getQueueFile();
					if(file){
						file.status = FILE_STATUS.ERROR;
						
						_this.cfg.events.uploadError.call(_this, file, code || UPLOAD_ERROR.UPLOAD_FAILED, msg || '');
						_this._.uploadComplete();
					}
				}
			};
			
			this._.abort = function(e){
				//_this.stopUpload();
				//_this.getQueueFile().status = FOCUS.widget.Upload.FILE_STATUS.CANCELLED;
				
				//_this.cfg.events.uploadError.call(_this, file, FOCUS.widget.Upload.UPLOAD_ERROR.FILE_CANCELLED);
				//_this._.queue.shift();
				//_this._.uploadingFile = null;

				//_this._.start();
				_this._.cancel = true;
				_this._.uploadComplete(true);
			};
			
			this._.progress = function(e){
				var file = _this.getQueueFile();
				if(file){
					if(e.loaded === e.total){ //markup the 100 percent in uploading
						file.fullProgress = true;
					}
					
					_this.cfg.events.uploadProgress.call(_this, file, e.loaded, e.total);
				}
			};
			
			//post handle
			this._.post = function(file){
				//setTimeout(function(){
					_this.elems.poster.open('POST', _this.cfg.uploadURL, true);
					
					var data;
					if(FormData.customized){
						data = new FormData(_this.cfg.charset);
					}else{
						data = new FormData();
					}

					if(util.type(_this.cfg.postParams) === 'object'){
						for(var key in _this.cfg.postParams){
							data.append(key, _this.cfg.postParams[key]);
						}
					}
					
					data.append(_this.cfg.filePostName || file.id, file.data);
					
					if(util.feature_upload.html5.FormData){
						_this.elems.poster.send(data);
					}else{
						_this.elems.poster.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + data.boundary);
						_this.elems.poster.sendAsBinary(data);
					}
				//}, 1);
			};
			
			//uploadComplete
			this._.uploadComplete = function(isStop){
				var file = _this.getQueueFile();
				
				if(file){
					if(!file.fullProgress){
						_this._.progress.call(_this, { loaded: file.size, total: file.size });
						file.fullProgress = true;
					}
					
					if(!isStop){
						file.status = FILE_STATUS.COMPLETE;
					}
					
					_this._.queue.shift();
					_this._.uploadingFile = null;
					
					_this.cfg.events.uploadComplete.call(_this, file);
					
					//if(!isStop){
						//_this._.start();
					//}
				}
			};
			
			//xhr complete
			this._.xhrComplete = function(e){
				if(this.readyState === 4){
					switch(this.status){
						case 200: {
							_this._.success.call(this, e);
							_this._.uploadComplete();
						}; break;
						case 404:
						case 500: {
							_this._.error.call(this, e, UPLOAD_ERROR.HTTP_ERROR, this.status);
						}; break;
						default:;
					}
				}
			};
			
			//dialog start <== input:file click event
			this._.dialogStart = function(e){
				e = e || window.event;
				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				//e.preventDefault ? e.preventDefault() : e.returnValue = false;
				
				_this.cfg.events.dialogStart.call(_this);
			};
			
			//enter the queue
			this._.__queued = function(files, callback){
				var isFromDialog = !files;
				var selected = [], queued = [], total = _this._.queue;
				var file;
				files = files || _this.elems.selector.files;
				selected = [].slice.call(files);
				
				//exceed queue limit
				if(_this.cfg.queueLimit !== -1 && (selected.length + _this._.queue.length) > _this.cfg.queueLimit){
					for(var i = 0, len = selected.length; i < len; i++){
						_this.cfg.events.queueError.call(_this, selected[i], QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED, _this.cfg.queueLimit);
					}
				}else{ // other validations
					for(var i = 0, len = selected.length; i < len; i++){
						file = new upload.File(selected[i]);
						
						file.status = FILE_STATUS.ERROR;

						if(!FOCUS.util.mimeValidation(_this.cfg.fileTypes, file.type)){
							_this.cfg.events.queueError.call(_this, file, QUEUE_ERROR.INVALID_FILETYPE, 'File is not an allowed file type.');
							continue;
						}
						
						//zero size file
						if((file.fileSize || file.size) === 0){
							_this.cfg.events.queueError.call(_this, file, QUEUE_ERROR.ZERO_BYTE_FILE, 'File is zero bytes and cannot be uploaded.');
							continue;
						}
						
						var sizeLimit = util.sizeConvert.unit2Bytes(_this.cfg.sizeLimit);
						//exceed size limit
						if(sizeLimit !== -1 && (file.fileSize || file.size) > sizeLimit){
							_this.cfg.events.queueError.call(_this, file, QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT, 'File size exceeds allowed limit.');
							continue;
						}
						
						file.status = FILE_STATUS.QUEUED;
						
						_this.cfg.events.queued.call(_this, file);
						queued.push(file);
						total.push(file)
					}
				}
				
				if(isFromDialog){
					//_this.elems.resetForm.reset();
					_this._._resetSelector();
					_this.cfg.events.dialogComplete.call(_this, selected.length, queued.length, total.length);
				}else{
					//TODO
					util.type(callback) === 'function' && callback.call(_this, selected.length, queued.length, total.length);
				}
				
				delete selected;
				delete queued;
				delete total;
			};
			
			//dialog complete <== input:file change event
			this._.dialogComplete = function(e, files){
				e = e || window.event;
				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				//e.preventDefault ? e.preventDefault() : e.returnValue = false;
				
				_this._.__queued();
			};
			
			//reset the file selector
			this._._resetSelector = function(){
				_this.elems.resetForm.appendChild(_this.elems.selector);
				setTimeout(function(){
					_this.elems.resetForm.reset();
					setTimeout(function(){
						_this.elems.holder.appendChild(_this.elems.selector);
					}, 25);
				},25);
			};
			
			//this.cfg.placeholder
			//holder elem
			this.elems.holder = document.createElement('div');
			this.elems.holder.style.cssText = '';
			this.elems.resetForm = document.createElement('form');
			this.elems.selector = document.createElement('input');
			this.elems.selector.type = 'file';
			this.elems.selector.multiple = util.feature_upload.html5.multiple && this.cfg.multiple;
			this.elems.holder.accept = this.cfg.fileTypes;
			
			var place = util.query ? util.query(this.cfg.placeholder) : document.querySelectorAll(this.cfg.placeholder);
			if(place.length){
				place = place[0];
				place.parentNode.insertBefore(this.elems.holder, place);
				//this.elems.holder.appendChild(this.elems.resetForm);
				this.elems.holder.appendChild(this.elems.selector);
				place.parentNode.removeChild(place);
				
				FOCUS.util.event.bind(this.elems.selector, 'click', this._.dialogStart);
				FOCUS.util.event.bind(this.elems.selector, 'change', this._.dialogComplete);
				
				this.__setStyle('html5', this.elems.holder, this.elems.selector, this.cfg.button.text);
			}else{}
		},
		//override
		startUpload: function(){
			//gen poster
			this.elems.poster = new XMLHttpRequest();
			//FOCUS.util.event.bind(this.elems.poster.upload, 'load', this._.success);
			util.event.bind(this.elems.poster.upload, 'progress', this._.progress);
			util.event.bind(this.elems.poster.upload, 'error', this._.error);
			util.event.bind(this.elems.poster.upload, 'abort', this._.abort);
			util.event.bind(this.elems.poster, 'readystatechange', this._.xhrComplete);
			
			this._.start();
		},
		/*cancelUpload: function(){
			var file = this.getQueueFile();
			file.status = FOCUS.widget.Upload.FILE_STATUS.CANCELLED;
			this.cfg.events.uploadError.call(_this, file, FOCUS.widget.Upload.UPLOAD_ERROR.FILE_CANCELLED, 'file cancelled.');
			this.elems.poster && this.elems.poster.abort();
		},
		stopUpload: function(){
			var file = this.getQueueFile();
			file.status = FOCUS.widget.Upload.FILE_STATUS.QUEUED;
			this.cfg.events.uploadError.call(this, file, FOCUS.widget.Upload.UPLOAD_ERROR.UPLOAD_STOPPED, 'upload stopped.');
			this.elems.poster && this.elems.poster.abort();
			this._.queue.unshift(file);
		},*/
		/*setFileTypes: function(mimeTypes){
			this.cfg.fileTypes = this.elems.selector.accept = util.convert2Mimetype(mimeTypes);
		},*/
		/*setFileQueueLimit: function(limit){
			this.cfg.queueLimit = limit;
			this.elems.selector.multiple = limit !== 1;
		},*/
		/**
		* try to queue files
		* only surport for HTML5 edtion
		* @param {HTMLFileInput|HTMLInputElement#FileList|File[]} files
		* @param {Function} [callback] queueCompelete callback
		*/
		queue: function(files, callback){
			if(files.files){ //typeof files === input:file
				files = files.files;
			}
			
			if(!files || !files.length){
				return;
			}
			
			this._.__queued(files, callback);
		}
	});
}.call(FOCUS, this, this.document);

//// Known Problems
// 1. when use Firefox v > 3.5, < 4, custom class FormData, cannot convert non-ASCII characters to Binary String at FormData.prototype.append method, the parameter 'name' and the 'filename' in data will use UTF-8 URI coding instead.
//   server side developer have to convert the UTF-8 URI coding to normal characters
// [FIXED] use flash to translate chars. but if browser not support flash, also use URI encode