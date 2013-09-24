;void function(window, document, undefined){
	FOCUS.namespace('FOCUS.widget');
	
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
	
	FOCUS.widget.Upload_Flash = function(cfg){
		this.constructor = arguments.callee;
		this.mode = FOCUS.widget.Upload.MODE.FLASH;

		this.cfg = {};
		this.elems = {};
		this._ = {
			flash_cfg: {
				flash_url: FOCUS.BASEPATH + 'widget/upload/flash/swfupload.swf',
				flash9_url: FOCUS.BASEPATH + 'wigdet/upload/flash/swfupload_fp9.swf',
				debug: false,
				file_upload_limit: -1,
				
				button_width: 650,
				button_height: 200,
				button_cursor: SWFUpload.CURSOR.HAND,
				button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT
			},
			status: FOCUS.widget.Upload.TURNING.ON
		};
		this.set(cfg);
		this.init();
		
		this.instance = new SWFUpload(this._.flash_cfg);
	};
	
	FOCUS.widget.Upload_Flash.prototype = new FOCUS.widget.UploadBase();
	FOCUS.util.extend(true, FOCUS.widget.Upload_Flash.prototype, {
		init: function(){
			this.elems.holder = document.createElement('div');
			this.elems.flashWrap = document.createElement('div');
			this.elems.flashHolder = document.createElement('span');
			var id = this.elems.flashHolder.id = 'FOCUS_UPLOAD_FlashHolder_' + FOCUS.util.random(0, 1000);
			
			var place = FOCUS.query
				? FOCUS.query(this._.flash_cfg.button_placeholder_id)
				: document.getElementById(this._.flash_cfg.button_placeholder_id);
			
			if('length' in place){
				place = place[0]
			}
			
			if(place){
				place.parentNode.insertBefore(this.elems.holder, place);
				this.elems.holder.appendChild(this.elems.flashWrap);
				this.elems.flashWrap.appendChild(this.elems.flashHolder);
			}
			
			this.__setStyle('flash', this.elems.holder, this.elems.flashWrap, this._.flash_cfg.button_text);
			
			this._.flash_cfg.button_placeholder_id = id;
			this._.flash_cfg.button_text = '';
		},
		set: function(cfg){
			FOCUS.util.extend(true, this.cfg, cfg);
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

			if(this.instance){
				this.multiple(this.cfg.multiple);
				this.setFileTypes(this.cfg.fileTypes);
				this.setFileSizeLimit(this.cfg.sizeLimit);
				this.setUploadURL(this.cfg.uploadURL);
				this.setFilePostName(this.cfg.filePostName);
				this.setFileQueueLimit(this.cfg.queueLimit);
			}
		},
		__setStyle: function(mode, wrap, flashWrap, text){
			var util = FOCUS.util;
			var CSS = FOCUS.widget.Upload.CSS;
			
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
			FOCUS.util.event.bind(wrap, 'mouseout', function(e){
				e.cancelBubble = true;
				e.returnValue = false;
				
				util.removeClass(wrap, CSS.HOVER);
			});
		},
		////////Methods
		startUpload: function(){
			return this.instance.startUpload();
		},
		cancelUpload: function(callback){
			if(FOCUS.util.type(callback) === 'function'){
				this.one('uploadError', callback);
			}
			
			this.instance.cancelUpload(0, true);
		},
		stopUpload: function(callback){
			if(FOCUS.util.type(callback) === 'function'){
				this.one('uploadError', callback);
			}
			
			this.instance.stopUpload();
		},
		/*getFile: function(){
			return this.instance.getFile.apply(this.instance, arguments);
		},*/
		
		//////implementation methods
		getQueueFile: function(index){
			return new FOCUS.widget.Upload.File(this.instance.getQueueFile(index));
		},
		////set
		setPostParam: function(params){
			return this.instance.setPostParam(params);
		},
		addPostParam: function(key, value){
			return this.instance.addPostParam(key, value);
		},
		removePostParam: function(key){
			return this.instance.removePostParam(key);
		},
		setUploadURL: function(url){
			this.cfg.uploadURL = url;
			return this.instance.setUploadURL(url);
		},
		setFilePostName: function(name){
			return this.instance.setFilePostName(name);
		},
		//require override
		setFileTypes: function(types, description){
			this.cfg.fileTypes = FOCUS.util.convert2MimeTypes(types);
			this.instance.setFileTypes(FOCUS.util.convertMimeTypes(types), description);
		},
		setFileSizeLimit: function(limit){
			this.cfg.sizeLimit = limt;
			this.instance.setFileSizeLimit(limit);
		},
		//not support now
		/*
		setFileUploadLimit: function(limit){
			this.cfg.uploadLimit = limit;
			this.instance.setFileUploadLimit(limit);
		},*/
		setFileQueueLimit: function(limit){
			this.cfg.queueLimit = limit;
			this.instance.setFileQueueLimit(limit);
		},
		__translateStatus: function(status){
			// status: ON / OFF / true / false
			// disable / able
			var type = FOCUS.util.type(status);
			if(type === 'string'){
				status = FOCUS.util.trim(status);
				if(status.length){
					status = !!FOCUS.widget.Upload.TURNING[status.toUpperCase()];
				}else{
					status = FOCUS.widget.Upload.TURNING.OFF;
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
			var util = FOCUS.util;
			var CSS = FOCUS.widget.Upload.CSS;
			var CURSOR = FOCUS.widget.Upload.CURSOR;
			
			this._.status = status;
			util[status ? 'removeClass' : 'addClass'](this.elems.holder, CSS.DISABLED);
			
			this.ready(function(){
				this.instance.setButtonDisabled(!status);
				this.instance.setButtonCursor(CURSOR[status ? 'POINTER' : 'DEFAULT']);
			});
		},
		multiple: function(isMulti){
			this.instance.setButtonAction(SWFUpload.BUTTON_ACTION[isMulti ? 'SELECT_FILES' : 'SELECT_FILE']);
		}
	});
}.call(this, this, document);