// Copyright 2012 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview
 * @author sheny@made-in-china.com
 * @version v0.1
 */

// javascript 1.7 stringify parse
(function() {
    var J = this.JSON = {};

    /**
     *
     * @param {String} jsonString
     * @return {*}
     */
    J.parse = window.JSON && window.JSON.parse ? function(jsonString) {
        return JSON.parse(jsonString);
    } : function(jsonString) {

    };

    /**
     *
     * @param value
     * @param {String} [replacer]
     * @param {String} [space]
     * @return {*}
     */
    J.stringify = window.JSON && window.JSON.stringify ? function() {
        return JSON.stringify.apply(JSON, Array.prototype.slice.call(arguments, 0));
    } : function(value, replacer, space) {

    };

    J.validate = function(string){
        string = string.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, '');

        return (/^[\],:{}\s]*$/).test(string);
    };

    J.xml2Json = function() {

    };

    return J;
}.call(lass));