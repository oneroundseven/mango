var SubStr = function($){
    var ISubStr = new Abstract({

        subStr: function () {},
		booMatchRule: function() {}

	});


    var config = {
		//截取文本写入的对象
		subTarget:null,
		//截取文本
		strContent:'',
		//截取字符末尾添加符号
		strSuffix:'...',
		//行截取字符数
	    subStrNum:'',
		//是否需要添加换行标记，true为text文本添加/r/n，false为html文本添加<br/>
		whetherText:'',
		//截取行数
		subStrRow:'',
		//匹配html文本的换行符
		newLineRule:/\<br\s*\/\>/g,
		//匹配text文本的换行符
		newLineRuleText:/\/r\/n|\/r|\/n/g,
		//匹配文本中换行处字符是否为数字英文大小写
		subRule:/^[0-9a-zA-Z\u4E00-\u9FA5\(\)*$/]/g,
		//容器宽度
		targetWidth:'',
		//容器高度
		targetHeight:'',

		style:{
			'font-family':'',
			'font-size':'',
			display:'none'
		}

    };


    var SubStr = new Clazz(ISubStr, { config: config, inherit: Component }, function (cfg) {
        cfg = this.setConfig(cfg);

		if(cfg.strContent === '' || cfg.subTarget ===''){
			return;
		}


		var subStrNum;
		var subStrRow;
		if(cfg.subStrNum ===''){
			var fontDiv = document.createElement('span');
			fontDiv.id = "fontDiv";
			$(fontDiv).css(cfg.style);
			document.body.appendChild(fontDiv);
			$(fontDiv).html("L");

			var testWidth = parseInt($(fontDiv).css("width"))- parseInt($(fontDiv).css("padding-left"))-parseInt($(fontDiv).css("padding-right"));
			subStrNum = Math.floor(parseInt(cfg.targetWidth)/testWidth);

			var testHeight = parseInt($(fontDiv).css("line-height"));
			var aa = parseInt(cfg.targetHeight)-parseInt($(fontDiv).css("padding-top"))-parseInt($(fontDiv).css("padding-bottom"));


			subStrRow = Math.floor(aa/testHeight);

			cfg.subTarget.css("width",cfg.targetWidth);
			cfg.subTarget.css("height",cfg.targetHeight);
		}


		var textMark='';
		if(cfg.whetherText){
			textMark = '/r/n';
		}else{
			textMark = '<br/>';
		}

		var that = this;
		this.elems.subTarget = cfg.subTarget;
		this.elems.subStrNum = subStrNum == undefined?cfg.subStrNum:subStrNum;
		this.elems.strSuffix = cfg.strSuffix;
		this.elems.subStrRow = subStrRow == undefined?cfg.subStrRow:subStrRow;
		var subArrOrig = [];
		var subArrComp = [];
		this.elems.strContent = cfg.strContent;
		this.elems.newLineRule = cfg.newLineRule;
		this.elems.newLineRuleText = cfg.newLineRuleText;
		var r = this.elems.newLineRule;
		var s = this.elems.newLineRuleText;
		var sub;
		var start = 0;
		var booleanText = false;


		if(cfg.newLineRule.test(this.elems.strContent)){
			r.exec('');
			while(r.exec(this.elems.strContent)){
				sub = this.elems.strContent.substring(start,r.lastIndex).replace(/<br\s*\/>$/, '').replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, '');
				if(!sub){
					sub = "<br/>";
				}
				subArrOrig.push(sub);
				start = r.lastIndex;
			}
			if(this.elems.strContent.substring(start)){
				subArrOrig.push(this.elems.strContent.substring(start));
			}

				var strCutDown = subArrOrig.join(" ");
				subArrOrig = strCutDown.split("<br/>");

		}else if (cfg.newLineRuleText.test(this.elems.strContent))
		{
		    start = 0;
			s.exec('');
			while(s.exec(this.elems.strContent)){
				sub = this.elems.strContent.substring(start,s.lastIndex).replace(/\/r\/n|\/r|\/n$/, '').replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, '');
				if(!sub){
					sub = "/r/n";
				}
				subArrOrig.push(sub);
				start = s.lastIndex;
			}
			if(this.elems.strContent.substring(start)){
				subArrOrig.push(this.elems.strContent.substring(start));
			}


			var strCutDown = subArrOrig.join(" ");
			subArrOrig = strCutDown.split("/r/n");
		}else{
			subArrOrig = [this.elems.strContent];
		}




		this.elems.subRule = cfg.subRule;

		var confuseWord;
		var brTimes = 0;
		var brConfig = 0;
		var subStrField = " ";


		var subIndex;
		var loopIndex = 0;
		outerloop:
		for(var i=0;i<subArrOrig.length;i++){
			var subStrWord = subArrOrig[i];
				if(subStrWord==" "||!subStrWord){
					subArrComp.push(textMark);
					brTimes++;
				}else{
					while(subStrField.length>this.elems.subStrNum||subStrField == " "){
						subStrWord = subStrField==undefined||subStrField == " "?subArrOrig[i]:subStrField;
						var matchStr = subStrWord.substring(this.elems.subStrNum-1,this.elems.subStrNum);
						var firstStr = subStrWord.substring(0,this.elems.subStrNum);
						var firstIndex = firstStr.lastIndexOf(" ");
						var lastStr = subStrWord.substring(this.elems.subStrNum,subStrWord.length);
						var lastIndex = lastStr.indexOf(" ")+this.elems.subStrNum;
						if(lastIndex != -1){
							confuseWord = subStrWord.substring(firstIndex,lastIndex+1);
						}else{
							confuseWord = subStrWord.substr(firstIndex);
						}

						if(matchStr === " "){
							subArrComp.push(subStrWord.substring(0,this.elems.subStrNum)+textMark);
							subStrField = subStrWord.substring(this.elems.subStrNum,subStrWord.length);
						}else{
							subArrComp.push(subStrWord.substring(0,firstIndex)+textMark);
							subStrField = subStrWord.substring(firstIndex,subStrWord.length);
						}
						if(this.elems.subStrRow && subArrComp.length == this.elems.subStrRow){
							break outerloop;
						}
						loopIndex++;
					}
				}


				if(subStrField!=" "&&subStrField.length<=this.elems.subStrNum){
					subArrComp.push(subStrField.substring(0,subStrField.length)+textMark+textMark);
					subStrField = " ";
					if(!subIndex){
						subIndex = loopIndex+1;
					}

				}
				if(this.elems.subStrRow && subArrComp.length == this.elems.subStrRow){
					break outerloop;

				}
		}

		var sufIndex;
		//数组编号需要去1
		var arrNum = 1;
		if(this.elems.subStrRow>subIndex){
			sufIndex = this.elems.subStrRow-arrNum-1;
		}else{
			sufIndex = this.elems.subStrRow-arrNum;
		}



	    if(this.elems.subStrRow!=''&& sufIndex <= subArrComp.length){
			var spliceStr = subArrComp[sufIndex];
			while(spliceStr == '<br/>'||spliceStr == '/r/n'){
				brConfig++;
				spliceStr = subArrComp[sufIndex-brConfig];
			}
			var t = /\<br\s*\/\>/;
			while(t.test(spliceStr)){
				spliceStr = spliceStr.replace(/<br\s*\/>$/g, '');
			}

			while(s.test(spliceStr)){
				spliceStr = spliceStr.replace(/\/r\/n|\/r|\/n$/g, '');
			}

			while(spliceStr.length+cfg.strSuffix.length>this.elems.subStrNum){
				var firstIndex = spliceStr.lastIndexOf(" ");
				spliceStr =	spliceStr.substring(0,firstIndex);
			}

			spliceStr +=  cfg.strSuffix;

			subArrComp.splice(sufIndex-brConfig,subArrComp.length,spliceStr);
		}


		var str = subArrComp.join("");
		$("#write").html(str);




    });


	return SubStr;
}.call(Lass, jQuery);

