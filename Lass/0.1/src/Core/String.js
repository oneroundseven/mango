
/**
 * @name String
 * @class
 * @description
 * @requires Lass
 */
// test, contains, trim, toInt, toFloat, substitute
(function() {
    var String = this.String = {};

    /**
     * check string start with some word
     * @param string
     * @param pattern
     * @return {Boolean}
     */
    String.startWidth = function(string, pattern) {
        return string.slice(0, pattern.length) === pattern;
    };

    /**
     * check string end with some word
     * @param string
     * @param pattern
     * @return {Boolean}
     */
    String.endWidth = function(string, pattern) {};

}.call(lass));
