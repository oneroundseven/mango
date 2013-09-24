// Copyright 2013 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview
 * @author sheny@made-in-china.com
 * @Date: 13-6-25
 */

// Intl.DateTimeFormat
(function () {
    var L = this;
    var D = L.Date = {};
    var MAPPING_WEEK = {
        1: { en: 'Monday', cn: '星期一' },
        2: { en: 'Tuesday', cn: '星期二' },
        3: { en: 'Wednesday', cn: '星期三' },
        4: { en: 'Thursday', cn: '星期四' },
        5: { en: 'Friday', cn: '星期五' },
        6: { en: 'Saturday', cn: '星期六' },
        7: { en: 'Sunday', cn: '星期日' }
    };
    var MAPPING_MONTH = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
    };

    function getWeek(num, type) {
        if (num < 8 && num > 0) {
            if (typeof type === 'undefined') {
                type = 'cn';
            }

            return MAPPING_WEEK[num][type];
        }

        return null;
    }

    /**
     * get week english abbreviation
     */
    D.enWeekAbb = function (num) {
        var week = getWeek(num, 'en');
        if (num === 2 || num == 4) {
            return week.substring(0, 4) + '.';
        }

        return week.substring(0, 3) + '.';
    };

    /**
     * get week english abbreviation
     */
    D.enMonthAbb = function (num) {
        if (num === 4) {
            return MAPPING_MONTH[num];
        }

        return MAPPING_MONTH[num].substring(0, 3) + '.';
    };

    /**
     * 获取时间戳
     * @return {Number}
     */
    D.timeStamp = function () {
        return new Date().getTime();
    };

    /**
     * format Date
     * @param {Date} date
     * @param {String} format
     * yyyy : year, MM : month, dd : day, hh : hour, mm : minute, ss : second, WW : week
     * M : abbreviation | no zero
     * W : abbreviation only English
     * @param {String} [type]  en | cn
     * @return {String}
     */
    D.format = function (date, format, type) {
        var regs, reg;
        if (!L.isDate(date)) {
            return date;
        }

        regs = {
            'y+': date.getFullYear(),
            'M+': date.getMonth(),
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'W+': date.getDay()
        };

        for (reg in regs) {
            if (new RegExp('(' + reg + ')').test(format)) {
                // english abbreviation month
                if (reg === 'M+' && type === 'en') {
                    if (RegExp.$1.length == 1) {
                        format = format.replace(RegExp.$1, this.enMonthAbb(regs[reg]));
                    }

                    format = format.replace(RegExp.$1, MAPPING_MONTH[regs[reg]]);
                }

                // english abbreviation week
                if (reg === 'W+') {
                    if (RegExp.$1.length == 1 && type === 'en') {
                        format = format.replace(RegExp.$1, this.enWeekAbb(regs[reg]));
                    }

                    format = format.replace(RegExp.$1, getWeek(regs[reg], type));
                }

                format = format.replace(RegExp.$1, (RegExp.$1.length == 1 || reg === 'y+') ? regs[reg] :
                    ("00" + regs[reg]).substr(('' + regs[reg]).length));
            }
        }

        return format;
    };

    /**
     * javascript 1.8.5 toJSON
     * yyyy-MM-ddTHH:mm:ssZ
     * @param {Date} date
     * @return {String}
     */
    D.toJSON = Date.prototype.toJSON ? function(date) {
        return date.toJSON();
    } : function (date) {
        if (!L.isDate(date)) {
            return date;
        }
        return this.format(date, 'yyyy-MM-ddThh:mm:ssZ');
    };

    /**
     * Time difference
     * @param {Date} date1
     * @param {Date} date2
     * @return {Number}
     */
    D.diff = function (date1, date2) {
        if (!L.isDate(date1) || !L.isDate(date2)) {
            return -1;
        }

        return date1.getTime() - date2.getTime();
    };

    /**
     * compare two date, date1 > date2 : true
     * @param {Date} date1
     * @param {Date} date2
     * @return {Boolean}
     */
    D.compare = function (date1, date2) {
        var diff = this.diff(date1, date2);
        return (diff === -1 || diff < 0) ? false : true;
    };

    return D;
}.call(lass));