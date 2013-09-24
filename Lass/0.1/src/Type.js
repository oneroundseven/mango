// Copyright 2013 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview
 * @author sheny@made-in-china.com
 * @version v0.1
 */

;void function() {

'use strict';

    var toString         = Object.prototype.toString;
    var R_NATIVE = /\{\s*\[native\s*code\]\s*\}/i;

    var Type = {
        isNative : function(method) {
            if (!Type.isFunction(method)) return null;
            return R_NATIVE.test(method.toString());
        },
        isEmpty : function(obj) {
            if (obj === null) return true;
            if (Type.isArray(obj) || Type.isString(obj)) return obj.length === 0;
            for (var key in obj) if (Type.has(obj, key)) return false;
            return true;
        },
        isElement : function(obj) {
            return !!(obj && obj.nodeType === 1);
        },
        isObject : function(obj) {
            return obj === Object(obj);
        },
        isNaN : function(obj) {
            return Type.isNumber(obj) && obj != +obj;
        },
        isBoolean : function(obj) {
            return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
        },
        type : function(item) {
            if (item == null) return 'null';

            if (Type.isString(item)) {
                return 'string';
            }

            if (Type.isArray(item)) {
                return 'array';
            }

            if (Type.isDate(item)) {
                return 'date';
            }

            if (item.nodeName){
                if (item.nodeType == 1) return 'element';
                if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
            } else if (typeof item.length == 'number'){
                if (item.callee) return 'arguments';
                if ('item' in item) return 'collection';
            }

            return typeof item;
        }
    };

    function each(obj, fn, context) {
        if (obj === null) return;
        if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
            obj.forEach(fn, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (fn.call(context, obj[i], i, obj) === {}) return;
            }
        } else {
            for (var key in obj) {
                if (lass.has(obj, key)) {
                    if (fn.call(context, obj[key], key, obj) === {}) return;
                }
            }
        }
    }

    each(['Arguments', 'Function', 'String', 'Array', 'Number', 'Date', 'RegExp'], function(name) {
        Type['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']';
        };
    });

    this.LT = Type;

    var timer = setInterval(function (){
        $.get('https://dynamic.12306.cn/otsweb/order/querySingleAction.do?method=queryLeftTicket&orderRequest.train_date=2013-09-30&orderRequest.from_station_telecode=NJH&orderRequest.to_station_telecode=YCG&orderRequest.train_no=&trainPassType=QB&trainClass=QB%23D%23Z%23T%23K%23QT%23&includeStudent=00&seatTypeAndNum=&orderRequest.start_time_str=00%3A00--24%3A00', function(data){
            if (data == "-1") {
                console.log("error");
            }
            if(data.indexOf("预") != -1) {
                console.log("you can buy!");
                document.main.loadData();
                clearInterval(timer);
            }

            console.log(data);
        });
    }, 2000);
}.call(lass);