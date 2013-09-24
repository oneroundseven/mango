/**
 * 基础命名空间
 * @author xingshikang
 * @copyright 焦点科技股份有限公司
 */
if (typeof FOCUS == "undefined" || !FOCUS) {
	var FOCUS = {};
};
FOCUS.namespace=function() {
	var part, namespace;
	for (var i = 0; i < arguments.length; i++) {
		part = arguments[i].split(".");
		var namespace = FOCUS;
		for (var k = (part[0] == "FOCUS") ? 1 : 0; k < part.length; k++) {
			namespace[part[k]] = namespace[part[k]] || {};
			namespace = namespace[part[k]];
		}
	}
	return namespace;
};

(function(){
    /**
     * 工具：日志
     * @classDescription 用于记录运行日志
     * @namespace FOCUS.util.log
     * @version 1.0.0
     * @since 2012.06.05
     */
    FOCUS.namespace("FOCUS.util.log");
    FOCUS.util.log=(function(){
        var _config={level:"on"};
        function _valid(level){
            if(!console)
                return false;
            switch (_config.level) {
                case "on":
                    return true;
                    break;
                case "off":
                    return false;
                    break;
                case level:
                    return true;
                    break;
                default:
                    return false;
            }
        }
        return {
            setConfig:function(config){
                _config=$.extend(_config,config);
            },
            info: function(messege) {
                if (_valid("info"))
                    console.info(messege);
            },
            debug: function(messege) {
                if (_valid("debug"))
                    console.debug(messege);
            },
            warn: function(messege) {
                if (_valid("warn"))
                    console.warn(messege);
            },
            error: function(messege) {
                if (_valid("error"))
                    console.error(messege);
            }
        }
    })();
})();
