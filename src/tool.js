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
		myIndexOf:查询数组项的索引位置
			@parameter:
				value:数组项
			@return：
				index：返回该项在数组中的索引位置，没有返回-1

		IE6-8下indexOf和lastIndexOf不兼容
	*/
	Array.prototype.myIndexOf=function(value){
		var result=-1;
		for(var i=0;i<this.length;i++){
			if(value===this[i]){
				result=i;
				break;
			}
		}

		return result;
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