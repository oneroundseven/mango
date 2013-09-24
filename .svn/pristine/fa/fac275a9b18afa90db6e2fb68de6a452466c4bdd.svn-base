var GoTop = function($){
    var IGoTop = new Abstract({
	//点击goTop图标事件
        toHead: function () {},
    //鼠标悬停goTop图标事件
		hoverOn: function() {},
    //鼠标离开goTop图标事件
		hoverOff: function() {}
    });

    var config = {

        /**
         * drop fire Event support ['mouseover', 'click']
         * @default mouseover
         * @type String
         */
        trigger: '',
		scollHeight:500,
		fadeTime:300,
        style: {
			display:'block',
            zoom:'1',
            width:'60px',
			height:'60px',
			position:'fixed',
			'background-image':'url(../example/images/gotop.png)',
			'background-position': '0 -60px',
			'background-repeat':'no-repeat',
			outline:'none',
			cursor:'pointer',
			right:'50px',
			bottom:'50px'
        }
    };


    var GoTop = new Clazz(IGoTop, { config: config, inherit: Component }, function (cfg) {
        cfg = this.setConfig(cfg);

        var _newHref = document.createElement("a");
		_newHref.href = "#top";
		_newHref.id = "back-to-top";

		$(_newHref).css(cfg.style);
		document.body.appendChild(_newHref);


        var that = this;
        var _trigger = this.trigger || 'mouseover';



		$("#back-to-top").hide();
		var isIE6 = !-[1,] && !window.XMLHttpRequest;


		$(window).bind('scroll', function() {
		   _scrollTop = parseInt(document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop);
		   if (_scrollTop === 0) return;
		   if(_scrollTop>cfg.scollHeight){
				_hoverOn.call(that);

		   }else{
				_hoverOff.call(that);
			}
	   })
//		var _scrollTop = parseInt(document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop);

		if (isIE6) {
			$("#back-to-top").css({
				'position': 'absolute',
				'right': '50px'
			});
        }


        function _toHead(){
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            $('body,html').animate({scrollTop:0},400);
			$("#back-to-top").hide();
        }

		function _hoverOn() {
            $("#back-to-top").fadeIn(cfg.fadeTime);
        }

		function _hoverOff() {
            $("#back-to-top").fadeOut(cfg.fadeTime);
        }



        $("#back-to-top").bind(_trigger, function () {
            $(this).css('background-position', '0 0');
        });

        $("#back-to-top").bind('click', function () {
            _toHead.call(that);
        });

	    $("#back-to-top").bind('mouseleave', function () {
            $(this).css('background-position', '0 -60px');
        });


        this.toHead.implement(_toHead);
		this.hoverOn.implement(_hoverOn);
		this.hoverOff.implement(_hoverOff);

    });

	//export
	return GoTop;
}.call(Lass, jQuery);

