;void function(window, document, undefined){
	var util = this.util;
	var widget = this.widget;
	var upload = widget.Upload;
	var BASEPATH = this.BASEPATH;
	var PATH_FLASH = this.PATH_FLASH;
	var PATH_FLASH_FP9 = this.PATH_FLASH_FP9;
	var MODE = upload.MODE;
	var CURSOR = upload.CURSOR;
	var CSS = upload.CSS;
	
	var DIC_PARAMS = {
		flash_url:						'flashURL',
		flash9_url:						'flash9URL',
		upload_url:						'uploadURL',
		file_post_name:					'filePostName',
		post_params:					'postParams',
		file_types:						'fileTypes',
		file_types_description:			'fileTypesDescription',
		file_upload_limit:				'uploadLimit',
		file_size_limit:				'sizeLimit',
		file_queue_limit:				'queueLimit',
		button_placeholder_id:			'placeholder',
		swfupload_loaded_handler:		'events.ready',
		swfupload_load_failed_handler:	'events.fail',
		file_dialog_start_handler:		'events.dialogStart',
		file_queued_handler:			'events.queued',
		file_queue_error_handler:		'events.queueError',
		file_dialog_complete_handler:	'events.dialogComplete',
		upload_start_handler:			'events.uploadStart',
		upload_progress_handler:		'events.uploadProgress',
		upload_error_handler:			'events.uploadError',
		upload_success_handler:			'events.uploadSuccess',
		upload_complete_handler:		'events.uploadComplete',
		debug:							'debug',
		button_width:					'button.width',
		button_height:					'button.height',
		button_text:					'button.text'
	};
	
	var getValue = function(path){
		path = path || '';
		var arr_path = path.split(/\./);
		
		var part = this;
		var gotIt = false;
		var key;
		
		while(key = arr_path.shift()){
			if(key in part){
				gotIt = true;
				part = part[key];
				//continue;
			}else{
				gotIt = false;
				break;
			}
		}
		
		return {
			has: gotIt,
			value: gotIt ? part : null
		};
	};
	
	widget.Upload_Flash = function(cfg){
		this.constructor = arguments.callee;
		this.mode = MODE.FLASH;

		this.cfg = {};
		this.elems = {};
		this._ = {
			flash_cfg: {
				flash_url: PATH_FLASH || BASEPATH + 'widget/upload/flash/swfupload.swf',
				flash9_url: PATH_FLASH_FP9 || BASEPATH + 'wigdet/upload/flash/swfupload_fp9.swf',
				debug: false,
				file_upload_limit: -1,
				
				button_width: 650,
				button_height: 200,
				button_cursor: CURSOR.POINTER,
				button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT
			},
			status: upload.TURNING.ON
		};
		this.set(cfg);
		this.init();
		
		this.instance = new SWFUpload(this._.flash_cfg);
	};
	
	widget.Upload_Flash.prototype = new widget.UploadBase();
	util.extend(true, widget.Upload_Flash.prototype, {
		init: function(){
			this.elems.holder = document.createElement('div');
			this.elems.flashWrap = document.createElement('div');
			this.elems.flashHolder = document.createElement('span');
			var id = this.elems.flashHolder.id = 'FOCUS_UPLOAD_FlashHolder_' + util.random(0, 1000);
			
			var place = util.query
				? util.query(this._.flash_cfg.button_placeholder_id)
				: document.getElementById(this._.flash_cfg.button_placeholder_id.replace(/^#/, ''));
			
			if('length' in place){
				place = place[0]
			}
			
			if(place){
				place.parentNode.insertBefore(this.elems.holder, place);
				place.parentNode.removeChild(place);
				this.elems.holder.appendChild(this.elems.flashWrap);
				this.elems.flashWrap.appendChild(this.elems.flashHolder);
			}
			
			this.__setStyle('flash', this.elems.holder, this.elems.flashWrap, this._.flash_cfg.button_text);
			
			this._.flash_cfg.button_placeholder_id = id;
			this._.flash_cfg.button_text = '';
		},
		set: function(cfg){
			util.extend(true, this.cfg, cfg);
			this.__setFlashCfg(this.cfg);
		},
		__setFlashCfg: function(cfg){
			var dic = DIC_PARAMS;
			
			var ret;
			for(var key in dic){
				ret = getValue.call(cfg, dic[key]);

				if(ret.has){
					this._.flash_cfg[key] = ret.value;
				}
			}
			
			//multi / single file(s) selection dialog
			this._.flash_cfg.button_action = SWFUpload.BUTTON_ACTION[cfg.multiple ? 'SELECT_FILES' : 'SELECT_FILE'];

			if(this.isReady){
				this.multiple(this.cfg.multiple);
				this.setFileTypes(this.cfg.fileTypes);
				this.setFileSizeLimit(this.cfg.sizeLimit);
				this.setUploadURL(this.cfg.uploadURL);
				this.setFilePostName(this.cfg.filePostName);
				this.setFileQueueLimit(this.cfg.queueLimit);
			};
		},
		__setStyle: function(mode, wrap, flashWrap, text){
			wrap.className = CSS.WRAP;
			flashWrap.className = CSS.FLASH;
			
			var label;
			label = wrap.getElementsByTagName('label');
			if(label.length){
				wrap.removeChild(label[0]);
			}
			
			label = document.createElement('label');
			label.className = CSS.TEXT;
			label.innerHTML = text;
			wrap.insertBefore(label, flashWrap);
			
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
		////////Methods
		startUpload: function(){
			this.ready(function(){
				this.instance.startUpload();
			});
		},
		cancelUpload: function(callback){
			this.ready(function(){
				if(util.type(callback) === 'function'){
					this.one('uploadError', callback);
				}
				
				this.instance.cancelUpload(0, true);
			});
		},
		stopUpload: function(callback){
			if(util.type(callback) === 'function'){
				this.one('uploadError', callback);
			}
			
			this.instance.stopUpload();
		},
		/*getFile: function(){
			return this.instance.getFile.apply(this.instance, arguments);
		},*/
		
		//////implementation methods
		getQueueFile: function(index){
			return new upload.File4Flash(this.instance.getQueueFile(index));
		},
		////set
		setPostParam: function(params){
			this.ready(function(){
				this.instance.setPostParam(params);
			});
		},
		addPostParam: function(key, value){
			this.ready(function(){
				this.instance.addPostParam(key, value);
			});
		},
		removePostParam: function(key){
			this.ready(function(){
				this.instance.removePostParam(key);
			});
		},
		setUploadURL: function(url){
			this.ready(function(){
				this.cfg.uploadURL = url;
				this.instance.setUploadURL(url);
			});
		},
		setFilePostName: function(name){
			this.ready(function(){
				this.instance.setFilePostName(name);
			});
		},
		//require override
		setFileTypes: function(types, description){
			this.ready(function(){
				this.cfg.fileTypes = util.convert2MimeTypes(types);
				this.instance.setFileTypes(util.convertMimeTypes(types), description || this.cfg.fileTypesDescription);
			});
		},
		setFileSizeLimit: function(limit){
			this.ready(function(){
				this.cfg.sizeLimit = limt;
				this.instance.setFileSizeLimit(limit);
			});
		},
		//not support now
		/*
		setFileUploadLimit: function(limit){
			this.cfg.uploadLimit = limit;
			this.instance.setFileUploadLimit(limit);
		},*/
		setFileQueueLimit: function(limit){
			this.ready(function(){
				this.cfg.queueLimit = limit;
				this.instance.setFileQueueLimit(limit);
			})
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
				status = !_this._.status;
			}else{
				status = !!status;
			}
			
			return status;
		},
		turn: function(status){
			status = this.__translateStatus(status);
			// TODO: switch able status
			// flash version require override
			this._.status = status;
			util[status ? 'removeClass' : 'addClass'](this.elems.holder, CSS.DISABLED);
			
			this.ready(function(){
				this.instance.setButtonDisabled(!status);
				this.instance.setButtonCursor(CURSOR[status ? 'POINTER' : 'DEFAULT']);
			});
		},
		multiple: function(isMulti){
			this.ready(function(){
				this.instance.setButtonAction(SWFUpload.BUTTON_ACTION[isMulti ? 'SELECT_FILES' : 'SELECT_FILE']);
			});
		}
	});
}.call(FOCUS, this, document);