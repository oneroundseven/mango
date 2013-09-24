/**
* events api on instance of class FOCUS.widget.Upload
* @class events_api
* @name events_api
* @example
	var uploader = new FOCUS.widget.Upload();
	var handle = function(mode){ alert(mode) };
	uploader.on('ready', handle)
		.off('ready', handle)
		.one('ready', handle)
		.fire('ready', handle)
*/
var events_api = function(){};
events_api.prototype = /** @lends events_api.prototype */{
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


/**
* 事件类型
* @name events
* @namespace
* @link Upload
* @link events_api
* @example
*	///事件流程
* 	//初始化
* 	init start -->ready
* 			  ╰-> fail(仅在flash版本中flash加载失败时触发)
* 	
* 	//选择文件
*	dialogStart --> queued -------> dialogComplete
* 			   ╰-> queueError -╯
*
* 	//上传文件
* 				╭-> uploadError(missing url)
* 	uploadStart --> uploadProgress --> uploadSuccess --> uploadComplete --> uploadStart
* 								  ╰-> uploadError  -╯
* 		  													   

*/
var events = {
	/**
	* 组件相关资源准备完成 且 处于可使用状态 时触发
	* !!触发过一次后，将不再自动触发该事件
	* @param {MODE} mode 组件使用的模式 {@link MODE}
	*/
	ready: function(mode){},
	/**
	* 仅在flash版本中可用, 专指 flash加载失败
	*/
	fail: function(){},
	/**
	* 打开文件对话框
	*/
	dialogStart: function(){},
	/**
	* 对话框关闭事件。
	* iframe 和 html5 版本中 仅当确实选择了文件时 会触发， 取消或关闭对话框不触发该事件
	* @param {Number} selected_files_number 本次选择的文件数
	* @param {Number} queued_number 本次队列成功的文件数
	* @param {Number} total_files_number_in_queue 队列中的文件总数
	*/
	dialogComplete: function(selected_files_number, queued_number, total_files_number_in_queue){},
	/**
	* 文件进入队列
	* @param {File} file 文件对象 {@link File}
	*/
	queued: function(file){},
	/**
	* 进入队列失败
	* @param {File} file 文件对象 {@link File}
	* @param {QUEUE_ERROR} queue_error_code 错误码 {@link QUEUE_ERROR}
	* @param {String} message 错误提示信息
	*/
	queueError: function(file, queue_error_code, message){},
	/**
	* 上传开始
	* @param {File} file 文件对象 {@link File}
	*/
	uploadStart: function(file){},
	/**
	* 上传进度事件。
	* iframe 版本只有 0 和 100 两个进度, 即开始 和结束
	* @param {File} file 文件对象 {@link File}
	* @param {Number} complete_bytes 已发送完成的字节数
	* @param {Number} total_bytes 文件总字节数
	*/
	uploadProgress: function(file, complete_bytes, total_bytes){},
	/**
	* 上传成功，服务端正常响应数据且被组件捕获到
	* @param {File} file 文件对象 {@link File}
	* @param {String} server_response_string 服务端响应的数据文本
	*/
	uploadSuccess: function(file, server_response_string){},
	/**
	* 上传失败事件。
	* !!取消以及停止上传 不执行该回调
	* @param {File} file 文件对象 {@link File}
	* @param {UPLOAD_ERROR} upload_error_code 错误码 {@link UPLOAD_ERROR}
	* @param {String} message 错误提示信息
	*/
	uploadError: function(file, upload_error_code, message){},
	/**
	* 上传完成
	* @param {File} file 文件对象 {@link File}
	*/
	uploadComplete: function(file){},
	/**
	* 取消上传
	* @param {File} file 文件对象 {@link File}
	* @param {UPLOAD_ERROR} upload_error_code 错误码 {@link UPLOAD_ERROR}
	* @param {String} message 错误提示信息
	*/
	cancel: function(file, upload_error_code, message){},
	/**
	* 停止上传
	* @param {File} file 文件对象 {@link File}
	* @param {UPLOAD_ERROR} upload_error_code 错误码 {@link UPLOAD_ERROR}
	* @param {String} message 错误提示信息
	*/
	stop: function(file, upload_error_code, message){}
};