/**
* 配置文件
* @name config
* @namespace
* @link Upload
* @link Upload#set
*/
var config = {
	/**
	* @property
	* @desc 模式选择的优先级列表 {@link PRIORITY} {@link MODE}
	*/
	priority: FOCUS.widget.Upload.PRIORITY.DEFAULT,
	/**
	* @property
	* @desc 事件 {@link events}
	*/
	events: {
		ready: function(mode){},
		fail: function(){},
		dialogStart: function(){},
		dialogComplete: function(selected_files_number, queued_number, total_files_number_in_queue){},
		queued: function(file){},
		queueError: function(file, queue_error_code, message){},
		uploadStart: function(file){},
		uploadProgress: function(file, complete_bytes, total_bytes){},
		uploadSuccess: function(file, server_response_string){},
		uploadError: function(file, upload_error_code, message){},
		uploadComplete: function(file){},
		cancel: function(file, upload_error_code, message){},
		stop: function(file, upload_error_code, message){}
	},
	/**
	* @property
	* @desc 按钮相关配置
	*/
	button: {
		/**
		* @property
		* @desc UI 按钮文本
		*/
		text: 'Upload'
	},
	/**
	* @property
	* @desc flash版的 flash控件文件地址
	*/
	flashURL: '',
	/**
	* @property
	* @desc flash版的 flash9补丁文件地址
	*/
	flash9URL: '',
	/**
	* @property
	* @desc 多选文件的对话框。特例: 部分浏览器如 ie6-9 使用iframe 版本时，不支持该属性
	*/
	multiple: true,
	/**
	* @property
	* @desc 文件尺寸限制。-1表示无限制
	*/
	sizeLimit: -1,
	/**
	* @private
	* @property
	* @desc 暂不支持
	*/
	uploadLimit: -1,
	/**
	* @property
	* @desc 队列长度限制。-1表示无限制
	*/
	queueLimit: -1,
	/**
	* @property
	* @desc 校验允许的类型 {@link MIME_TYPE}
	*/
	fileTypes: FOCUS.widget.Upload.MIME_TYPE.ALL,
	/**
	* @property
	* @desc 对话框中的描述部分 --仅支持 flash
	*/
	fileTypesDescription: 'All Files',
	/**
	* @property
	* @desc 上传地址
	*/
	uploadURL: '',
	/**
	* @property
	* @desc 文件的上传名称
	*/
	filePostName: '',
	/**
	* @property
	* @desc 上传组件 UI 占位。有 Sizzle,jQuery,document.querySelectorAll 等Api 的可以使用 jquery 定义的 选择器，否则只能使用 id 选择器
	*/
	placeholder: '',
	/**
	* @property
	* @desc 不推荐使用该配置,或只设置为 UTF-8 {@link CHARSET}
	*/
	charset: FOCUS.widget.Upload.CHARSET.DEFAULT,
	/**
	* @property
	* @desc 调试开关 {@link TURNING}
	*/
	debug: false,
	//
	/**
	* @property
	* @desc 上传超时(ms)
	*/
	timeout: 100000,
	/**
	* @property
	* @desc 上传文件时携带的数据 {@link Upload#setPostParam} {@link Upload#addPostParam} {@link Upload#removePostParam}
	*/
	postParams: {}
};