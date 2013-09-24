/**
* 上传组件
* @class
* @constructor
* @namespace FOCUS.widget
* @name Upload
* @param {JSON} [cfg] 配置文件
* @version 0.6.5
* @author lvxiang
* @link config
* @link events
* @link events_api
* @link MODE
* @link PRIORITY
* @link File
* @link FILE_STATUS
* @link UPLOAD_ERROR
* @link QUEUE_ERROR
* @link CSS
* @link MIME_TYPE
* @example
	var uploader = new FOCUS.widget.Upload({
		//模式选择的优先级列表
		priority: FOCUS.widget.Upload.PRIORITY.DEFAULT,
		//事件
		events: {
			//组件相关资源准备完成 且 处于可使用状态 时触发
			//!!触发过一次后，将不再自动触发该事件
			ready: function(mode){},
			//仅在flash版本中可用, 专指 flash加载失败
			fail: function(){},
			//打开文件对话框
			dialogStart: function(){},
			//对话框关闭
			//iframe 和 html5 版本中 仅当确实选择了文件时 会触发， 取消或关闭对话框不触发该事件
			dialogComplete: function(selected_files_number, queued_number, total_files_number_in_queue){},
			//文件进入队列
			queued: function(file){},
			//进入队列失败
			queueError: function(file, queue_error_code, message){},
			//上传开始
			uploadStart: function(file){},
			//上传进度
			//iframe 版本只有 0 和 100 两个进度, 即开始 和结束
			uploadProgress: function(file, complete_bytes, total_bytes){},
			//上传成功，服务端正常响应数据且被组件捕获到
			uploadSuccess: function(file, server_response_string){},
			//上传失败
			//!!取消以及停止上传 不执行该回调
			uploadError: function(file, upload_error_code, message){},
			//上传完成
			uploadComplete: function(file){},
			//取消上传
			cancel: function(file, upload_error_code, message){},
			//停止上传
			stop: function(file, upload_error_code, message){}
		},
		button: {
			//UI 按钮文本
			text: 'Upload'
		},
		//flash文件路径默认为 FOCUS\widget\Upload\flash\swf\
		//flash版的 flash控件文件地址
		flashURL: '',
		//flash版的 flash9补丁文件地址
		flash9URL: '',
		//多选文件的对话框
		//特例: 部分浏览器如 ie6-9 使用iframe 版本时，不支持该属性
		multiple: true,
		//文件尺寸限制
		sizeLimit: -1,
		//not support now
		//uploadLimit: -1,
		//队列长度限制
		queueLimit: -1,
		//校验允许的类型
		fileTypes: FOCUS.widget.Upload.MIME_TYPE.ALL,
		//对话框中的描述部分 --仅支持 flash
		fileTypesDescription: 'All Files',
		//上传地址
		uploadURL: '',
		//文件的上传名称
		filePostName: '',
		//上传组件 UI 占位
		//有 Sizzle, jQuery, document.querySelectorAll 等Api 的可以使用 jquery 定义的 选择器
		//否则只能使用 id 选择器
		placeholder: '',
		//charset 不推荐使用该配置, 或只设置为 UTF-8
		//charset: FOCUS.widget.Upload.CHARSET.DEFAULT,
		//调试开关
		debug: false,
		//上传超时(ms)
		timeout: 100000,
		//上传文件时携带的数据
		postParams: {}
	});
*/
var Upload = function(cfg){};

