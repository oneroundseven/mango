/**
* 文件类
* @class
* @constructor
* @function
* @name File
* @namespace FOCUS.widget.Upload
* @link file_instance
* @param {FileInput|File|FlashFileInfo} file 文件数据.
* @example
	var file = new FOCUS.widget.Upload.File(fileData);
*/
var File = function(file){}

/**
* File类实例
* @name file_instance
* @namespace 
* @link File
*/
var file_instance = {
	/**
	* @property
	* @desc 源数据
	*/
	data: {},
	/**
	* @property
	* @desc 文件全名
	*/
	fullname: 'xx.jpg',
	/**
	* @property
	* @desc 文件名
	*/
	name: 'xx',
	/**
	* @property
	* @desc 文件后缀名 看{@link MIME_TYPE}
	*/
	suffix: 'jpg',
	/**
	* @property
	* @desc 文件 mimetype 看{@link MIME_TYPE}
	*/
	type: 'image/jpeg',
	/**
	* @property
	* @desc 文件尺寸(bytes)
	*/
	size: 1234,
	/**
	* @property
	* @desc 文件状态 看{@link FILE_STATUS}
	*/
	status: -6
};


/**
* 上传错误的 code 枚举
* @name UPLOAD_ERROR
* @namespace FOCUS.widget.Upload
*/
var UPLOAD_ERROR = {
	/**
	* @property
	* @desc 网络错误 -200
	*/
	HTTP_ERROR                      : -200,
	/**
	* @property
	* @desc 缺少上传 url -210
	*/
	MISSING_UPLOAD_URL              : -210,
	/**
	* @property
	* @desc 文件或数据读写错误 -220
	*/
	IO_ERROR                        : -220,
	/**
	* @property
	* @desc 安全性错误，主要发生于跨域提交或 flash 非安全域名提交 -230
	*/
	SECURITY_ERROR                  : -230,
	/**
	* @property
	* @desc 超出上传限制 -240
	*/
	UPLOAD_LIMIT_EXCEEDED           : -240,
	/**
	* @property
	* @desc 上传失败 -250
	*/
	UPLOAD_FAILED                   : -250,
	/**
	* @property
	* @desc 指定的文件ID 不存在 -260
	*/
	SPECIFIED_FILE_ID_NOT_FOUND     : -260,
	/**
	* @property
	* @desc 文件校验失败 -270
	*/
	FILE_VALIDATION_FAILED          : -270,
	/**
	* @property
	* @desc 取消上传 -280
	*/
	FILE_CANCELLED                  : -280,
	/**
	* @property
	* @desc 停止上传 -290
	*/
	UPLOAD_STOPPED                  : -290,
	/**
	* @property
	* @desc 缩放图片失败，暂不支持缩放 -300
	*/
	RESIZE                          : -300,
	/**
	* @property
	* @desc 上传超时 -310
	*/
	TIMEOUT							: -310
};


/**
* 进入队列报错的 code 枚举
* @name QUEUE_ERROR
* @namespace FOCUS.widget.Upload
*/
var QUEUE_ERROR = {
	/**
	* @property
	* @desc 超出队列限制 -100
	*/
	QUEUE_LIMIT_EXCEEDED            : -100,
	/**
	* @property
	* @desc 超出文件尺寸限制 -110
	*/
	FILE_EXCEEDS_SIZE_LIMIT         : -110,
	/**
	* @property
	* @desc 0 字节的文件 -120
	*/
	ZERO_BYTE_FILE                  : -120,
	/**
	* @property
	* @desc 不允许的文件类型 -130
	*/
	INVALID_FILETYPE                : -130,
	/**
	* @property
	* @desc 仅用于iframe版本。当浏览器支持 html5 的input:file，且允许多选时，选择多个文件，其中某个文件校验失败后，其他文件也会报 queue error，类型为 chain_error -140
	*/
	CHAIN_ERROR						: -140
};


