/**
* support start & done event
*/
;void function(){
	var plugins = FOCUS.namespace('FOCUS.widget.Upload.plugins');
	
	plugins.eventsplus = function(mode){
		var uploaded = 0;
		var all = 0;
		
		this.on('dialogComplete', function(selected, queued, total){
			all = total;
		});
		
		this.on('uploadStart', function(){
			if(uploaded === 0){
				this.fire('start', all);
			}
		});
		
		this.on('uploadComplete', function(){
			if(++uploaded === all){
				this.fire('done', all);
				uploaded = all = 0;
			}
		});
	};
}.call(this);