/**
 * @author jerry
 */
(function() {
	var body;
	var init = function(objarr, inFn, outFn, t, clearFn) {
		var _this = this;
		body || (body = $('body'));
		_this.obj = objarr;
		_this.inFnc = inFn;
		_this.outFn = outFn;
		_this.t = t;
		_this.clearFn = clearFn;
		setTimeout(function(){
			_this.init();
		},0);
	};
	$.extend(init.prototype, {
		init: function() {
			var _this = this;
			var sd = [!1, !1];
			var time = 0;
			_this.t = _this.t || 0;
			_this.random = (Math.random() * 100000 | 0).toString(16);

			body.unbind('click.' + _this.random);
		
			_this.obj.bind('click.' + _this.random, function(e) {
				sd[0] = !0;
			});
			body.unbind('click.' + _this.random).bind('click.' + _this.random, function(e) {
				if (time < _this.t) {
					time++;
					return;
				}
				sd[1] = !0;
				if (sd[0] && sd[1]) {
					_this.inFn(e, _this.inFnc);
				} else {
					_this.outFn(e, _this.outFn, _this.clearFn)
				}
				sd = [!1, !1];
			})
		},
		inFn: function(e, fn) {
			if (typeof fn === 'function') {
				fn(e, this.random);
			}
		},
		outFn: function(e, fn, clearfn) {
			if (typeof fn === 'function') {
				fn(e, this.random);
				if (clearfn)
					body.unbind('click.' + this.random);
			}
		},
		unbindEvent: function() {
			body.unbind('click.' + this.random);
		}
	});

	window.inOut = function(a,b,c,d,e){
		return new init(a,b,c,d,e);
	}
})();
