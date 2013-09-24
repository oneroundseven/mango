(function(){
	// treeview test
	var treedata=[
		{id:"1001",text:"node7",child:[
            {id:"1001001",text:"node2",fixedPos:1,extend:true},
			{id:"1001001",text:"node3",fixedPos:5},
			{id:"1001002",text:"node4",fixedPos:-1,maxChildCount:2,child:[
				{id:"1001001001",text:"node2",child:[
					{id:"1001001001001",text:"node1112323"}
				]}
			]},
			{id:"1001003",text:"node1"}
		]},
		{id:"1002",text:"node2"},
		{id:"1003",text:"node6"},
		{id:"1004",text:"node4"},
		{id:"1005",text:"node5"},
        {id:"1001",text:"node7",child:[
            {id:"1001001",text:"node2",fixedPos:1},
            {id:"1001001",text:"node3",fixedPos:5},
            {id:"1001002",text:"node4",fixedPos:-1,maxChildCount:2,child:[
                {id:"1001001001",text:"node2",child:[
                    {id:"1001001001001",text:"node1112323"}
                ]}
            ]},
            {id:"1001003",text:"node1"}
        ]},
        {id:"1002",text:"node2"},
        {id:"1003",text:"node6"},
        {id:"1004",text:"node4"},
        {id:"1005",text:"node5"},
        {id:"1001",text:"node7",child:[
            {id:"1001001",text:"node2",fixedPos:1},
            {id:"1001001",text:"node3",fixedPos:5},
            {id:"1001002",text:"node4",fixedPos:-1,maxChildCount:2,child:[
                {id:"1001001001",text:"node2",child:[
                    {id:"1001001001001",text:"node1112323"}
                ]}
            ]},
            {id:"1001003",text:"node1"}
        ]},
        {id:"1002",text:"node2"},
        {id:"1003",text:"node6"},
        {id:"1004",text:"node4"},
        {id:"1005",text:"node5"},{id:"1001",text:"node7",child:[
            {id:"1001001",text:"node2",fixedPos:1},
            {id:"1001001",text:"node3",fixedPos:5},
            {id:"1001002",text:"node4",fixedPos:-1,maxChildCount:2,child:[
                {id:"1001001001",text:"node2",child:[
                    {id:"1001001001001",text:"node1112323"}
                ]}
            ]},
            {id:"1001003",text:"node1"}
        ]},
        {id:"1002",text:"node2"},
        {id:"1003",text:"node6"},
        {id:"1004",text:"node4"},
        {id:"1005",text:"node5"},
        {id:"1001",text:"node7",child:[
            {id:"1001001",text:"node2",fixedPos:1},
            {id:"1001001",text:"node3",fixedPos:5},
            {id:"1001002",text:"node4",fixedPos:-1,maxChildCount:2,child:[
                {id:"1001001001",text:"node2",child:[
                    {id:"1001001001001",text:"node1112323"}
                ]}
            ]},
            {id:"1001003",text:"node1"}
        ]},
        {id:"1002",text:"node2"},
        {id:"1003",text:"node6"},
        {id:"1004",text:"node4"},
        {id:"1005",text:"node5"},
        {id:"1001",text:"node7",child:[
            {id:"1001001",text:"node2",fixedPos:1},
            {id:"1001001",text:"node3",fixedPos:5},
            {id:"1001002",text:"node4",fixedPos:-1,maxChildCount:2,child:[
                {id:"1001001001",text:"node2",child:[
                    {id:"1001001001001",text:"node1112323"}
                ]}
            ]},
            {id:"1001003",text:"node1"}
        ]},
        {id:"1002",text:"node2"},
        {id:"1003",text:"node6"},
        {id:"1004",text:"node4"},
        {id:"1005",text:"node5"},
        {id:"1001",text:"node7",child:[
            {id:"1001001",text:"node2",fixedPos:1},
            {id:"1001001",text:"node3",fixedPos:5},
            {id:"1001002",text:"node4",fixedPos:-1,maxChildCount:2,child:[
                {id:"1001001001",text:"node2",child:[
                    {id:"1001001001001",text:"node1112323"}
                ]}
            ]},
            {id:"1001003",text:"node1"}
        ]},
        {id:"1002",text:"node2"},
        {id:"1003",text:"node6"},
        {id:"1004",text:"node4"},
        {id:"1005",text:"node5"},
        {id:"1001",text:"node7",child:[
            {id:"1001001",text:"node2",fixedPos:1},
            {id:"1001001",text:"node3",fixedPos:5},
            {id:"1001002",text:"node4",fixedPos:-1,maxChildCount:2,child:[
                {id:"1001001001",text:"node2",child:[
                    {id:"1001001001001",text:"node1112323"}
                ]}
            ]},
            {id:"1001003",text:"node1"}
        ]}

	];
	var tree=new FOCUS.widget.treeView({
		container:"#treeContainer",
		maxLevel:30,
        maxNode:-1,
        defExpand:false,
        maxChildCount:-1,
        readonly:false,
        sort:true,
        sortAnim:true,
		ecAnim:{
			show:"slideDown",
			hide:"slideUp"
		}
	});
	window.tree=tree;
	tree.built(treedata);
	var n=1;
	$("#treeAddNode").bind("click",function(){
		var currentNode=tree.getSelectedNode();
        tree.sort(currentNode);
		tree.addNode({id:"1001",text:$("#addNodeText").val()+n},currentNode.id,-1);
		n++;
	});
	$("#treeDelNode").bind("click",function(){
		var currentNode=tree.getSelectedNode();
        console.log(tree.delNode(currentNode,false));
	});
	$("#editNodeLoc").bind("click",function(){
		var currentNode=tree.getSelectedNode();
		//var targetNode=tree.getNodeById("FOCUS-treeview-3");
		var targetNode=tree.getNodeByLoc([1,2]);
		tree.editNodeLoc(currentNode,targetNode,"IN");
	});
    $("#getTreeData").bind("click",function(){
        var treedata1=tree.getTreeData(false);
        tree1.built(treedata1);
    });
	tree.onSelect(function(ev,node,treeview){
		console.log("fire onselect:"+node.text);
	},null,this);
//
//	tree.onAdd(function(ev,node,treeview){
//		console.log("fire onadd:"+node.text);
//	},null,this);
//	tree.onExpand(function(ev,node,treeview){
//		console.log("fire onexpand:"+node.text);
//	},null,this);
//	tree.onCollapse(function(ev,node,treeview){
//		console.log("fire oncollapse:"+node.text);
//	},null,this);
//	tree.onAfterDel(function(ev,node,treeview){
//		console.log("fire onafterDel:");
//		console.log(node);
//	},null,this);
//    tree.onMaxNode(function(ev,node,treeview){
//        console.log("fire onmaxNode");
//    },null,this);
//    tree.onDbNodeText(function(ev,node,treeview){
//        console.log("fire ondbclick nodetext");
//    },null,this);
    tree.onInit(function(ev,treeview){
        tree.addNodes(treedata,"");
    },null,this);

    var tree1=new FOCUS.widget.treeView({
        container:"#treeContainer1",
        maxLevel:3,
        maxNode:-1,
        maxChildCount:-1,
        readonly:false,
        ecAnim:{
            show:"slideDown",
            hide:"slideUp"
        }
    });
})();
