// Copyright 2012 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview
 * @author sheny@made-in-china.com
 * @version v0.1
 */

/* 基本选择器 */
//E
//E#myid
//E.class

/* 关系选择器 */
//E > F 亲子
//E + F 近邻(后面的近邻)
//E ~ F 父
//E  F 后代

/* 属性选择器 css2 */
//[attribute]	用于选取带有指定属性的元素。
//[attribute=value]	用于选取带有指定属性和值的元素。
//[attribute~=value] 用于选取属性值中包含指定词汇的元素。
//[attribute|=value] 用于选取带有以指定值开头的属性值的元素，该值必须是整个单词。
//[attribute^=value] 匹配属性值以指定值开头的每个元素。
//[attribute$=value] 匹配属性值以指定值结尾的每个元素。
//[attribute*=value] 匹配属性值中包含指定值的每个元素。


/* 伪类选择器 */
//E:nth-child(n)
//E:nth-last-child(n)
//E:nth-of-type(n)
//E:nth-last-of-type(n)
//E:first-child
//E:last-child
//E:first-of-type
//E:last-of-type
//E:only-child
//E:only-of-type
//E:empty
//E:not(s)
//E:enabled
//E:disabled
//E:checked
//E:selected    // 非标准
//E:hidden    // 非标准
//E:visible    // 非标准

;void function() {
    var L = function() {

    };

    extend(L.prototype, LE);

    this.L = $;
}.call(lass);