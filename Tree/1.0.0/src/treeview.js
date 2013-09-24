/**
 * 组件：树
 * @classDescription 树控件
 * @namespace FOCUS.widget.treeView
 * @author xingshikang
 * @version 1.0.0
 * @since 2012.07.05
 */

/**
 * @definition
 * 1.构建节点或树的数据格式
 * treeData:[
 *           {id:"",text:"",expand:"",maxChildCount:10,child:[]}, //expand,maxChildCount,child等非必须
 *           {id:"",text:"",expand:"",child:[]} //可以自定义数据字段，自定义的字段将绑定在node对象中
 *          ]
 * 2.返回或作为参数的节点node对象
 * node:{
 *       id:"",       //给节点动态的id，可以通过getNodeById返回node
 *       dataId:"",   //数据唯一id，一般为数据库中id，可以通过getNodeByDataId返回node
 *       parentId:"", //父级节点id（不是dataid）
 *       text:"",
 *       expand:"",
 *       dom:null,      //指向节点（同时包含子节点的容器）的dom（jquery对象）
 *       item:null,     //指向节点的本身dom（jquery对象）
 *       childHome:null //指向包含子节点的容器dom（jquery对象）
 *       ...            //可以为数据中其他自定义字段
 *      }
 * 3.树结构和特性说明
 * 假象根节点：实际并不真正存在的节点，为逻辑上的最高节点，级别为0
 * 根节点：也为1级节点，而且数量不唯一，所以真正的节点级别从1开始
 * 节点dom结构:ol>
 *              li>
 *                  a>
 *                      span,span
 *                  ol>
 *                      ...
 *
 *              li>
 *                  a>
 *                      span,span
 */
