/**
 * @author jerry
 */
(function() {
	var body;
	var init = function(objarr, inFn, outFn, t, clearFn) {
		var obj,__=this;
		body||(body = $('body'));
		var sd = [!1, !1];
		var time = 0;
		t = t || 0;
		__.random = (Math.random() * 100000 | 0).toString(16);

		body.unbind('click.' + __.random);
		obj = objarr;
		obj.bind('click.' + __.random, function(e) {
			sd[0] = !0;
		});
		body.unbind('click.' + __.random).bind('click.' + __.random, function(e) {
			if (time < t) {
				time++;
				return;
			}
			sd[1] = !0;
			if (sd[0] && sd[1]) {
				__.inFn(e,inFn);
			} else {
				__.outFn(e,outFn,clearFn)
			}
			sd = [!1, !1];
		})
	};
	$.extend(init.prototype,{
		inFn:function(e,fn){
			if ( typeof fn === 'function') {
				fn(e,this.random);
			}
		},
		outFn:function(e,fn,clearfn){
			if ( typeof fn === 'function') {
				fn(e,this.random);
				if (clearfn)
					body.unbind('click.' + this.random);
			}
		},
		unbindEvent:function(){
			body.unbind('click.' + this.random);
		}
	});

	window.inOut = function(a,b,c,d,e){
		return new init(a,b,c,d,e);
	}
})();
