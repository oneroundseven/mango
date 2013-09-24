;void function(window, document, undefined){
	var createElem = FOCUS.util.createElement;
	var Poster = FOCUS.widget.io.iframe.Poster;
	var IO_FormData = FOCUS.widget.io.iframe.IO_FormData;
	var noop = function(){};

	///////
	FOCUS.widget.Upload_Iframe = function(cfg){
		this.constructor = arguments.callee;
		this.mode = FOCUS.widget.Upload.MODE.IFRAME;
		
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
			uploadingFile: null,
			uploadedFile: [],
			status: FOCUS.widget.Upload.TURNING.ON
		};
	
		this.set(cfg);
		this.init();
	};
	
	FOCUS.widget.Upload_Iframe.prototype = new FOCUS.widget.UploadBase();
	FOCUS.util.extend(true, FOCUS.widget.Upload_Iframe.prototype, {
		init: function(){
			var _this = this;

			/*this.elems.resetForm = createElem({
				el: 'form',
				name: 'FOCUS_UPLOAD_RESET_' + FOCUS.util.random(0, 1000)
			});*/
			
			this.elems.holder = createElem({
				el: 'div'
			});
			this.elems.holder.style.cssText = '';
			
			//validate errors
			var validate_errors = {
				missing_url: [FOCUS.widget.Upload.UPLOAD_ERROR.MISSING_UPLOAD_URL, 'missing upload URL.'],
				invalid_filetype: [FOCUS.widget.Upload.QUEUE_ERROR.INVALID_FILETYPE, 'File is not an allowed file type.'],
				size_limit: [FOCUS.widget.Upload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT, 'File size exceeds allowed limit.'],
				chain_error: [FOCUS.widget.Upload.QUEUE_ERROR.CHAIN_ERROR, 'Some reason to occured chain error.']
			};

			//events
			FOCUS.util.extend(this._, {
				post: function(file){
					var data = new IO_FormData;
					if(FOCUS.util.type(_this.cfg.postParams) === 'object'){
						for(var key in _this.cfg.postParams){
							data.append(key, _this.cfg.postParams[key]);
						}
					}
					
					data.append(_this.cfg.filePostName || file.id, file.data);
					
					_this.elems.poster.open('POST', _this.cfg.uploadURL, true);
					
					//setTimeout(function(){
						_this.elems.poster.send(data);
					//}, 1);
				},
				start: function(e){
					var file = _this.getQueueFile();
					if(file){
						if(!_this.cfg.uploadURL || FOCUS.util.type(_this.cfg.uploadURL) !== 'string'){
							_this.cfg.events.uploadError.apply(_this, [file].concat(validate_errors['missing_url']));
							
							_this.stopUpload();
							return;
						}
						
						file.status = FOCUS.widget.Upload.FILE_STATUS.IN_PROGRESS;
						_this._.uploadingFile = file;
						_this.cfg.events.uploadStart.call(_this, file);
						_this._.post(file);
					}
				},
				dialogStart: function(e){
					e = e || window.event;
					e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
					//e.preventDefault ? e.preventDefault() : e.returnValue = false;
					
					_this.cfg.events.dialogStart.call(_this);
				},
				__queued: function(isFromDialog, callback){
					// this: input:file element
					var selected = [], queued = [], total = _this._.queue;
					
					var file = new FOCUS.widget.Upload.File(this);
					
					if(this.files && (!FOCUS.util.browser.firefox || (FOCUS.util.browser.firefox && FOCUS.util.browser.version >= 3.6))){ // support html5 files object
						var tmpQueued = [];
						var errorFlag = false;
						var file2valid;
						
						//exceed queue limit
						if(_this.cfg.queueLimit !== -1 && (this.files.length + _this._.queue.length) > _this.cfg.queueLimit){
							for(var i = 0, len = this.files.length; i < len; i++){
								file2valid = new FOCUS.widget.Upload.File(this.files[i]);
								selected.push(file2valid);
								
								_this.cfg.events.queueError.call(_this, file2valid, FOCUS.widget.Upload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED, _this.cfg.queueLimit);
							}
							
							errorFlag = true;
						}else{
							var sizeLimit = FOCUS.util.sizeConvert.unit2Bytes(_this.cfg.sizeLimit);
							
							// validate
							for(var i = 0, len = this.files.length; i < len; i++){
								file2valid = new FOCUS.widget.Upload.File(this.files[i]);
								selected.push(file2valid);

								var error;
								//filetype
								if(!FOCUS.util.mimeValidation(_this.cfg.fileTypes, file2valid.type)){
									error = validate_errors['invalid_filetype'];
								}else if(_this.cfg.sizeLimit !== -1 && (file2valid.fileSize || file2valid.size) > sizeLimit){ //filesize
									error = validate_errors['size_limit'];
								}
								
								if(!error){
									tmpQueued.push(file2valid);
								}else{
									_this.cfg.events.queueError.apply(_this, [file2valid].concat(error));
									errorFlag = true;
								}
							}
						}
						
						if(errorFlag){
							for(var i = 0, len = tmpQueued.length; i < len; i++){
								tmpQueued[i].id = file.id;
								_this.cfg.events.queueError.apply(_this, [tmpQueued[i]].concat(validate_errors['chain_error']));
							}
						}else{
							for(var i = 0, len = tmpQueued.length; i < len; i++){
								tmpQueued[i].status = FOCUS.widget.Upload.FILE_STATUS.QUEUED;
								tmpQueued[i].id = file.id;
								_this.cfg.events.queued.call(_this, tmpQueued[i]);
							}
							
							queued = queued.concat(tmpQueued);
							total.push(file);
						}
						
						delete tmpQueued;
					}else{ // normal input:file -- html4
						selected.push(file);
						
						if(FOCUS.util.mimeValidation(_this.cfg.fileTypes, file.type)){
							queued.push(file);
							total.push(file);
							file.status = FOCUS.widget.Upload.FILE_STATUS.QUEUED;
							_this.cfg.events.queued.call(_this, file);
						}else{
							_this.cfg.events.queueError.apply(_this, [file].concat(validate_errors['invalid_filetype']));
						}
					}

					if(isFromDialog){
						_this.elems.selector.parentNode.removeChild(_this.elems.selector);
						_this.elems.selector = _this._._crateSelector(_this.elems.holder, _this._.dialogStart, _this._.dialogComplete);
						
						//_this.elems.resetForm.reset();
						// total.length: total means all in queue, but in iframe method upload, only 1 append to total in one selected file
						//_this.cfg.events.dialogComplete.call(_this, selected.length, queued.length, total.length);
					}
					
					//excute callback
					if(FOCUS.util.type(callback) === 'function'){
						callback.call(_this, selected.length, queued.length, total.length);
					}
					
					delete selected;
					delete queued;
					delete total;
				},
				dialogComplete: function(e){
					e = e || window.event;
					e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
					
					_this._.__queued.call(this, true, _this.cfg.events.dialogComplete);
				},
				uploadProgress: function(e){
					var file = _this.getQueueFile();
					file.status = FOCUS.widget.Upload.FILE_STATUS.IN_PROGRESS;
					if(e.loaded === e.total){ //markup the 100 percent in uploading
						file.fullProgress = true;
					}
					
					_this.cfg.events.uploadProgress.call(_this, file, e.loaded, e.total);
				},
				uploadSuccess: function(data, context){
					var poster = _this.elems.poster;
					var file = _this.getQueueFile();
					_this.cfg.events.uploadSuccess.call(_this, file, data, poster);
				},
				uploadError: function(context, msg){
					msg = (msg || '').toUpperCase();
					
					var file = _this.getQueueFile();
					file.status = FOCUS.widget.Upload.FILE_STATUS.ERROR;
					_this.cfg.events.uploadError.call(_this, file, FOCUS.widget.Upload.UPLOAD_ERROR[msg ? msg : 'UPLOAD_FAILED'], msg ? msg : 'TIMEOUT');
					
					_this._.uploadComplete(true);
				},
				uploadComplete: function(fail, isStop){
					var file = _this.getQueueFile();
				
					if(!fail && !file.fullProgress && !isStop){
						_this._.uploadProgress.call(_this, { loaded: file.size, total: file.size });
						file.fullProgress = true;
					}
					
					if(!isStop){
						file.status = FOCUS.widget.Upload.FILE_STATUS.COMPLETE;
					}
					
					_this._.queue.shift();
					_this._.uploadingFile = null;
					
					_this.cfg.events.uploadComplete.call(_this, file);
					
					//if(!isStop){
						//_this._.start();
					//}
				},
				complete: function(data, context){
					_this._.uploadSuccess.call(_this, data, context);
					_this._.uploadComplete.call(_this);
					
					//In IE, no dispose, it will refuse access iframe when F5 refresh
					setTimeout(function(){
						//for firefox, at this the iframe loaded time,
						//there is a loading progress bar always in firefox that destroy the iframe straightway.
						//use timer to restore it
						if(_this.elems.poster){
							_this.elems.poster.dispose();
							delete _this.elems.poster;
						}
					}, 25);
				},
				abort: function(){
					_this._.uploadComplete(false, true);
				},
				_crateSelector: function(wrap, dialogStart, dialogComplete){
					var selector = createElem({
						el: 'input',
						type: 'file',
						name: 'FOCUS_FILE_' + FOCUS.util.random(0, 100),
						//'class': FOCUS.widget.Upload.CSS.SELECTOR,
						multiple: !!_this.cfg.multiple//,
						//accept: FOCUS.util.browser.chrome ? '*/*' : _this.cfg.fileTypes
					});
					
					wrap.appendChild(selector);
					FOCUS.util.event.bind(selector, 'click', dialogStart);
					FOCUS.util.event.bind(selector, 'change', dialogComplete);
					
					_this.__setStyle('iframe', _this.elems.holder, selector, _this.cfg.button.text);
					
					return selector;
				}
			});
			
			
			//holder
			var place = FOCUS.query
				? FOCUS.query(this.cfg.placeholder)
				: document.getElementById(this.cfg.placeholder.replace(/^#/, ''));
				
			if(place){
				if('length' in place){
					place = place[0];
				}
				
				if(place){
					place.parentNode.insertBefore(this.elems.holder, place);
					//this.elems.holder.appendChild(this.elems.resetForm);
					_this.elems.selector = this._._crateSelector(this.elems.holder, this._.dialogStart, this._.dialogComplete);
					place.parentNode.removeChild(place);
				}
			}
		},
		startUpload: function(){
			if(this.elems.poster){
				this.elems.poster.dispose();
			}
			
			this.elems.poster = new Poster({
				events: {
					abort: this._.abort,
					load: this._.complete,
					error: this._.uploadError,
					progress: this._.uploadProgress
				},
				progressURL: this.cfg.progressURL,
				charset: this.cfg.charset,
				timeout: this.cfg.timeout || 100000
			});
			
			this._.start();
		},
		/**
		* queue files
		* @param {FileInput|FileInput[]} files
		* @param {Function} [callback] queue completed callback
		*/
		queue: function(files, callback){
			if(!files){
				return;
			}
			
			if(files.length === undefined){
				files = [files];
			}
			
			for(var i = 0; i < files.length; i++){
				this._.__queued.call(files[i], false, callback);
			}
		}
	});
}.call(this, this, this.document);

/**
* Known Problems
* 1 in chrome, if cross domain, try...catch.. could not catch the 'unsafe error' tip on access iframe.contentWindow in 'getData' method calling with IO_Iframe object
*/






