Upload.prototype = /** @lends Upload.prototype */ {
	/**
	* @property {MODE} mode
	* @desc 当前上传组件的运行时模式 {@link MODE}
	*/
	mode: 'iframe',
	/**
	* @private
	* initializeation
	*/
	init: noop,
	/**
	* set config
	* @param {Object} cfg 配置文件对象。 当 events 插件启用时，不要再在此配置 事件侦听，改为调用 on/off
	*/
	set: function(cfg){},
	/**
	* 启用/禁用 debug 控制台 --暂不支持无控制台的 ie
	* @param {Boolean} stat 是否启用控制台
	*/
	debug: function(stat){},
	//Propertis
	//TODO
	
	////////Methods
	/**
	* 开始上传文件
	*/
	startUpload: function(){},
	//not implement
	//getFile: noop,
	
	//////implementation methods
	/**
	* 取消正在进行的上传，并从队列中移除正在上传的文件。不在上传时，请勿调用
	* @param {Function} [callback] 取消成功后的回调
	*/
	cancelUpload: function(callback){},
	/**
	* 停止正在进行的上传，并将正在上传的文件重新加入队列最前。不在上传时，请勿调用
	* @param {Function} [callback] 停止成功后的回调
	*/
	stopUpload: function(callback){},
	/**
	* 获取队列文件
	* @param {String=0|Number=0} [arg] 根据 文件名或队列索引 获取文件，默认获取第一个文件
	*/
	getQueueFile: function(arg){},
	////set
	/**
	* 覆盖式扩展提交的数据
	* @param {JSON} params Json格式数据
	*/
	setPostParam: function(params){},
	/**
	* 增加一个提交的数据
	* @param {String} key 数据名
	* @param {String} value 数据值
	*/
	addPostParam: function(key, value){},
	/**
	* 移除提交的数据
	* @param {String} [key] 数据名. 若 key 为 false 值，则清空所有提交数据
	*/
	removePostParam: function(key){},
	/**
	* 设置提交文件的url
	* @param {URLString} url 目标地址
	*/
	setUploadURL: function(url){},
	/**
	* 设置提交的文件的name，即后台获取值的name，非 文件名
	* @param {String} 文件的提交名，请使用 合法的提交名
	*/
	setFilePostName: function(name){},
	//require override
	/**
	* 设置前台允许校验通过的文件类型
	* @param {String} types 类型字符串。可以为 mimetype 和 后缀名 的混合字符串，如 'image/jpeg, .gif; .png, application/pdf'
	* @example
		uploader.setFileTypes('image/jpeg, .gif; application/pdf'; .png);
	*/
	setFileTypes: function(types){},
	/**
	* 设置最大允许校验通过的文件尺寸
	* @param {Number|String} limit 文件尺寸. String: 带单位的尺寸('10KB', '10 MB'). Number: 默认单位为KB的尺寸
	*/
	setFileSizeLimit: function(limit){},
	//not support now
	/*setFileUploadLimit: function(limit){
		this.cfg.uploadLimit = limit;
	},*/
	/**
	* 设置队列最大长度
	* @param {Number} 队列最大长度,大于等于 -1 的整数. -1 表示 无限制
	*/
	setFileQueueLimit: function(limit){},
	/**
	* 启用或禁用按钮
	* @param {Boolean|String} [status] 启用状态. 不传参数则为切换启用状态.
	*	String: 'on' | 'off'
	*/
	turn: function(status){},
	/**
	* 允许多选文件. LTE IE9 不支持 iframe 版本的多文件选择
	* @param {Boolean} isMulti 是否允许一次选择多个文件
	*/
	multiple: function(isMulti){},
	/**
	* 手动队列文件
	* -不支持 flash 版本
	* @param {FileList|File[]|File|FileInput} files files 想队列的文件
	* @param {Function} [callback] 队列行为执行完成后的回调
	*/
	queue: function(files, callback){},
	/**
	* 从队列中移除文件. 不引起错误回调
	* @param {Int|String|Boolean} [arg] 从队列中移除文件.
		Int: 文件在队列中的索引. 大于等于 0 的整数
		String: 文件的 id
		Boolean: -true: 清空队列. -false: 移除队列中的第一个文件
		无参数: 移除队列中的第一个文件
	*/
	dequeue: function(arg){},
/**
	* 绑定事件
	* @param {String} type 事件类型
	* @param {Function|Function[]} handles 事件句柄
	* @param [thisObj] 执行时绑定的this对象
	* @param [args,..] 执行时的参数
	* @return this
	* @example
		uploader.on('ready', handle);
	*/
	on: function(type, handles, thisObj, args){},
	/**
	* 移除事件
	* @param {String} type 事件类型
	* @param {Function|Function[]} [handles] 事件句柄. 无此参数则移除所有该类型的事件
	* @return this
	* @example
		uploader.off('ready', handle);
	*/
	off: function(type, handles){},
	/**
	* 绑定只执行一次的事件
	* @param {String} type 事件类型
	* @param {Function|Function[]} handles 事件句柄
	* @param [thisObj] 执行时绑定的this对象
	* @param [args,..] 执行时的参数
	* @return this
	* @example
		uploader.one('ready', handle);	
	*/
	one: function(type, handles, thisObj, args){},
	/**
	* 触发事件
	* @param {String} type 事件类型
	* @param [args,..] 执行时附加的参数
	* @return this
	* @example
		uploader.fire('ready');
	*/
	fire: function(type, args){}
};