var tool=(function(){
	/*
	toArray:将内数组转换为数组
		@parameter：
			classArray：类数组
		@return:
			Array 装换后的数组
	*/
	function toArray(classArray){
		var ary=[];
		try{
			ary=Array.prototype.slice.call(classArray);
		}catch(e){
			for(var i=0;i<classArray.length;i++){
				ary[i]=ele[i];
			}
		}
		return ary;
	}

	/*
		myBind:bind的兼容处理
			@parameter
				context:指定的this
			@return
				返回一个新函数
	*/
	Function.prototype.myBind=function myBind(context){
		context=context||window;
		var outerArg=Array.prototype.slice.call(arguments,1);
		var _this=this;

		// 如果支持bind，就使用bind
		if('bind' in Function.prototype){
			outerArg.unshift(context);
			return _this.bind.apply(_this,outerArg);
		}

		return function(){
			var innerArg=Array.prototype.slice.call(arguments);
			outerArg=outerArg.concat(innerArg);
			_this.apply(context,outerArg);
		}
	}

	return {
		toArray:toArray
	}
})();