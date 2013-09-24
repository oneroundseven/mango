
/**
 * @name Array
 * @class
 * @type {Object}
 * @requires Lass
 */

// javascript 1.6 indexOf lastIndexOf | every filter forEach map some

// javascript 1.8 reduce reduceRight

// javascript 1.8.5 isArray

// each, every, filter, clean, indexOf, map, contains, getLast, getRandom, empty, distinct


// ArrayBuffer
;void function() {

'use strict';


    var Array = {
        // javascript 1.6
        indexOf : function() {},
        lastIndexOf : function() {},
        every : function() {},
        filter : function() {},
        each : function() {},
        map : function() {},
        some : function() {},
        // 1.8.5
        reduce : function() {},
        reduceRight : function() {},
        // javascript 1.8.5
        isArray : function() {},
        // other
        clean : function() {},
        contains : function() {},
        getLast : function() {},
        empty : function() {},
        distinct : function() {}
    };

    /**
     * check type of array
     * @param array
     * @public
     * @return {Boolean}
     */
/*    array.prototype.test = function(array) {
        if (Object.prototype.toString.call(array) === '[object Array]') {
            return true;
        }
        return false;
    };*/

    /**
     * Array indexOf
     * @param items
     * @param value
     * @param start
     * @return {Number}
     */
/*    array.prototype.indexOf = (Array.prototype.indexOf) ?
    function(a, val) {
        return Array.prototype.indexOf.call(a, val);
    } :
    function(items, value, start){
        *//*if(items.indexOf){
         return items.indexOf(value, start);
         }*//*

        var ret = -1;
        var i = ((this.Util.type(start) === 'number' ? start : -1) + 1), len = items.length;
        for(; i < len; i++){
            if(items[i] === value){
                ret = i;
                break;
            }
        }

        return ret;
    };*/

    /**
     * 过滤数组重复项
     * @param arr
     * @return {Array}
     */
/*    array.prototype.unique = function(arr){
        var ret = [];

        for(var i = 0, len = arr.length; i < len; i++){
            if(Array.indexOf(ret, arr[i]) === -1){
                ret.push(arr[i]);
            }
        }

        return ret;
    };*/

    array.prototype.max = function(array) {
        //ECMASCript v3
        return Math.max.apply(Math, array);
    };

    array.prototype.min = function() {
        //ECMASCript v3
        return Math.min.apply(Math, array);
    };
}.call(lass);