/**
* 内置的 mime 类型 枚举
* @name MIME_TYPE
* @namespace FOCUS.widget.Upload
*/
var MIME_TYPE = {
	/**
	* @property
	* @desc 所有文件
	*/
	ALL: '*/*',
	/**
	* @property
	* @desc 图片
	*/
	IMAGE: 'image/*',
	/**
	* @property
	* @desc jpeg
	*/
	JPG: 'image/jpeg',
	/**
	* @property
	* @desc jpeg
	*/
	JPEG: 'image/jpeg',
	/**
	* @property
	* @desc png
	*/
	PNG: 'image/png',
	/**
	* @property
	* @desc gif
	*/
	GIF: 'image/gif',
	/**
	* @property
	* @desc pdf
	*/
	PDF: 'application/pdf',
	/**
	* @property
	* @desc word 97-2003
	*/
	DOC: 'application/msword',
	/**
	* @property
	* @desc word 2007
	*/
	DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	/**
	* @property
	* @desc excel 97-2003
	*/
	XLS: 'application/vnd.ms-excel',
	/**
	* @property
	* @desc excel 2007
	*/
	XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	/**
	* @property
	* @desc powerpoint 97-2003
	*/
	PPT: 'application/vnd.ms-powerpoint',
	/**
	* @property
	* @desc powerpoint 2007
	*/
	PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	/**
	* @property
	* @desc text
	*/
	TXT: 'text/plain',
	/**
	* @property
	* @desc file stream
	*/
	UNKNOWN: 'application/octet-stream'
};


/**
* 组件模式的枚举
* @name MODE
* @namespace FOCUS.widget.Upload
*/
var MODE = {
	/**
	* @property
	* @desc html5
	*/
	HTML5: 'html5',
	/**
	* @property
	* @desc flash
	*/
	FLASH: 'flash',
	/**
	* @property
	* @desc iframe
	*/
	IFRAME: 'iframe',
	/**
	* @property
	* @desc default = html5
	*/
	DEFAULT: 'html5'
};


/**
* 组件实例化模式优先级枚举
* @name PRIORITY
* @namespace FOCUS.widget.Upload
*/
var PRIORITY = {
	/**
	* @property
	* @desc 默认模式。html5>flash>iframe
	*/
	DEFAULT: [ MODE.HTML5, MODE.FLASH, MODE.IFRAME ]
};


/**
* 文件状态枚举
* @name FILE_STATUS
* @namespace FOCUS.widget.Upload
*/
var FILE_STATUS = {
	/**
	* @property
	* @desc 进入队列 -1
	*/
	QUEUED       : -1,
	/**
	* @property
	* @desc 传输中 -2
	*/
	IN_PROGRESS  : -2,
	/**
	* @property
	* @desc 上传出错 -3
	*/
	ERROR        : -3,
	/**
	* @property
	* @desc 上传完成 -4
	*/
	COMPLETE     : -4,
	/**
	* @property
	* @desc 取消上传 -5
	*/
	CANCELLED    : -5,
	/**
	* @property
	* @desc 新建文件 -6
	*/
	NEW			 : -6
};


/**
* UI样式列表
* @name CSS
* @namespace FOCUS.widget.Upload
*/
var CSS = {
	/**
	* @property
	* @desc 按钮最外层样式 FOCUS_UPLOAD_wrap
	*/
	WRAP:		'FOCUS_UPLOAD_wrap',
	/**
	* @property
	* @desc 选择器控件 FOCUS_UPLOAD_selector
	*/
	SELECTOR:	'FOCUS_UPLOAD_selector',
	/**
	* @property
	* @desc flash控件 FOCUS_UPLOAD_flashWrap
	*/
	FLASH:		'FOCUS_UPLOAD_flashWrap',
	/**
	* @property
	* @desc 按钮文本 FOCUS_UPLOAD_text
	*/
	TEXT:		'FOCUS_UPLOAD_text',
	/**
	* @property
	* @desc 禁用按钮时的外层样式 FOCUS_UPLOAD_wrap_disabled
	*/
	DISABLED:	'FOCUS_UPLOAD_wrap_disabled'
};


/**
* 内置的charset 枚举
* @name CHARSET
* @namespace FOCUS.widget.Upload
*/
var CHARSET = {
	/**
	* @property
	* @desc UTF-8
	*/
	UTF8:		'UTF-8',
	/**
	* @property
	* @desc GBK
	*/
	GBK:		'GBK',
	/**
	* @property
	* @desc GB2312
	*/
	GB2312:		'GB2312',
	/**
	* @property
	* @desc BIG5
	*/
	BIG5:		'BIG5',
	/**
	* @property
	* @desc UTF-8
	*/
	DEFAULT:	'UTF-8'
};


/**
* 状态枚举
* @name TURNING
* @namespace FOCUS.widget.Upload
*/
var TURNING = {
	/**
	* @property
	* @desc 启用 true
	*/
	ON:		true,
	/**
	* @property
	* @desc 禁用 false
	*/
	OFF:	false
};