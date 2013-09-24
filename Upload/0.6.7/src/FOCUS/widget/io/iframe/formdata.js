;void function(window, document, undefined){
	var io = FOCUS.namespace('FOCUS.widget.io.iframe');
	var noop = function(){};
	
	//elems generator
	var createElem = FOCUS.util.createElement;

	//formdata
	var IO_FormData = function(/*url*/){
		this.elems = {};
		//this.elems.__submit_form = this._.form(url);
	};
	IO_FormData.prototype = {
		_: {
			/*form: function(url){
				return createElem({
					el: 'form',
					name: 'FOCUS_UPLOAD_FORM_' + FOCUS.util.random(0, 1000),
					method: 'POST',
					enctype: 'multipart/form-data',
					action: url || ''
				});
			},*/
			text: function(name, txt){
				return createElem({
					el: 'textarea',
					name: name,
					value: txt + ''
				});
			},
			radio: function(name, value, checked){
				return createElem({
					el: 'input',
					type: 'radio',
					name: name,
					value: value,
					checked: !!checked
				});
			},
			checkbox: function(name, value, checked){
				return createElem({
					el: 'input',
					type: 'checkbox',
					name: name,
					value: value,
					checked: !!checked
				});
			},
			file: function(inputFileElem, cfg){
				if(inputFileElem){
					var file = inputFileElem;//.cloneNode(true);
					cfg && cfg.name && (file.name = cfg.name);
					return file
				}else{
					var _cfg = {
						el: 'input',
						type: 'file'
					};
					
					FOCUS.util.extend(true, _cfg, cfg);

					return createElem(_cfg);
				}
			},
			clone: function(elem){
				return elem.cloneNode(true);
			}
		},
		append: function(name, value){
			var type = FOCUS.util.type(value);
			var elem;
			
			if(type !== 'string' && value.type === 'file'){
				elem = this._.file(value, { name: name });
			}else if(type === 'string'){
				elem = this._.text(name, value + '');
			}
			
			this.elems[name] = elem;
			//this.elems.__submit_form.appendChild(elem); //in ie6, here will leak the memory
		}
	};
	
	//
	io.IO_FormData = IO_FormData;
}.call(this, window, document);