FOCUS.namespace("FOCUS.widget.treeView");
FOCUS.widget.treeView=function(config){
    this._init(config);
}
FOCUS.widget.treeView.prototype = {
    _init: function(config) {
        this._config = {
            container: null, //树的dom容器，jquery选择器
            maxLevel: 3,     //最大节点级别，假象的根节点等级定义为0
            maxNode:-1,      //最大节点数，当值为负数时表示不限制
            maxChildCount:20,//每个节点下子节点的数量限制
            readonly: false, //只读，树不可以添加删除修改节点
            defExpand:false, //在节点数据中没有定义节点展开收缩状态时的默认配置，true为展开，false为收缩
            sort:false,      //排序，true:进行排序，false:不排序，fn:指定排序的规则，同array.sort用法
            sortAnim:true,   //是否开启排序动画效果
            ecAnim:{         //节点展开收缩的效果
                show:"slideDown",
                hide:"slideUp",
                speed:200
            },
            style: {
                rootBed: "FOCUS-treeview-root",    //1级节点容器样式
                nodeBed: "FOCUS-treeview-branch",  //普通节点容器样式
                rootLi: "FOCUS-treeview-rootLi",   //1级节点的li样式
                nodeLi: "FOCUS-treeview-nodeLi",   //普通节点的li样式
                nodeItem:"FOCUS-treeview-nodeItem",//节点中数据dom的样式
                anchor: "FOCUS-treeview-anchor",   //节点中数据dom中的图标样式
                label: "FOCUS-treeview-label",     //节点中数据dom中的文字样式
                expand: "FOCUS-treeview-expand",   //已展开节点的样式
                collapse:"FOCUS-treeview-collapse",//已收缩节点的样式
                leaf:"FOCUS-treeview-leaf",        //叶子节点的样式
                active:"FOCUS-treeview-active",    //被选中节点的样式
                hover:"FOCUS-treeview-hover"       //鼠标移动到节点的样式
            },
            temples: {}
        }
        this._config = $.extend(true, this._config, config);
        this._data = [];
        this._events={};
        this._treeDoms = [];
        this._sequence = 0;
        this._currentNodeCount=0;
    },
    //创建单个树节点
    _createNode: function(data, pid, afterIndex) {
        if(!data||(pid!=""&&!this.getNodeById(pid))||!this._canAddNode(pid)){
            return null;
        }
        var _li, _item, _anchor, _label, nodeBed, nodeInfo = {}, _this = this;
        nodeInfo= $.extend(true,{},data);
        var expand = typeof(data.expand)=="undefined"?this._config.defExpand:data.expand;
        var maxChildCount=typeof(data.maxChildCount)=="undefined"?this._config.maxChildCount:data.maxChildCount;
        //设置nodebed，装载节点的容器
        function _createNodeBed(appendToNode) {
            var _nodeBed, _ol;
            if (appendToNode.children("ol").length == 0) {
                _ol = $("<ol></ol>");
                appendToNode.append(_ol);
                _nodeBed = _ol;
            }
            else {
                _nodeBed = appendToNode.children("ol").eq(0);
            }
            return _nodeBed;
        }

        _li = $("<li></li>");
        _item = $("<a></a>");
        _item.attr("href", "javascript:void(0);").addClass(this._config.style.nodeItem).addClass(this._config.style.leaf);
        _anchor = $("<span></span>");
        _anchor.addClass(this._config.style.anchor);
        _label = $("<span></span>");
        _label.html(data.text).attr("title", data.text).addClass(this._config.style.label);
        _item.append(_anchor);
        _item.append(_label);
        _li.append(_item);

        if (pid == "") {//根节点
            nodeBed = _createNodeBed($(this._config.container));
            nodeBed.addClass(this._config.style.rootBed);
            _li.addClass(this._config.style.rootLi);
            nodeInfo.level = 1;
        }
        else {
            var parentNode = this.getNodeById(pid).dom;
            nodeBed = _createNodeBed(parentNode);
            nodeBed.addClass(this._config.style.nodeBed);
            _li.addClass(this._config.style.nodeLi);
            nodeInfo.level = parentNode.data("nodeInfo").level + 1;
        }

        if (nodeBed.children("li").length == 0 || typeof(afterIndex) != "number" || afterIndex < 0) {
            nodeBed.append(_li);
        }
        else {
            if (afterIndex > nodeBed.children("li").length - 1)
                afterIndex = nodeBed.children("li").length - 1;
            nodeBed.children("li").eq(afterIndex).after(_li);
        }

        //添加事件
        _item.bind("click", function() {
            var node=_this._nodeObj(_li);
            if(_this.hasChild(node)&&node.item.hasClass(_this._config.style.collapse)){
                _this.expendCollapse(node);
            }
            _this.select(node);
            return false;
        });
        _anchor.bind("click",function(){
            var node=_this._nodeObj(_li);
            if(_this.hasChild(node)){
                _this.expendCollapse(node);
            }
            return false;
        });
        _label.bind("dblclick",function(){
            var node=_this._nodeObj(_li);
            $(_this).trigger("eDbnodetext",[node,this]);
        });
        _item.bind("mouseover", function() {
            _item.addClass(_this._config.style.hover);
            return false;
        });
        _item.bind("mouseout", function() {
            _item.removeClass(_this._config.style.hover);
            return false;
        });

        //设置展开、收缩
        if (nodeInfo.level > 1 && pid != "") {
            var parentNode = this.getNodeById(pid);
            parentNode.item.removeClass(this._config.style.leaf);
            if (parentNode.expand) {
                parentNode.item.addClass(this._config.style.expand);
                parentNode.childHome.show();
            }
            else {
                parentNode.item.addClass(this._config.style.collapse)
                parentNode.childHome.hide();
            }
        }

        if(nodeInfo._treeDomId&&nodeInfo._treeDomId!=""){
            nodeInfo.id=nodeInfo._treeDomId;
            delete nodeInfo._treeDomId;
        }
        else{
            this._sequence++;
            nodeInfo.id = "FOCUS-treeview-"+this._sequence;
        }
        nodeInfo.parentId = pid;
        nodeInfo.dataId = data.id;
        nodeInfo.text = data.text;
        nodeInfo.expand=expand;
        nodeInfo.maxChildCount=maxChildCount;
        delete nodeInfo.child;
        _li.data("nodeInfo", nodeInfo);

        this._treeDoms[nodeInfo.id] = _li;
        this._currentNodeCount++;
        this._lastAddNode=this._nodeObj(_li);
        if(this._config.sort!=false){
            this.sort(this.getNodeById(nodeInfo.id));
        }

        this._fireEvent("eAdd",[this._nodeObj(_li),this]);
        return this._nodeObj(_li);
    },
    //是否到达总节点数
    _IsAtMaxNode:function(){
        if(this._config.maxNode>0&&this._currentNodeCount>=this._config.maxNode){
            this._fireEvent("eMaxnode",[this]);
            return false;
        }
        return true;
    },
    //是否到达最大子节点数
    _IsAtMaxChildCount:function(node){
        if(!node||(node!="root"&&!this._checkNodeObj(node))){
            return false;
        }
        var currentChildCount=0;
        var maxChildCount=0;
        if(node=="root"){
            currentChildCount=this._getRootOl()?this._getRootOl().children("li").length:0;
            maxChildCount=parseInt(this._config.maxChildCount)
        }
        else{
            currentChildCount=node.childHome?node.childHome.children("li").length:0;
            maxChildCount=node.maxChildCount;
        }
        if(maxChildCount==0){
            return false;
        }
        if(maxChildCount>0){
            if(currentChildCount>=maxChildCount){
                this._fireEvent("eMaxChildCount",[node,this]);
                return false;
            }
        }
        return true;
    },
    //是否到最大节点级别
    _IsAtMaxLevel:function(node){
        if(!node||(node!="root"&&!this._checkNodeObj(node))){
            return false;
        }
        var maxLevel=parseInt(this._config.maxLevel);
        if(maxLevel==0){
            return false;
        }
        if(node=="root"||maxLevel<0||isNaN(maxLevel)){
            return true;
        }
        if (node.level >= maxLevel) {
            this._fireEvent("eMaxlevel",[node,this]);
            return false;
        }
        else {
            return true;
        }
    },
    //判断是否可以继续添加node
    _canAddNode: function(nodeid) {
        var node;
        if(nodeid!=""){
            node=this.getNodeById(nodeid);
            if(!this._checkNodeObj(node)){
                return false;
            }
        }
        else{
            node="root";
        }
        //总节点数判断
        if(!this._IsAtMaxNode()){
            return false;
        }
        //子节点个数限制判断
        if(!this._IsAtMaxChildCount(node)){
            return false;
        }
        //最大级别判断
        if(!this._IsAtMaxLevel(node)){
            return false;
        }
        return true;
    },
    //判断是否可以对树进行编辑
    _canEdit:function(){
        return !this._config.readonly&&!this._sorting;
    },
    //判断是否可以进行节点移动(该方法假设所有传入参数合法)
    _canEditNodeLoc:function(node,targetNode,locTag){
        var _this=this;
        var maxLevel=parseInt(this._config.maxLevel);
        if(maxLevel<=0||isNaN(maxLevel)){
            return true;
        }
        function _getMaxChildLevel(node){
            var maxLevel=0;
            var lis=node.dom.find("li");
            $.each(lis,function(i,n){
                var _node=_this._nodeObj($(n));
                if(_node.level>maxLevel){
                    maxLevel=_node.level;
                }
            });
            return maxLevel;
        }
        var _doneLevel=targetNode.level;
        var _maxChildLevel=_getMaxChildLevel(node);
        if(locTag=="IN"){
            _doneLevel=_doneLevel+_maxChildLevel-node.level+1;
        }
        else{
            _doneLevel=_doneLevel+_maxChildLevel-node.level;
        }
        if(maxLevel<_doneLevel){
            return false;
        }
        if(!this._IsAtMaxChildCount(targetNode)){
            return false;
        }
        return true;
    },
    //将dom对象转换为node节点对象
    _nodeObj:function(dom){
        if(!(dom&&dom.length>0)){
            return null;
        }
        var node={};
        if (dom.data("nodeInfo")) {
            node=dom.data("nodeInfo");
        }
        node.dom=dom;
        node.item=dom.children("a").eq(0);
        node.childHome=dom.children("ol").eq(0);
        return this._checkNodeObj(node)?node:null;
    },
    //检查node对象是否合法
    _checkNodeObj:function(node){
        if(!node||node.dom.length==0||!node.id||!node.level||node.item.length==0){
            return false;
        }
        if(!this._treeDoms[node.id]){
            return false;
        }
        return true;
    },
    //获得假想根节点的子节点容器
    _getRootOl:function(){
        if($(this._config.container).children("ol").length>0){
            return $(this._config.container).children("ol").eq(0);
        }
        else{
            return null;
        }
    },
    //触发事件，参数同jquery的trigger参数
    _fireEvent:function(){
        if(typeof(this._events[arguments[0]])!="undefined"&&this._events[arguments[0]]===false){
            this._events[arguments[0]]=true;
        }
        else{
            $(this).trigger.apply($(this),arguments);
        }
    },
    /**
     * 构建树
     * @param {Object} data 树数据
     */
    built: function(data) {
        if (!data || !$.isArray(data)) {
            return;
        }
        $(this._config.container).children().remove();
        var batch= $.browser.msie&&parseInt($.browser.version)<9?1:20;
        this._forBulit=true;
        this.addNodes(data, "", -1,batch,function(){
            this._forBulit=false;
            this._fireEvent("init",[this]);
        });
    },
    /**
     * 增加节点
     * @param {Object} data 节点数据
     * @param {String} pid 父级节点的id
     * @param {Int} afterIndex 节点放置在父节点中a节点的后面，a节点所处的序列
     * @param {Boolean} autoSelect 添加节点时，是否自动展开其父节点并选择该节点
     */
    addNode: function(data, pid, afterIndex,autoSelect) {
        if(!this._canEdit()){
            return false;
        }
        var node=this._createNode(data, pid, afterIndex);
        var _autoSelect=typeof(autoSelect)=="undefined"?true:autoSelect;
        if(node&&_autoSelect){
            this.expendCollapse(node,true);
        }
        return node?node:false;
    },
    /**
     * 增加一系列分支节点(异步)
     * @param data 节点数据，数组
     * @param pid 父级节点的id
     * @param afterIndex 节点放置在父节点中a节点的后面，a节点所处的序列
     * @param batch 每次批量生成的节点数量
     * @param callback 所有节点创建完成后执行
     * @return {Boolean}
     */
    addNodes:function (data, pid, afterIndex,batch,callback) {
        if(!this._forBulit&&!this._canEdit()){
            return false;
        }
        var _this = this;
        var _batch=batch&&parseInt(batch)>0?batch:1;
        _this._backSort=_this._config.sort;

        var nodeDatas= [];
        //整理节点数据
        function _arrangeNode(data,pid,afterIndex){
            var _children=[];
            $.each(data,function(i,n,afterIndex){
                var _nodeInfo= $.extend(true,{},n);
                _this._sequence++;
                _nodeInfo._treeDomId = "FOCUS-treeview-"+_this._sequence;
                _nodeInfo._afterIndex=afterIndex;
                _nodeInfo._parentId=pid;
                delete _nodeInfo.child;
                nodeDatas.push(_nodeInfo);
                if (n.child) {
                    _children.push({
                        pid:_nodeInfo._treeDomId,
                        node:n.child
                    });
                }
            });
            if(_children.length>0){
                $.each(_children,function(i,n){
                    _arrangeNode(n.node, n.pid, -1);
                });
            }
        }
        //rend节点
        function _asynRendNode(nodeDatas){
            var rendCount=nodeDatas.length>_batch?_batch:nodeDatas.length;
            for(var i=0;i<rendCount;i++){
                var _node=nodeDatas.shift();
                var data= $.extend(true,{},_node);
                delete data._afterIndex;
                delete data._parentId;
                if(_this._backSort){
                    if(nodeDatas.length==0||nodeDatas[0]._parentId!=_node._parentId){
                        _this._config.sort=true;
                    }
                    else{
                        _this._config.sort=false;
                    }
                }
                _this._createNode(data, _node._parentId, _node._afterIndex);
            }
            if(nodeDatas.length>0){
                setTimeout(function(){
                    _asynRendNode(nodeDatas);
                },1);
            }
            else{
                if($.isFunction(callback)){
                    callback.apply(_this,arguments);
                }
            }
        }
        _arrangeNode(data,pid,afterIndex);
        _asynRendNode(nodeDatas);
    },
    /**
     * 删除节点
     * @param {Object} node 删除的节点
     * @param {Object} delChilds 是否删除所有子节点
     */
    delNode: function(node,delChilds) {
        if(!this._canEdit()||!this._checkNodeObj(node)){
            return false;
        }
        var _this=this;
        var parentNode=this.getParentNode(node);
        var parentDom=node.dom.parent("ol");
        if(!delChilds){
            var lis=node.dom.find("li");
            $.each(lis,function(i,n){
                if($(n).data("nodeInfo")){
                    var level=$(n).data("nodeInfo").level;
                    $(n).data("nodeInfo").level=level-1;
                }
            });
            var childNodes=this.getchildNodes(node);
            var parentId=node.parentId;
            var nextDom=node.dom.next("li");
            $.each(childNodes,function(i,node){
                if(nextDom.length>0){
                    nextDom.before(node.dom);
                }
                else{
                    parentDom.append(node.dom);
                }
                node.parentId=parentId;
            });
        }
        delete this._treeDoms[node.id];
        this._currentNodeCount=this._currentNodeCount-node.dom.find("li").length-1;
        node.dom.remove();
        if(parentDom.children("li").length==0){
            if(parentNode){
                parentNode.item.removeClass(this._config.style.expand).removeClass(this._config.style.collapse);
                parentNode.item.addClass(this._config.style.leaf);
            }
            parentDom.remove();
        }
        else{
            if(this._config.sort!=false){
                this.sort(this.getNodeByDom(parentDom.children("li").eq(0)));
            }
        }
        if(this._lastSelectedNode&&node.id==this._lastSelectedNode.id){
            this._lastSelectedNode=null;
        }
        if(this._lastAddNode&&node.id==this._lastAddNode.id){
            this._lastAddNode=null;
        }
        this._fireEvent("eAfterdel",[node,this]);
        return true;
    },
    /**
     * 编辑节点信息
     * @param node 待编辑节点
     * @param data 修改的数据
     */
    editNodeInfo:function(node,data){
        if(!this._canEdit()||!this._checkNodeObj(node)){
            return false;
        }
        var nodeInfo=node.dom.data("nodeInfo");
        if(data.id&&data.id!=nodeInfo.dataId){
            nodeInfo.dataId=data.id;
            delete data.id;
        }
        if(data.text&&data.text!=nodeInfo.text){
            var _label=node.item.children("span").eq(1);
            _label.html(data.text).attr("title", data.text);
        }
        $.extend(true,nodeInfo,data);
        node.dom.data("nodeInfo",nodeInfo);
        return true;
    },
    /**
     * 移动节点位置
     * @param node 待移动的节点
     * @param targetNode 目标位置节点
     * @param locTag 与目标位置节点的关系，"UP":上，"DOWN":下，"IN":内部
     * @param autoSelect 移动节点完成后，是否自动展开其父节点并选择该被移动节点
     */
    editNodeLoc:function(node,targetNode,locTag,autoSelect){
        if(!this._canEdit()){
            return false;
        }
        if(!this._checkNodeObj(node)||!targetNode||(targetNode!="root"&&!this._checkNodeObj(targetNode))){
            return false;
        }
        if(!this._canEditNodeLoc(node,targetNode,locTag)){
            return false;
        }
        var parentDom=node.dom.parent("ol");
        var parentNode=this.getParentNode(node);
        var nodeLevel=node.level;
        var _pid,_levelOffset;
        if(targetNode=="root"){
            this._getRootOl().append(node.dom);
            _pid="";
            _levelOffset=1-nodeLevel;
        }
        else{
            switch(locTag){
                case "UP":{
                    targetNode.dom.before(node.dom);
                    _pid=targetNode.parentId;
                    _levelOffset=targetNode.level-nodeLevel;
                }
                    break;
                case "DOWN":{
                    targetNode.dom.after(node.dom);
                    _pid=targetNode.parentId;
                    _levelOffset=targetNode.level-nodeLevel;
                }
                    break;
                case "IN":{
                    var _ol=targetNode.childHome;
                    if(_ol.length==0){
                        _ol=$("<ol></ol>");
                        _ol.addClass(this._config.style.nodeBed);
                        targetNode.dom.append(_ol);
                    }
                    _ol.append(node.dom);
                    _pid=targetNode.id;
                    _levelOffset=targetNode.level-nodeLevel+1;
                }
                    break;
                default:
                    return false;
            }
        }
        node.dom.data("nodeInfo").parentId=_pid;
        node.dom.data("nodeInfo").level=nodeLevel+_levelOffset;
        var lis=node.dom.find("li");
        $.each(lis,function(i,n){
            if($(n).data("nodeInfo")){
                var level=$(n).data("nodeInfo").level;
                $(n).data("nodeInfo").level=level+_levelOffset;
            }
        });

        if(this._config.sort!=false){
            this.sort(node);
        }
        if(parentDom.children("li").length==0){
            if(parentNode){
                parentNode.item.removeClass(this._config.style.expand).removeClass(this._config.style.collapse);
                parentNode.item.addClass(this._config.style.leaf);
            }
            parentDom.remove();
        }
        var _autoSelect=typeof(autoSelect)=="undefined"?true:autoSelect;
        if(_autoSelect){
            this.expendCollapse(node,true);
        }
        return true;
    },
    /**
     * 节点排序
     * @功能 对指定节点在当前级别节点下进行排序，该方法会引起树节点位置的改变
     * @param node 待排序的节点
     * @param sortFn
     */
    sort:function(node,sortFn){
        if(!this._checkNodeObj(node)){
            return;
        }
        var _this=this;
        var parentDom=node.dom.parent("ol");
        var sortNodes=[],fixedNodes=[];
        var childDoms=parentDom.children("li");
        $.each(childDoms,function(i,dom){
            var _node=_this._nodeObj($(dom));
            if(_node.fixedPos&&(_node.fixedPos>=1||_node.fixedPos===-1)){
                fixedNodes.push(_node);
            }else{
                sortNodes.push(_node);
            }
        });
        var _defaultSort=function(a,b){
            return a.text>b.text?1:-1;
        }
        var _sortFn=$.isFunction(this._config.sort)?this._config.sort:_defaultSort;
        _sortFn=sortFn&&$.isFunction(sortFn)?sortFn:_sortFn;
        //计算排序结果数据
        sortNodes.sort(_sortFn);
        fixedNodes.sort(function(a,b){
            if(a.fixedPos== b.fixedPos){
                return _sortFn.call(this,a,b);
            }
            return a.fixedPos===-1||a.fixedPos>b.fixedPos?1:-1;
        });
        $.each(fixedNodes,function(i,n){
            if(n.fixedPos>sortNodes.length|| n.fixedPos===-1){
                sortNodes.splice(sortNodes.length,0, n);
            }
            else{
                sortNodes.splice(n.fixedPos-1,0, n);
            }
        });
        //排列节点
        var _noAnimate=this._forBulit;
        function _moveNode(i,n){
            var _lis=parentDom.children("li");
            if(i<sortNodes.length-1){
                var _fromPos=n.dom.offset();
                var _toPos=_lis.eq(i).offset();
                var _savePosition=n.dom.css("position");
                var _savefontSize=n.dom.css("font-size");
                n.dom.css("position","absolute").css("top", _fromPos.top).css("left", _fromPos.left);
                n.dom.css("font-size",20);
                var __timer=(i!=_lis.index(n.dom))?_timer:0;
                n.dom.animate({top:_toPos.top,left:_toPos.left,fontSize:_savefontSize},__timer,function(){
                    if(i!=_lis.index(n.dom)){
                        _lis.eq(i).before(n.dom);
                    }
                    n.dom.css("position",_savePosition);
                    _moveNode(i+1,sortNodes[i+1]);
                });
            }
            else{
                _this._sorting=false;
                return;
            }
        }
        if(_noAnimate||!_this._config.sortAnim){
            $.each(sortNodes,function(i,n){
                var _lis=parentDom.children("li");
                if(i<sortNodes.length-1&&i!=_lis.index(n.dom)){
                    _lis.eq(i).before(n.dom);
                }
            });
        }
        else{
            _this._sorting=true;
            var _timer=1000/(sortNodes.length+1);
            _timer=(_timer>200||_timer<=0)?200:_timer;
            _moveNode(0,sortNodes[0]);
        }
    },
    /**
     * 选择节点
     * @param node 待选择的节点
     */
    select:function(node){
        if(this._lastSelectedNode){
            this._lastSelectedNode.item.removeClass(this._config.style.active);
        }
        node.item.addClass(this._config.style.active);
        this._lastSelectedNode=node;
        this._fireEvent("eSelect",[node,this])
    },
    /**
     * 取消选中节点
     * @param node 待取消选中的节点，非必须（当该参数为空时，取消当前被选中的节点）
     */
    unSelect:function(node){
        if(node){
            node.item.removeClass(this._config.style.active);
        }
        if(this._lastSelectedNode){
            if(!node){
                node=this._lastSelectedNode;
            }
            this._lastSelectedNode.item.removeClass(this._config.style.active);
        }
        this._lastSelectedNode=null;
        this._fireEvent("eUnSelect",[node,this]);
    },
    /**
     * 展开或收缩节点
     * @param node 节点
     * @param autoSelect 是否自动选择该节点
     */
    expendCollapse:function(node,autoSelect){
        var _item=node.item;
        var _ol=node.childHome;
        if(_item.hasClass(this._config.style.collapse)){
            _item.removeClass(this._config.style.collapse);
            _item.addClass(this._config.style.expand);
            node.expand=true;
            _ol[this._config.ecAnim.show](this._config.ecAnim.speed);
            this._fireEvent("eExpand",[node,this]);
        }
        else if(_item.hasClass(this._config.style.expand)){
            _item.removeClass(this._config.style.expand);
            _item.addClass(this._config.style.collapse);
            node.expand=false;
            _ol[this._config.ecAnim.hide](this._config.ecAnim.speed);
            this._fireEvent("eCollapse",[node,this]);
        }

        if(autoSelect){
            var parentNode=this.getParentNode(node);
            while(parentNode!=null){
                if(parentNode.item.hasClass(this._config.style.collapse)){
                    this.expendCollapse(parentNode);
                }
                parentNode=this.getParentNode(parentNode);
            }
            this.select(node);
        }
    },
    /**
     * 通过dom对象获取节点
     * @param dom
     * @return {*}
     */
    getNodeByDom:function(dom){
        return this._nodeObj(dom);
    },
    /**
     * 通过nodeid获取节点
     * @param id
     * @return {*}
     */
    getNodeById:function(id) {
        return this._nodeObj(this._treeDoms[id]);
    },
    /**
     * 通过节点的数据id获取节点
     * @param dataId
     * @return {*}
     */
    getNodeByDataId:function(dataId){
        var node;
        for(var treedom in this._treeDoms){
            var _node=this._nodeObj(this._treeDoms[treedom]);
            if(_node.dataId==dataId){
                node=_node;
                break;
            }
        }
        return node;
    },
    /**
     * 通过节点位置获取节点
     * @param loc 必须为数字数组，其中每个数字代表当前级别的第几个节点
     * @return {*}
     * @example getNodeByLoc([1,2,3]) 获取第一级节点中的第一个节点中，第二个节点下的第三个节点。
     */
    getNodeByLoc:function(loc){
        if (!loc || !$.isArray(loc)) {
            return;
        }
        var _this=this;
        var dom;
        $.each(loc,function(i,n){
            if(i==0){
                dom=_this._getRootOl().children("li").eq(n-1);
            }
            else{
                var _ol=dom.children("ol");
                if(_ol.length==0){
                    dom=null;
                    return false;
                }
                dom=_ol.eq(0).children("li").eq(n-1);
            }
            if(dom.length==0){
                dom=null;
                return false;
            }
        });
        return this._nodeObj(dom);
    },
    /**
     * 获取节点的位置坐标
     * @param node 待获取位置的node节点
     * @return {*} 返回数组，数组的长度为该节点的深度，对应的每个值为不同深度的节点序列
     * @example getNodeLoc(node)=>[1,2,3] 表明该节点的位置是第一级节点的第一个节点下，第二个节点内的第三个节点
     */
    getNodeLoc:function(node){
        if(!this._checkNodeObj(node)){
            return [];
        }
        var locArray=[node.level-1];
        while(node!=null){
            var parentDom,parentNode;
            if(node.level==1){
                parentNode=null;
                parentDom=this._getRootOl();
            }
            else if(node.level>1){
                parentNode=this.getParentNode(node);
                parentDom=parentNode.childHome;
            }
            locArray[node.level-1]=parentDom.children("li").index(node.dom)+1;
            node=parentNode;
        }
        return locArray;
    },
    /**
     * 获取父节点
     * @param node
     * @return {*}
     */
    getParentNode: function(node) {
        if(!this._checkNodeObj(node)||node.parentId==""){
            return null;
        }
        return this.getNodeById(node.parentId);
    },
    /**
     * 获取子节点
     * @param node
     * @return {Array}
     */
    getchildNodes: function(node) {
        if(!node||(node!="root"&&!this._checkNodeObj(node))){
            return [];
        }
        var _this=this;
        var childNodes=[];
        var _ol=node=="root"?this._getRootOl():node.childHome;
        if(_ol&&_ol.length>0){
            var lis=_ol.children("li");
            $.each(lis,function(i,n){
                var node=_this._nodeObj($(n));
                childNodes.push(node);
            });
        }
        return childNodes;
    },
    /**
     * 获取当前选择的节点
     * @return {*}
     */
    getSelectedNode:function(){
        return this._lastSelectedNode||null;
    },
    /**
     * 获取最后添加的节点
     * @return {*}
     */
    getLastAddNode:function(){
        return this._lastAddNode||null;
    },
    /**
     * 获取整棵树的数据
     * @param inclueExpand 是否同时取出节点当前收缩展开的状态数据，默认获取
     * @return {*}
     */
    getTreeData:function(inclueExpand){
        var _this=this;
        function _getSrcData(_ol){
            var data=[];
            if(_ol.length==0){
                return;
            }
            var _lis=_ol.children("li");
            $.each(_lis,function(i,n){
                var _node=_this.getNodeByDom($(n));
                if(_this._checkNodeObj(_node)){
                    var _data= $.extend(true,{},_node);
                    _data.id=_node.dataId;
                    delete _data.dataId;
                    delete _data.dom;
                    delete _data.item;
                    delete _data.childHome;
                    delete _data.parentId;
                    if(inclueExpand===false){
                        delete _data.expand;
                    }
                    if(_this.getchildNodes(_node).length>0){
                        _data.child=_getSrcData(_node.childHome,data.child);
                    }
                    data.push(_data);
                }
            });
            return data;
        }
        return _getSrcData(this._getRootOl());
    },
    /**
     * 判断一个节点下是否存在子节点
     * @param {Object} node
     */
    hasChild:function(node){
        return this.getchildNodes(node).length>0?true:false;
    },
    /**
     * 初始化事件，在构建树完成时触发
     * @param fn
     * @param obj
     * @param overrideContext
     */
    onInit:function(fn,obj,overrideContext){
        if (!$.isFunction(fn)) {
            FOCUS.util.log.warn("FOCUS.widget.treeView --> onInit : fn is not a function!");
            return;
        }
        var _fn = function(ev,treeview) {
            fn.call(overrideContext,ev,treeview);
        }
        $(this).bind("init", obj, _fn);
    },
    /**
     * 选择节点事件，在选择节点后触发
     * @param fn
     * @param obj
     * @param overrideContext
     */
    onSelect:function(fn, obj, overrideContext) {
        if (!$.isFunction(fn)) {
            FOCUS.util.log.warn("FOCUS.widget.treeView --> onSelect : fn is not a function!");
            return;
        }
        var _fn = function(ev,node,treeview) {
            fn.call(overrideContext, ev, node,treeview);
        }
        $(this).bind("eSelect", obj, _fn);
    },
    /**
     * 取消选择节点事件，在取消选择节点后触发
     * @param fn
     * @param obj
     * @param overrideContext
     */
    onUnSelect:function(fn, obj, overrideContext) {
        if (!$.isFunction(fn)) {
            FOCUS.util.log.warn("FOCUS.widget.treeView --> onUnSelect : fn is not a function!");
            return;
        }
        var _fn = function(ev,node,treeview) {
            fn.call(overrideContext, ev, node,treeview);
        }
        $(this).bind("eUnSelect", obj, _fn);
    },
    /**
     * 展开节点事件，在展开节点后触发
     * @param fn
     * @param obj
     * @param overrideContext
     */
    onExpand: function(fn, obj, overrideContext) {
        if (!$.isFunction(fn)) {
            FOCUS.util.log.warn("FOCUS.widget.treeView --> onExpand : fn is not a function!");
            return;
        }
        var _fn = function(ev,node,treeview) {
            fn.call(overrideContext, ev, node,treeview);
        }
        $(this).bind("eExpand", obj, _fn);
    },
    /**
     * 收缩节点事件，在收缩节点后触发
     * @param fn
     * @param obj
     * @param overrideContext
     */
    onCollapse:function(fn, obj, overrideContext) {
        if (!$.isFunction(fn)) {
            FOCUS.util.log.warn("FOCUS.widget.treeView --> onCollapse : fn is not a function!");
            return;
        }
        var _fn = function(ev,node,treeview) {
            fn.call(overrideContext, ev, node,treeview);
        }
        $(this).bind("eCollapse", obj, _fn);
    },
    /**
     * 添加节点事件，在添加节点后触发
     * @param fn
     * @param obj
     * @param overrideContext
     */
    onAdd:function(fn, obj, overrideContext) {
        if (!$.isFunction(fn)) {
            FOCUS.util.log.warn("FOCUS.widget.treeView --> onAdd : fn is not a function!");
            return;
        }
        var _fn = function(ev,node,treeview) {
            fn.call(overrideContext, ev, node,treeview);
        }
        $(this).bind("eAdd", obj, _fn);
    },
    /**
     * 删除节点事件，在删除节点后触发
     * @param fn
     * @param obj
     * @param overrideContext
     */
    onAfterDel:function(fn, obj, overrideContext) {
        if (!$.isFunction(fn)) {
            FOCUS.util.log.warn("FOCUS.widget.treeView --> afterDel : fn is not a function!");
            return;
        }
        var _fn = function(ev,node,treeview) {
            fn.call(overrideContext, ev, node,treeview);
        }
        $(this).bind("eAfterdel", obj, _fn);
    },
    /**
     * 达到最大级别而被阻止添加节点时触发
     * @param fn
     * @param obj
     * @param overrideContext
     */
    onMaxLevel:function(fn, obj, overrideContext) {
        if (!$.isFunction(fn)) {
            FOCUS.util.log.warn("FOCUS.widget.treeView --> onMaxLevel : fn is not a function!");
            return;
        }
        var _fn = function(ev,node,treeview) {
            fn.call(overrideContext, ev, node,treeview);
        }
        $(this).bind("eMaxlevel", obj, _fn);
    },
    /**
     * 达到限制的最大节点数而被阻止添加节点时触发
     * @param fn
     * @param obj
     * @param overrideContext
     */
    onMaxNode:function(fn, obj, overrideContext) {
        if (!$.isFunction(fn)) {
            FOCUS.util.log.warn("FOCUS.widget.treeView --> onMaxNode : fn is not a function!");
            return;
        }
        var _fn = function(ev,treeview) {
            fn.call(overrideContext, ev,treeview);
        }
        $(this).bind("eMaxnode", obj, _fn);
    },
    /**
     * 达到当前节点最大限制子节点数而被阻止添加节点时触发
     * @param fn
     * @param obj
     * @param overrideContext
     */
    onMaxChildCount:function(fn, obj, overrideContext) {
        if (!$.isFunction(fn)) {
            FOCUS.util.log.warn("FOCUS.widget.treeView --> onMaxChildCount : fn is not a function!");
            return;
        }
        var _fn = function(ev,node,treeview) {
            fn.call(overrideContext, ev, node,treeview);
        }
        $(this).bind("eMaxChildCount", obj, _fn);
    },
    /**
     * 双击节点文本区域时触发
     * @param fn
     * @param obj
     * @param overrideContext
     */
    onDbNodeText:function(fn, obj, overrideContext) {
        if (!$.isFunction(fn)) {
            FOCUS.util.log.warn("FOCUS.widget.treeView --> onDbNodeText : fn is not a function!");
            return;
        }
        var _fn = function(ev,node,treeview) {
            fn.call(overrideContext, ev,node,treeview);
        }
        $(this).bind("eDbnodetext", obj, _fn);
    },
    /**
     * 取消绑定的事件
     * @param eventName 取消的事件名
     * @param interim 是否为临时取消，ture:临时取消的事件只会在下一次临时不执行，false:彻底删除所有的绑定事件
     */
    cancelEvent:function(eventName,interim){
        if(typeof(eventName)=="undefined"||typeof(this[eventName])!="function"){
            FOCUS.util.log.warn("FOCUS.widget.treeView --> cancelEvent : eventName is invaid!");
            return;
        }
        if(interim===true){
            this._events["e"+eventName.substr(2)]=false;
            return;
        }
        $(this).unbind("e"+eventName.substr(2));
    }
}