// Copyright 2013 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview
 * @author sheny@made-in-china.com
 * @Date: 13-6-26
 */

var root = this;
var Lass;
var L = function() {
    if (!this instanceof Lass) return new Lass();
}


var breaker = {};
var toString         = Object.prototype.toString,
    hasOwnProperty   = Object.prototype.hasOwnProperty;
//
var R_NATIVE = /\{\s*\[native\s*code\]\s*\}/i;


function isNative(method) {
    if (!L.isFunction(method)) return null;
    return R_NATIVE.test(method.toString());
}

// core
var each = lass.each = lass.forEach = function(obj, fn, context) {
    if (obj === null) return;
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
        obj.forEach(fn, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
            if (fn.call(context, obj[i], i, obj) === breaker) return;
        }
    } else {
        for (var key in obj) {
            if (lass.has(obj, key)) {
                if (fn.call(context, obj[key], key, obj) === breaker) return;
            }
        }
    }
};

lass.random = function(min, max) {
    if (lass.isNull(max)) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
};

lass.extend = function() {};
lass.time = function() {
    return +(new Date);
};

lass.isEmpty = function(obj) {
    if (obj === null) return true;
    if (lass.isArray(obj) || lass.isString(obj)) return obj.length === 0;
    for (var key in obj) if (lass.has(obj, key)) return false;
    return true;
};
lass.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
};
lass.isArray = function(obj) {
    return toString.call(obj) == '[object Array]';
};
lass.isObject = function(obj) {
    return obj === Object(obj);
};

each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    lass['is' + name] = function(obj) {
        return toString.call(obj) == '[object ' + name + ']';
    };
});

lass.isNaN = function(obj) {
    return lass.isNumber(obj) && obj != +obj;
};
lass.isNull = function(obj) {
    return obj === null;
};
lass.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
};
lass.isUndefined = function(obj) {
    return obj === void 0;
};

var type = lass.type = function(item){
    if (item == null) return 'null';

    if (lass.isString(item)) {
        return 'string';
    }

    if (lass.isArray(item)) {
        return 'array';
    }

    if (lass.isDate(item)) {
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
};

lass.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
};

lass.trim = function() {
    return String(this).replace(/^\s+|\s+$/g, '');
};
