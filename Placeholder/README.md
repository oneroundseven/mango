## Placeholder 组件

### 主要功能

* IE6、IE7、IE8、IE9、FF3.6等不支持HTML5 placeholder的功能的浏览器支持placeholder。
* 支持所有浏览器全部统一使用模拟placeholder。
* 支持动态重置placeholder的值。

![Alt text][id]
[id]: logo.png  "Example Image"

#### 版本1.2
Date : 2013-09-10
[1.2]: 1.2/example/example.html "示例"
[1.2.doc]: 1.2/doc/Placeholder.html "API"
[1.2.source_m]: 1.2/release/placeholder.1.2.min.js
[1.2.source_c]: 1.2/release/placeholder.js

[Example][1.2]

[Documentation][1.2.doc]

#### DownLoad

[[fullSize]][1.2.source_c]
[[minSize]][1.2.source_m]


##### ChangeLog：
>修复IE10下的IE7标准模式中getAttribute获取不到对应的input的placeholder值的bug。



#### 版本1.1
Date : 2013-08-19
[1.1]: 1.1/example/example.html "示例"
[1.1.doc]: 1.1/doc/Placeholder.html "API"
[1.1.source_m]: 1.1/release/placeholder.1.1.min.js
[1.1.source_c]: 1.1/release/placeholder.js

[Example][1.1]

[Documentation][1.1.doc]

#### DownLoad

[[fullSize]][1.1.source_c]
[[minSize]][1.1.source_m]

##### ChangeLog：
>IE6下面的bug修复。
>
>减少了对Lass一些即将去除的类库的依赖。
>
>增加了自动初始化参数 Placeholder.initPage(config) 初始化整个页面所有 input 和 textarea
>
>剔除元素必须有id的属性的依赖，如有id则使用，没有id自动生成id
>
>增加可配样式Style对象(color:'#BBB' fontFamily:'Arial')
>
>onchange事件不再作为参数传入，改为如下方式调用

    var p = new Placeholder({ carrier : [Element] })
    p.onchange(function(){ 
        // will be trigger 
    })


##### 2013-08-21
> 增加emMethod属性用于控制暗注释的显隐方式 目前支持'input'和'focus'(默认值)

    new Placeholder({
        carrier : document.getElementById('inputHide'),
        control : {
            emMethod : 'input'
        }
    });

##### 2013-08-22
> 增加用于控制模拟placeholder元素显隐的方法 show 和 hide (具体用法见实例和最新文档)
> 
> 更换 setValue 方法名为 setPlaceholder
>
> 修复FF下面 getComputedStyle 获取padding值为空的bug
> 
> 优化了部分代码实现





#### 版本1.0
Date : 2013-3-26
[1.0]: 1.0/example/example.html "示例"
[1.0.doc]: 1.0/doc/Placeholder.html "API"

[Example][1.0]

[Documentation][1.0.doc]

##### ChangeLog：
>2013.03.29 修复设置unifieddisplay:true时候js报错。

>2013.03.15 修复FF3.6浏览器下模拟placeholder定位错位的问题。

>2013.03.26 发布1.0版本。

