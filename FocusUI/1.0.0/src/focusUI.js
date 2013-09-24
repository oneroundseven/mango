/**
 * 《focusUI组件》
 * 功能介绍：界面ui处理：遮罩、定位、拖拽等等
 * 焦点科技界面ui
 * @author xingshikang
 * 版权归焦点科技所有
 */
if (!!window.jQuery) {
	(function($) {
		var focusUI = {
			config:{
				cover_baseFloatZIndex:100,
				cover_overlay:true
			},
			setConfig: function(config) {
				focusUI.config = $.extend(true,focusUI.config,config || {});
			}			
		}
		//focusUI工具类
		focusUI.tools = (function() {
			var tools = {
				env: (function() {
					var agent = navigator.userAgent.toLowerCase();
					var ie=/*@cc_on!@*/false;
					var env = {
						ie: ie,
						ie6: (function() {
							if (ie) {
								return (parseFloat(agent.match(/msie (\d+)/)[1]) < 7 || document.compatMode == 'BackCompat');
							}
							return false;
						})(),
						mac: (agent.indexOf('macintosh') > -1),
						webkit: (agent.indexOf(' applewebkit/') > -1),
						isCustomDomain: function() {
							if (!this.ie) 
								return false;
							var domain = document.domain, hostname = window.location.hostname;
							return domain != hostname &&
							domain != ('[' + hostname + ']'); // IPv6 IP support (#5434)
						}
					}
					return env;
				})(),
				genKey: function() {
					return Array.prototype.slice.call(arguments).join('-');
				},
				setOpacity: function(element, opacity) {
					if (this.env.ie) {
						opacity = Math.round(opacity * 100);
						$(element).css('filter', opacity >= 100 ? '' : 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + opacity + ')');
					}
					else 
						$(element).css('opacity', opacity);
				},
				getViewPaneSize: function() {
					var stdMode = document.compatMode == 'CSS1Compat';
					return {
						width: (stdMode ? document.documentElement.clientWidth : document.body.clientWidth) || 0,
						height: (stdMode ? document.documentElement.clientHeight : document.body.clientHeight) || 0
					};
				},
				getScrollPosition: function() {
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
				},
				getSize: function(element) {
					return {
						width: element.offsetWidth || 0,
						height: element.offsetHeight || 0
					};
				}
			}
			return tools;
		})();
		//focusUI 遮罩
		focusUI.cover = (function() {
			var covers = {},coversQueue=[], currentCover, resizeCover,currentZIndex=null,_inner={};
			function showCover(coverElement) {
				var options=_inner.options;
				var win = $(window);
				if (!coverElement) {
					var html = ['<div tabIndex="-1" style="position: ', (focusUI.tools.env.ie6 ? 'absolute' : 'fixed'), '; z-index: ', currentZIndex + 1, '; top: 0px; left: 0px; ', (!focusUI.tools.env.ie6 ? 'background-color: ' + options.bgColor : ''), '" style="display:none" class="',options.coverClass,'">'];
					if (focusUI.tools.env.ie6) {
						if (focusUI.bgIframe) {
							html.push(focusUI.bgIframe.html(options.bgColor));
						}
					}
					html.push('</div>');
					
					coverElement = $(html.join(''));
					focusUI.tools.setOpacity(coverElement, options.bgOpacity != undefined ? options.bgOpacity : 0.5);
					coverElement.bind('keydown', function() {	return false});
					coverElement.bind('keypress', function() {return false});
					coverElement.bind('keyup', function() {return false});
					
					$("body").append(coverElement);
					coverElement.data("options",options);
					typeof(coverElement[options.showAnim]) == "function" ? coverElement[options.showAnim]() : coverElement.show();
										
					covers[_inner.coverKey] = coverElement;
					covers[_inner.coverKey].used = false;
				}
				else {
					typeof(coverElement[coverElement.data("options").showAnim]) == "function" ? coverElement[coverElement.data("options").showAnim]() : coverElement.show();
				}				
				currentCover = coverElement;
				
				var rangeId=coverElement.data("options").rangeId;
				var resizeFunc = function() {
					var size =focusUI.tools.getViewPaneSize();
					if (rangeId && $("#" + rangeId).length > 0 && $("#" + rangeId).attr("id") == rangeId) {
						size = focusUI.tools.getSize($("#" + rangeId).get(0));
						var pos = {
							x: $("#" + rangeId).offset().left,
							y: $("#" + rangeId).offset().top
						}
						coverElement.css("position", "absolute");
						coverElement.css({
							left: pos.x + 'px',
							top: pos.y + 'px'
						});
					}			
					coverElement.css({
						width: size.width + 'px',
						height: size.height + 'px'
					});					
				};
				var scrollFunc = function() {					
					var pos = focusUI.tools.getScrollPosition();
					if(rangeId&&$("#"+rangeId).length>0&&$("#"+rangeId).attr("id")==rangeId){
						pos= {
							x: $("#"+rangeId).offset().left,
							y: $("#"+rangeId).offset().top
						}
					}
					coverElement.css({
						left: pos.x + 'px',
						top: pos.y + 'px'
					});					
				};
				
				resizeCover = resizeFunc;
				win.bind('resize', resizeFunc);
				resizeFunc();
				//Safari/Mac, focus
				if (!(focusUI.tools.env.mac && focusUI.tools.env.webkit)) 
					coverElement.focus();
				
				if (focusUI.tools.env.ie6) {
					// IE BUG: window.onscroll.					
					var myScrollHandler = function() {
						scrollFunc();
						arguments.callee.prevScrollHandler.apply(this, arguments);
					};
					win.get(0).setTimeout(function() {
						myScrollHandler.prevScrollHandler = window.onscroll ||function() {};
						window.onscroll = myScrollHandler;
					}, 0);
					scrollFunc();
				}
			}
			function hideCover(coverElement) {
				var currentCover=coverElement?coverElement:currentCover;
				if (!currentCover) 
					return;
				var win = $(window);
				currentCover.hide();
				win.unbind('resize', resizeCover);				
				if (focusUI.tools.env.ie6) {
					win.get(0).setTimeout(function() {
						var prevScrollHandler = window.onscroll && window.onscroll.prevScrollHandler;
						window.onscroll = prevScrollHandler || null;
					}, 0);
				}
				resizeCover = null;
			}
			function removeCovers() {
				for (var coverId in covers) 
					covers[coverId].remove();
				covers = {};
			}
			var cover= {
				show: function(config) {
					if (focusUI.tools.env.ie6){
						focusUI.setConfig({cover_overlay:false});
					}
					_inner.options = $.extend(true, {
						rangeId:"",
						bgColor: 'white',
						bgOpacity: 0.4,
						baseFloatZIndex: focusUI.config.cover_baseFloatZIndex,
						showAnim:"fadeIn",
						dialog:null,
						overlay: focusUI.config.cover_overlay,
						coverClass:""
					}, config||{});	
					_inner.coverKey = focusUI.tools.genKey(_inner.options.bgColor, _inner.options.bgOpacity, _inner.options.baseFloatZIndex,_inner.options.rangeId);
					var coverElement = covers[_inner.coverKey];			
						
					if (currentZIndex === null||coversQueue.length==0) 
						currentZIndex = focusUI.config.cover_baseFloatZIndex;					
					
					if (!_inner.options.overlay) {
						var pre = coversQueue.length > 0 ? coversQueue[coversQueue.length - 1] : null;
						if (pre && pre.base&&pre.key!=_inner.coverKey) {
							hideCover(covers[pre.key]);
						}
					}
					showCover(coverElement);					
					if (!covers[_inner.coverKey].used) {
						covers[_inner.coverKey].used = true;
						coversQueue.push({key: _inner.coverKey,base: true});
					}
					else{
						coverElement.css('z-index', currentZIndex+1);
						coversQueue.push({key: _inner.coverKey});
					}
					$(_inner.options.dialog).css('z-index', currentZIndex += 10);							
				},
				hide:function(){
					if(coversQueue.length==0){
						return;
					}		
					var current=coversQueue[coversQueue.length-1];		
					var pre=coversQueue.length>1?coversQueue[coversQueue.length-2]:null;	
					if (!(pre && current.key == pre.key)) {
						hideCover(currentCover);					
					}
					currentZIndex -= 10;
					if (pre) {
						showCover(covers[pre.key]);
						covers[pre.key].css('z-index', currentZIndex-9);			
					}
					if (current.base) {
						covers[current.key].used = false;
					}						
					coversQueue.pop();
				},				
				remove: function() {
					removeCovers();
					coversQueue=[];
					currentZIndex=null;
				},
				getCover:function(){
					return currentCover;
				}
			}
			return cover;
		})();
		//focusUI 拖拽
		focusUI.drag=(function() {
			var drag = function(config) {
				var _this = this;
				var options = _this._ = $.extend(true, {
					dialog: null,
					title: null,
					margins: null,
					magnetDistance: null,
					rtl: false
				}, config || {});
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
				
				function move(x, y, save) {
					var isFixed = $(dialog).css('position') == 'fixed', 
					marginTop = $(dialog).css('marginTop'), 
					marginLeft = $(dialog).css('marginLeft');
					if (isFixed && _this._.position && _this._.position.x == x && _this._.position.y == y) {
					//return;
					}
					_this._.position = {
						x: x,
						y: y
					};
					if (parseFloat(marginTop) != 0 && marginTop != "auto") {
						y -= parseFloat(marginTop);
					}
					if (parseFloat(marginLeft) != 0 && marginLeft != "auto") 
						x -= parseFloat(marginLeft);
					if (!isFixed) {
						var scrollPosition = focusUI.tools.getScrollPosition();
						x += scrollPosition.x;
						y += scrollPosition.y;
					}
					if (options.rtl) {
						var dialogSize = focusUI.tools.getSize($(dialog).get(0)), 
						viewPaneSize = focusUI.tools.getViewPaneSize();
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
					var dialogSize = focusUI.tools.getSize($(dialog).get(0)), 
					viewPaneSize = focusUI.tools.getViewPaneSize(), x = evt.screenX, y = evt.screenY, dx = x - lastCoords.x, dy = y - lastCoords.y, realX, realY;
					lastCoords = {
						x: x,
						y: y
					};
					abstractDialogCoords.x += dx;
					abstractDialogCoords.y += dy;
					if (abstractDialogCoords.x + margins[3] < magnetDistance) 
						realX = -margins[3];
					else if (abstractDialogCoords.x - margins[1] > viewPaneSize.width - dialogSize.width - magnetDistance) 
						realX = viewPaneSize.width - dialogSize.width + (!options.rtl ? 0 : margins[1]);
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
					if (focusUI.tools.env.ie6) {
						if (focusUI.cover&&focusUI.cover.getCover().find(".bgiframe:visible").length != 0) {
							var coverDoc = focusUI.cover.getCover().find(".bgiframe:visible").get(0).contentWindow.document;
							$(coverDoc).unbind('mousemove', mouseMoveHandler);
							$(coverDoc).unbind('mouseup', mouseUpHandler);
						}					
					}
				}
				
				$(title).bind('mousedown', function(evt) {
					layout();
					lastCoords = {
						x: evt.screenX,
						y: evt.screenY
					};
					$(document).bind('mousemove', mouseMoveHandler);
					$(document).bind('mouseup', mouseUpHandler);
					abstractDialogCoords = _this._.position || {};
					
					if (focusUI.tools.env.ie6) {
						if (focusUI.cover&&focusUI.cover.getCover().find(".bgiframe:visible").length != 0) {
							var coverDoc = focusUI.cover.getCover().find(".bgiframe:visible").get(0).contentWindow.document;
							$(coverDoc).bind('mousemove', mouseMoveHandler);
							$(coverDoc).bind('mouseup', mouseUpHandler);
						}
					}
					evt.preventDefault();
				});
				
				$(title).bind("mouseover",function(){
					$(this).css("cursor","move");
				});
				
				$(title).bind("mouseout",function(){
					$(this).css("cursor","default");
				});
				
				function layout() {
					var scrollPos=focusUI.tools.getScrollPosition();
					_this._.position = {
						x: $(dialog).offset().left-scrollPos.x,
						y: $(dialog).offset().top-scrollPos.y
					}
					//move( _this._.moved ? _this._.position.x : ( viewSize.width - dialogSize.width ) / 2,_this._.moved ? _this._.position.y : ( viewSize.height - dialogSize.height ) / 2 );
				}
				layout();
			};
			return drag;
		})();
		//focusUI ie6 select div->iframe
		focusUI.bgIframe = (function() {
			var html = function(bgColor) {
				if (!focusUI.tools.env.ie6) {
					return "";
				}
				var html = [], iframeHtml = '<html><body style=\\\'background-color:' + bgColor + ';\\\'></body></html>';
				html.push('<iframe' +
				' class="bgiframe"' +
				' hidefocus="true"' +
				' frameborder="0"' +
				' tabindex="-1"' +
				' style="z-index:-1"' +		
				' src="javascript:');
				
				html.push('void((function(){' +
				'document.open();' +
				'document.write( \'' +
				iframeHtml +
				'\' );' +
				'document.close();' +
				'})())');
				
				html.push('"' +
				' style="' +
				'position:absolute;' +
				'left:0;' +
				'top:0;' +
				'width:100%;' +
				'height: 100%;' +
				'progid:DXImageTransform.Microsoft.Alpha(opacity=100)">' +
				'</iframe>');
				return html.join('');
			}
			var bgIframe = function(config) {		
				var options = $.extend(true, {
					dialog: null,
					bgColor: "white"
				}, config||{});
				if (!focusUI.tools.env.ie6 || options.dialog == null || $(options.dialog).length === 0) {
					return;
				}
				if ($(options.dialog).children('iframe.bgiframe').length === 0) 
					$(options.dialog).prepend(html(options.bgColor));						
			}
			bgIframe.html=html;
			return bgIframe;
		})();
		//focusUI 居中
		focusUI.center=(function(){
			var center = function(config) {
				var dialog=config.dialog;
				if($(dialog).length==0){
					return;
				}
				delete config.dialog;
				var style = $.extend(true, {
					dialog: null,
					position: 'absolute',
					top: '50%',
					left: '50%',
					//zIndex: 10001,
					marginTop: 0,
					relative: true
				}, config || {});
				var $this = $(dialog);
				if (style.top == '50%') 
					style.marginTop = -$this.outerHeight() / 2;
				if (style.left == '50%') 
					style.marginLeft = -$this.outerWidth() / 2;
				if (style.relative && !$this.parent().is('body') && $this.parent().css('position') == 'static') 
					$this.parent().css('position', 'relative');
				delete style.relative;
				if (style.position == 'fixed' && focusUI.tools.env.ie6) {
					style.marginTop += $(window).scrollTop();
					style.position = 'absolute';
					$(window).scroll(function() {
						$this.stop().animate({
							marginTop: $(window).scrollTop() - $this.outerHeight() / 2
						});
					});
				}
				$this.css(style);
			}	
			return center;		
		})();
		//focusUI 统一调用
		$.fn.focusUI=(function(){			
			var UIload=function(config){
				var dialog=this;
				var title=this.find("h2:first");
				if($(dialog).length==0){
					return;
				}
				var options = $.extend(true, {
					cover: false,
					drag: false,
					center: false,
					bgIframe:true,
					title:null
				}, config || {});	
				if(options.title&&$(options.title).length>0){
					title=$(options.title);
				}		
				if(options.cover){
					FocusUI.cover.show({dialog:dialog});
				}			
				if (options.bgIframe) {
					if (!options.cover) {
						FocusUI.bgIframe({
							dialog: dialog
						});
					}
				}				
				if(options.center){
					FocusUI.center({dialog:dialog,position:"fixed"});
				}	
				if(options.drag){
					FocusUI.drag({
						dialog:dialog,
						title:title
					});
				}		
			}
			return UIload;
		})();
		window.FocusUI = focusUI;
	})(jQuery);
}