/**
 * @name Class
 * @class
 * @type {Object}
 * @requires Lass
 */
;void function () {
    var cookie = this.Cookie = {};

    cookie.read = function (name) {
        return RegExp("(?:^|;)\\s*" + name + "=([^;]*)").test(document.cookie) ? RegExp.$1 : null;
    };

    cookie.write = function (name, value, expires) {
        var expDays = expires * 24 * 60 * 60 * 1000;
        var liveDate = new Date();
        liveDate.setTime(liveDate.getTime() + expDays);
        var expString = expires ? ";expires=" + liveDate.toGMTString() : "";
        var pathString = ";path=/";
        document.cookie = name + "=" + encodeURIComponent(value) + expString + pathString;
    };

    cookie.dispose = function (name) {
        var exp = new Date(new Date().getTime() - 1);
        var s = this.read(name);
        if (s !== null) document.cookie = name + "=;expries=" + exp.toGMTString() + ";path=/";
    };

    return cookie;
}.call(Lass);