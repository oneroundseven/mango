/**
 *  拖拽
 * @author：xingshikang
 * @v1.0.0  2011-11-08
 */
function initDragAndDrop(options) {
	var _this = this;
	this._ = {
		dialog: null,
		title: null,
		margins: null,
		magnetDistance: null,
		rtl:false
	}
	options = $.extend(true, this._, options);
	if (!(options.dialog && options.title)) {
		return;
	}
	var dialog = options.dialog, 
	title = options.title, 
	lastCoords = null, 
	abstractDialogCoords = null,
	magnetDistance = options.magnetDistance, 
	margins = options.margins || [0, 0, 0, 0];
	
	if (magnetDistance === null) 
		magnetDistance = 20;
		
	function ie6() {
		var agent = navigator.userAgent.toLowerCase(), ie =/*@cc_on!@*/ false;
		if (ie) {
			return (parseFloat(agent.match(/msie (\d+)/)[1]) < 7 || document.compatMode == 'BackCompat');
		}
		return false;
	}
	
	function getSize() {
		var element = $(dialog).get(0);
		return {
			width: element.offsetWidth || 0,
			height: element.offsetHeight || 0
		};
	}
	
	function getViewPaneSize() {
		var stdMode = document.compatMode == 'CSS1Compat';
		return {
			width: (stdMode ? document.documentElement.clientWidth : document.body.clientWidth) || 0,
			height: (stdMode ? document.documentElement.clientHeight : document.body.clientHeight) || 0
		};
	}
	
	function getScrollPosition() {
		var $ = window;
		
		if ('pageXOffset' in $) {
			return {
				x: $.pageXOffset || 0,
				y: $.pageYOffset || 0
			};
		}
		else {
			var doc = $.document;
			return {
				x: doc.documentElement.scrollLeft || doc.body.scrollLeft || 0,
				y: doc.documentElement.scrollTop || doc.body.scrollTop || 0
			};
		}
	}	
	
	function move(x, y, save) {
		var isFixed= $(dialog).css('position') == 'fixed',
		marginTop=$(dialog).css('marginTop'),
		marginLeft=$(dialog).css('marginLeft');
		if (isFixed && _this._.position && _this._.position.x == x && _this._.position.y == y) {			
			//return;
		}
		_this._.position = {
			x: x,
			y: y
		};
		if (parseFloat(marginTop) != 0&&marginTop!="auto") {
			y -= parseFloat(marginTop);			
		}
		if(parseFloat(marginLeft)!=0&&marginLeft!="auto")
			x-=parseFloat(marginLeft);
		if (!isFixed) {
			var scrollPosition = getScrollPosition();
			x += scrollPosition.x;
			y += scrollPosition.y;			
		}
		if (options.rtl) {
			var dialogSize = getSize(), viewPaneSize = getViewPaneSize();
			x = viewPaneSize.width - dialogSize.width - x;
		}
		
		var styles = {
			'top': (y > 0 ? y : 0) + 'px'
		};
		styles[options.rtl ? 'right' : 'left'] = (x > 0 ? x : 0) + 'px';
		$(dialog).css(styles);
		save && (_this._.moved = 1);
	}
	
	function mouseMoveHandler(evt) {
		var dialogSize = getSize(), viewPaneSize = getViewPaneSize(), x = evt.screenX, y = evt.screenY, dx = x - lastCoords.x, dy = y - lastCoords.y, realX, realY;
		lastCoords = {
			x: x,
			y: y
		};
		abstractDialogCoords.x += dx;
		abstractDialogCoords.y += dy;
		if (abstractDialogCoords.x + margins[3] < magnetDistance) 
			realX = -margins[3];
		else if (abstractDialogCoords.x - margins[1] > viewPaneSize.width - dialogSize.width - magnetDistance) 
			realX = viewPaneSize.width - dialogSize.width + (!options.rtl? 0 : margins[1]);
		else 
			realX = abstractDialogCoords.x;
		if (abstractDialogCoords.y + margins[0] < magnetDistance) 
			realY = -margins[0];
		else if (abstractDialogCoords.y - margins[2] > viewPaneSize.height - dialogSize.height - magnetDistance) 
			realY = viewPaneSize.height - dialogSize.height + margins[2];
		else 
			realY = abstractDialogCoords.y;
		move(realX, realY, 1);
		evt.preventDefault();
	}
	
	function mouseUpHandler(evt) {
		$(document).unbind('mousemove', mouseMoveHandler);
		$(document).unbind('mouseup', mouseUpHandler);		
		if (ie6) {
			var coverDoc =$(".bgiframe").get(0).contentWindow.document;
			$(coverDoc).unbind('mousemove', mouseMoveHandler);
			$(coverDoc).unbind('mouseup', mouseUpHandler);
		}
	}
	
	$(title).bind('mousedown', function(evt) {
		lastCoords = {
			x: evt.screenX,
			y: evt.screenY
		};		
		$(document).bind('mousemove', mouseMoveHandler);
		$(document).bind('mouseup', mouseUpHandler);
		abstractDialogCoords = _this._.position || {};
		
		if (ie6) {
			var coverDoc =$(".bgiframe").get(0).contentWindow.document;
			$(coverDoc).bind('mousemove', mouseMoveHandler);
			$(coverDoc).bind('mouseup', mouseUpHandler);
		}		
		evt.preventDefault();
	});
	function layout() {
		_this._.position={
			x:$(dialog).offset().left,
			y:$(dialog).offset().top
		}
		var viewSize = getViewPaneSize(), dialogSize = getSize();
		//move(this._.moved ? this._.position.x : (viewSize.width - dialogSize.width) / 2, this._.moved ? this._.position.y : (viewSize.height - dialogSize.height) / 2);
	}
	layout();
}