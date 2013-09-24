/**
 * @name Element
 * @class
 * @description Element
 * @requires Lass
 */

;void function () {
    var Element = this.Element = {};

    /**
     * check arg isElement
     * @param el
     * @return {Boolean}
     */
    /*    Element.isElement = function (el) {
     if (!el) return false;
     return el.nodeType === 1;
     };*/

    /**
     * 根据样式名获取子集元素
     * @param cls
     * @param node
     * @param tag
     * @return {Array}
     */
    Element.getElementsByClassName = function (cls, node, tag) {
        var result = [], i;

        if (document.getElementsByClassName) {
            var nodes = (node || document).getElementsByClassName(cls);
            for (i = 0; node = nodes[i++];) {
                if (tag !== '*' && node.tagName === tag.toUpperCase()) result.push(node); else result.push(node);
            }
            return result;
        } else {
            node = node || document;
            tag = tag || '*';
            var classes = cls.split(' '), elements = (tag === '*' && node.all) ? node.all : document.getElementsByTagName(tag), patterns = [], current, match;
            i = classes.length;
            while (--i > 0) {
                patterns.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)"));
            }
            var j = elements.length;
            while (--j >= 0) {
                current = elements[j];
                match = false;
                for (var k = 0, kl = patterns.length; k < kl; k++) {
                    match = patterns[k].test(current.className);
                    if (!match) break;
                }
                if (match) result.push(current);
                return result;
            }
        }
    };

    /**
     * IE 10 标准IE7下无法用getAttribute获取属性值
     */

    /**
     * insertAdjacentHTML
     */

}.call(Lass);
