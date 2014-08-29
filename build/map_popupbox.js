/**
 * @author hy
 * @create 2014.8.28
 * map function
 */
(function(root, $, factory) {
	if ( typeof define === 'function' && (define.cmd || define.amd)) {
		define(function() {
			return factory(root, $);
		});
	} else {
		root.Map = factory(root, $);
	}
})(window, $, function(root, $) {
	var isIe6 = (!!window.ActiveXObject && !window.XMLHttpRequest);
	var $win = $(window), $html = $('html'), $body = $('body'), winAttr = {};

	//initlize function
	//coordinate array
	//target 目的地名称
	var Map = function(coordinate,target,starting) {
		this.coordinate = coordinate;
		(!starting)?this.starting = '':this.starting = starting;
		this.target = target;
		this.init();
	};
	$.extend(Map.prototype, {
		init : function() {
			var _self = this;
			_self.getWinWH();
			_self._renderWarp();
			_self.resizeWH();
			_self.mainMap();
		},
		resizeWH : function(){
			var _self = this;
			$win.resize(function(){
				_self.getWinWH();
			});
		},
		getWinWH : function() {
			winAttr['winWidth'] = $win.width();
			winAttr['winHeight'] = $win.height();
		}
	});

	//render warp
	$.extend(Map.prototype, {
		$_warp : '',
		$_main : '',
		$_mapwarp : '',
		$_route : '',
		_renderWarp : function() {
			var html = '<div class="map_layer">\
			<div class="map_bg_layer"></div>\
			<div class="map_main">\
				<div class="map_box">\
					<div class="map_box_left">\
						<span class="mpl_title">交通驾车查询</span>\
						<div class="mpl_bg">\
							<div class="mpl_sel_warp">\
								<ul class="mpl_sel_list clearfix">\
									<li class="it">\
										<a href="javascript:;" class="mpl_sel_btn mpl_active_btn" data-attr="taxi">\
											<span class="map_icon mpl_taxi_icon"></span>\
										</a>\
									</li>\
									<li class="it">\
										<a href="javascript:;" class="mpl_sel_btn" data-attr="bus">\
											<span class="map_icon mpl_bus_icon"></span>\
										</a>\
									</li>\
									<li class="it">\
										<a href="javascript:;" class="mpl_sel_btn" data-attr="walk">\
											<span class="map_icon mpl_people_icon"></span>\
										</a>\
									</li>\
								</ul>\
							</div>\
							<div class="mpl_input_warp">\
								<ul class="mpl_input_list clearfix">\
									<li class="it">\
										<span class="map_icon mpl_start_icon"></span>\
										<input type="text" class="mpl_route_input" placeholder="起点" value="'+this.starting+'" node-type="start" />\
									</li>\
									<li class="it">\
										<span class="map_icon mpl_end_icon"></span>\
										<input type="text" class="mpl_route_input" placeholder="终点" value="'+this.target+'" node-type="end" />\
									</li>\
								</ul>\
							</div>\
							<a href="javascript:;" class="mpl_search_btn">查询路线</a>\
						</div>\
						<div class="mpl_route_detail"></div>\
					</div>\
					<div class="map_box_right">\
						<div class="map_box_warp"></div>\
					</div>\
				</div>\
			</div>\
		</div>'; 
			this._setHidden();
			this.$_warp = $(html);
			this._setPosition();
			$body.append(this.$_warp);
			this.$_main = this.$_warp.find('.map_main');
			this.$_mapwarp = this.$_warp.find('.map_box_warp');
			this.$_route = this.$_warp.find('.mpl_route_detail');
			this._warpControl();
			this._setSize();
			this._resizeFn();
		},
		_setHidden : function() {
			$html.css({
				'overflow' : 'hidden'
			});
		},
		_setVisible: function() {
			$html.css({
				'overflow': 'auto'
			});
		},
		_setPosition : function(){
			if(isIe6){
				var st = $win.scrollTop();
				this.$_warp.css({
					'position' : 'absolute',
					'top' : st,
					'left' : 0
				});
			} else {
				this.$_warp.css({
					'position' : 'fixed',
					'top' : 0,
					'left' : 0
				});
			}
		},
		_resizeFn : function(){
			var _self = this;
			$win.resize(function(){
				_self._setSize();
			});
		},
		_setSize : function(){
			var _self = this;
			_self.$_warp.find('.map_box').css({
				height : (winAttr['winWidth']-100)/2
			});
			_self.$_warp.find('.mpl_route_detail').css({
				height : (winAttr['winWidth']-100)/2-203
			});
			var height = _self.$_main.height();
			_self.$_main.css({
				width : winAttr['winWidth']-100,
				top : (winAttr['winHeight']-height)/2
			});
		},
		_warpControl : function(){
			var _self = this;
			$win.on('keydown',function(e){
				if(e.keyCode == 27){
					_self._warpClose();
				}
			});
			getJs('../src/js/windowInOutEvent.js','inOut',function(inOut){
				var inout = inOut(_self.$_main,'',function(){
					_self._warpClose();
				},0,true);
			});
		},
		_warpClose : function(){
			this._setVisible();
			this.$_warp.remove();
		}
	});
	
	//add map
	$.extend(Map.prototype, {
		$_map : '',
		BMap : '',
		mainMap : function() {
			var _self = this;
			getJs('http://api.map.baidu.com/getscript?v=2.0&ak=3130698f176dbaefabeb924855d7801d&services=&t=20140825185308','BMap',function(bmap){
				_self.BMap = bmap;
				_self.initMap();
				_self.addControl();
				_self.geocoder();
				_self.checkInit();
			});
		},
		//初始化地图	
		initMap : function(){
			var _self = this;
			_self.$_map = new _self.BMap.Map(_self.$_mapwarp[0]);
			_self.$_map.centerAndZoom(new _self.BMap.Point(_self.coordinate[0], _self.coordinate[1]), 11);
		},
		//增加地图控件
		addControl : function(){
			var _self = this;
			_self.$_map.addControl(new _self.BMap.NavigationControl());
			_self.$_map.addControl(new _self.BMap.OverviewMapControl());
			_self.$_map.addControl(new _self.BMap.MapTypeControl());
			_self.$_map.enableScrollWheelZoom();  
		},
		//地址解析
		geocoder : function(){
			var _self = this;
			var myGeo = new _self.BMap.Geocoder();
			var marker;
			myGeo.getPoint(_self.target,function(point){
				if(point){
					marker = new _self.BMap.Marker(point);
					_self.$_map.centerAndZoom(point,16);
					_self.$_map.addOverlay(marker);
					// marker.setAnimation(BMAP_ANIMATION_BOUNCE);
				}
			},new _self.BMap.Point(_self.coordinate[0], _self.coordinate[1]));
		}
	});
	
	//查询路线功能
	$.extend(Map.prototype, {
		$_type : 'taxi',
		checkInit : function() {
			this.switchCheck();
			this.checkTaxi();
			this.checkBus();
			this.checkWalk();
			this.submitCheck();
			if(this.starting){
				this.checkRoute();
			}
		},
		switchCheck : function() {
			var _self = this;
			var _btn = _self.$_warp.find('.mpl_sel_btn');
			_btn.bind('click', function() {
				_btn.removeClass('mpl_active_btn');
				$(this).addClass('mpl_active_btn');
				_self.$_type = $(this).attr('data-attr');
				_self.checkRoute();
			});
		},
		submitCheck : function() {
			var _self = this;
			_self.$_warp.find('.mpl_search_btn').bind('click', function() {
				_self.checkRoute();
			});
		},
		checkRoute : function() {
			var _self = this;
			var startObj = _self.$_warp.find('input[node-type="start"]');
			var endObj = _self.$_warp.find('input[node-type="end"]');
			var start = startObj.val();
			var end = endObj.val();
			if(!start){
				startObj.focus().css({
					'border': '1px solid #cc3300'
				});
			} else {
				startObj.blur().css({
					'border': '1px solid #b2b2b2'
				});
			}
			if(!end){
				endObj.focus().css({
					'border': '1px solid #cc3300'
				});
			} else {
				endObj.blur().css({
					'border': '1px solid #b2b2b2'
				});
			}
			switch(_self.$_type) {
				case 'taxi' :
					_self.$_taxi.search(start, end);
					break;
				case 'bus' :
					_self.$_bus.search(start, end);
					break;
				case 'walk' :
					_self.$_walk.search(start, end);
					break;
			}
		}
	}); 

	
	//分类查询
	$.extend(Map.prototype, {
		$_taxi : '',
		$_bus : '',
		$_walk : '',
		checkTaxi : function() {
			var _self = this;
			_self.$_taxi = new _self.BMap.DrivingRoute(_self.$_map, {
				renderOptions : {
					map : _self.$_map,
					panel : _self.$_route[0]
				}
			});
		},
		checkBus : function() {
			var _self = this;
			_self.$_bus = new _self.BMap.TransitRoute(_self.$_map, {
				renderOptions : {
					map : _self.$_map,
					panel : _self.$_route[0]
				}
			});
		},
		checkWalk : function() {
			var _self = this;
			_self.$_walk = new _self.BMap.WalkingRoute(_self.$_map, {
				renderOptions : {
					map : _self.$_map,
					panel : _self.$_route[0]
				}
			});
		}
	});

	//include javascript files
	var getJs = function(url, method, fn) {
		if (root[method]){
			fn && fn(root[method]);
		} else {
			$.getScript(url,function(){
				fn && fn(root[method]);
			})
		}
	}; 

	return function(coordinate,target,starting){
		new Map(coordinate,target,starting);
	};
});

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
