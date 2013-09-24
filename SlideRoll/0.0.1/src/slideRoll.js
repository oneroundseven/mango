
var SlideRoll = function($){

    var Islide = new Abstract({
        /**
         * 列表向下滚动
         */
        msgMoveDown : function() {},
        /**
         * 列表向上滚动
         */
        msgMoveUp:function(){}
    });

    var Slide = new Clazz(Islide, function(cfg) {
        this.msgMoveDown.implement(_msgMoveDown);
        this.msgMoveUp.implement(_msgMoveUp);
    });

    function _msgMoveDown(){
        var height = $(this.config.carrier.space).find(this.config.carrier.content+":first").height();
        //列表最后的li高度设置为0
        $(this.config.carrier.space).find(this.config.carrier.content+":last").css({"height":0});
        //把列表最后的li提升到顶部，实现有限列表项无限循环滚动显示
        $(this.config.carrier.space).find(this.config.carrier.content+":first").before( $(this.config.carrier.space).find(this.config.carrier.content+":last"));
        //列表顶部的li高度逐渐变高以把下面的li推下去
        $(this.config.carrier.space).find(this.config.carrier.content+":first").animate({"height":height},this.config.speed);
    }

    function _msgMoveUp(){
        var that = this;
        //列表最前的li高度设置为0
        var height = $(this.config.carrier.space).find(this.config.carrier.content+":first").height();
        $(this.config.carrier.space).animate({"top":-height},this.config.speed,function(){
            //把列表最前的li降到底部，实现有限列表项无限循环滚动显示
            $(that.config.carrier.space).find(that.config.carrier.content+":last").after( $(that.config.carrier.space).find(that.config.carrier.content+":first"));
            $(that.config.carrier.space).css({"top":0});
        });
    }


    var ISlideRoll = new Abstract({
        /**
         * 开始滚动
         */
        start: function () {},
        /**
         * 停止滚动
         */
        stop: function () {},
        /**
         * 滚动
         */
        roll:function(){},
        /**
         * 获取更多滚动列表数据
         */
        getMoreRollData:function(){},
        onChange:function(motion){}
    });

    var config = {
        speed: 1000, //切换的速度 ms
        interval: 5000,//自动滚动的间隔时间 ms
        minsize:5,//最小滚动条数，低于最小条数无滚动效果
        carrier:{
            space:null,
            content:null
        }, // 列表型的信息容器
        animationType:"up",//up,down,left,right
        hoverStop:true//鼠标移上去是否停止滚动
    };
    var autoPlayTimer;
    var SlideRoll = new Clazz(ISlideRoll, { config: config, inherit: Component }, function (cfg) {
        this.setConfig(cfg);
        var that = this;
        if (this.config.carrier.space === null || !this.config.carrier.space.length) {
            return;
        }

        if(this.config.hoverStop){
            $(this.config.carrier.space).hover(function () {
                _stop.call(that);
            },function(){
                _start.call(that);
            });
        }

        this.start.implement(_start);
        this.stop.implement(_stop);
        this.roll.implement(_roll);
        this.onChange.implement(_onChange);
        this.start();
    });

    function _start(){
        this.stop();
        var that = this;
        if($(this.config.carrier.space).find(this.config.carrier.content).size()>this.config.minsize){
            autoPlayTimer=setInterval(function () {
                that.roll();
            },this.config.interval);
        }
    }

    function _stop(){
        if (autoPlayTimer) {
            clearTimeout(autoPlayTimer);
        }
    }

    function _roll(){
        if(this.config.animationType=="up"){
            this.msgMoveUp();
        }else if(this.config.animationType=="down"){
            this.msgMoveDown();
        }else{
        	return;
        }

    }

    function _onChange(motion){
        if(motion!=this.config.animationType){
            this.config.animationType=motion;
        }
    }

    SlideRoll.extend(new Slide());

    return SlideRoll;

}.call(Lass, jQuery);