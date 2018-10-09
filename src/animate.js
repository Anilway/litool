/*
	animate：简易动画库
		@parameter：
			options：参数对象
				ele：要执行动画的元素
				target：目标值（对象，可设置多个目标）
				duration：动画时间（默认为1000ms）
				callBack：回调函数，动画完成后执行（选填）
				effect：运动效果（默认为线性运动）

*/
var animate=(function(){
	// 这里的运动轨迹只提供了一种，可以扩展多种运动轨迹
	/*
		t：使用的时间time
		b：起始位置begin
		c：总长度change=目标位置-起始位置
		d：总时间duration
	*/
	function linear(t,b,c,d){
		return t/d*c+b;
	}

	function animate(options){
		// 初始化参数(在ES6中可以使用解构赋值，考虑到兼容性，这里不使用解构赋值)
		var _default={
			ele:null,
			target:{},
			duration:1000,
			callBack:null,
			effect:linear
		}

		for(var key in options){
			if(options.hasOwnProperty(key)){
				_default[key]=options[key];
			}
		}

		var ele=_default.ele,
			target=_default.target,
			duration=_default.duration,
			callBack=_default.callBack,
			effect=_default.effect;


		var t=0,
			d=duration||1000,
			b={},
			c={};

		for(var key in target){
			if(target.hasOwnProperty(key)){
				b[key]=css(ele,key);
				c[key]=target[key]-b[key];
			}
		}
		//在设置新动画之前，先把之前正在运行的动画清除掉，防止当前元素相同的动画共存
		clearInterval(ele.animateTimer);
		ele.animateTimer=setInterval(function(){
			var cur={};
			t+=17;
			if(t>=d){
				css(ele,target);
				clearInterval(ele.animateTimer);
				callBack && callBack();
				return;
			}

			for(var key in target){
				if(target.hasOwnProperty(key)){
					cur[key]=effect(t,b[key],c[key],d);
				}
			}
			css(ele,cur);
		},17);
	}

	return animate;
})();