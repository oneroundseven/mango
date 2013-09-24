;void function(window, document, undefined){
	var upload = this.widget.Upload;
	var util = this.util;
	
	var MODE = upload.MODE = {
		HTML5: 'html5',
		FLASH: 'flash',
		IFRAME: 'iframe',
		DEFAULT: 'html5'
	};
	
	upload.PRIORITY = {
		DEFAULT: [ MODE.HTML5, MODE.FLASH, MODE.IFRAME ]
	};
	
	upload.MIME_TYPE = {
		ALL: '*/*',
		IMAGE: 'image/*',
		JPG: 'image/jpeg',
		JPEG: 'image/jpeg',
		PNG: 'image/png',
		GIF: 'image/gif',
		PDF: 'application/pdf',
		DOC: 'application/msword',
		DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		XLS: 'application/vnd.ms-excel',
		XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		PPT: 'application/vnd.ms-powerpoint',
		PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		TXT: 'text/plain',
		UNKNOWN: 'application/octet-stream'
	};
	
	upload.QUEUE_ERROR = {
		QUEUE_LIMIT_EXCEEDED            : -100,
		FILE_EXCEEDS_SIZE_LIMIT         : -110,
		ZERO_BYTE_FILE                  : -120,
		INVALID_FILETYPE                : -130,
		CHAIN_ERROR						: -140 //use iframe method upload, if browser support html5, an error occured on one file object will lead other files to occured error
	};
	
	upload.UPLOAD_ERROR = {
		HTTP_ERROR                      : -200,
		MISSING_UPLOAD_URL              : -210,
		IO_ERROR                        : -220,
		SECURITY_ERROR                  : -230,
		UPLOAD_LIMIT_EXCEEDED           : -240,
		UPLOAD_FAILED                   : -250,
		SPECIFIED_FILE_ID_NOT_FOUND     : -260,
		FILE_VALIDATION_FAILED          : -270,
		FILE_CANCELLED                  : -280,
		UPLOAD_STOPPED                  : -290,
		RESIZE                          : -300,
		TIMEOUT							: -310
	};
	
	upload.FILE_STATUS = {
		QUEUED       : -1,
		IN_PROGRESS  : -2,
		ERROR        : -3,
		COMPLETE     : -4,
		CANCELLED    : -5,
		NEW			 : -6
	};
	
	upload.UPLOAD_TYPE = {
		SINGLE:	1,
		MULTI:	2
	};

	upload.BUTTON_ACTION = {
		SELECT_FILE             : -100,
		SELECT_FILES            : -110,
		START_UPLOAD            : -120,
		JAVASCRIPT              : -130,	// DEPRECATED
		NONE                    : -130
	};
	
	upload.CURSOR = {
		POINTER					: -2,
		DEFAULT					: -1
	};
	
	upload.CSS = {
		WRAP:		'FOCUS_UPLOAD_wrap',
		SELECTOR:	'FOCUS_UPLOAD_selector',
		FLASH:		'FOCUS_UPLOAD_flashWrap',
		TEXT:		'FOCUS_UPLOAD_text',
		DISABLED:	'FOCUS_UPLOAD_wrap_disabled',
		HOVER:		'FOCUS_UPLOAD_wrap_hover'
	};
	
	upload.CHARSET = {
		UTF8:		'UTF-8',
		GBK:		'GBK',
		GB2312:		'GB2312',
		BIG5:		'BIG5',
		DEFAULT:	'UTF-8'
	};
	
	upload.TURNING = {
		ON:		true,
		OFF:	false
	};
	
	var _getFilename = function(fullname, ret){
		ret = ret || {};
		
		var nameFrag = fullname.split(/\./);
			
		if(nameFrag.length > 1){
			ret.suffix = nameFrag.pop();
		}else{
			ret.suffix = '';
		}
		
		ret.name = nameFrag.join('.');
		
		return ret;
	};
	
	upload.File = function(file){
		var _file = { data: file };
		_file.id = 'FOCUS_UPLOAD_' + (util.random(0, 1000000) + ~~((new Date()).valueOf() / 10000000)).toString(16).toUpperCase();
		
		if(file.tagName && file.tagName.toLowerCase() === 'input' && file.type === 'file'){
			var r_fullname = /[^\/\\]+$/;
			var fullname = r_fullname.exec(file.value);
			if(fullname){
				_file.fullname = fullname[0];
				_getFilename(_file.fullname, _file);
			}
			
			if(_file.suffix){
				_file.type = _file.suffix.toUpperCase() in upload.MIME_TYPE ? upload.MIME_TYPE[_file.suffix.toUpperCase()] : '';
			}else{
				_file.type = '';
			}
		}else{
			_file.size = file.filesize || file.size || 0;
			_file.type = file.type || '';
			_file.fullname = file.filename || file.name || '';
			
			_getFilename(_file.fullname, _file);
			
			if(_file.suffix){
				_file.type = _file.suffix.toUpperCase() in upload.MIME_TYPE ? upload.MIME_TYPE[_file.suffix.toUpperCase()] : '';
			}else{
				_file.type = '';
			}
		}
		
		_file.status = upload.FILE_STATUS.NEW;
		
		return _file;
	};
	
	upload.File4Flash = function(file){
		this.data = file;
		this.id = file.id;
		this.size = file.size;
		this.status = file.filestatus;
		this.suffix = file.type.replace(/^\./, '');
		this.type = upload.MIME_TYPE[this.suffix.toUpperCase()];
		this.fullname = file.name;

		var nameFrag = this.fullname.split(/\./);
		
		if(nameFrag.length > 1){
			nameFrag.pop();
		}else{ }
		
		this.name = nameFrag.join('.');
	};
}.call(FOCUS, this, this.document);