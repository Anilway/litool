var dom=(function(){
/*
工具函数：（会单独总结）

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
----------------------------------------------------------------
	节点查询
----------------------------------------------------------------
*/


/*
	getChilds:获取指定子元素数组集合

		@parameter:
			ele:当前元素
			tagname:指定标签名，用来获取该类子元素
		@return
			元素子节点数组集合

*/
	// function getChilds(ele){
	// 	var childs=ele.childNodes;
	// 	// IE8以下不支持filter
	// 	childs=Array.prototype.filter.call(childs,function(item){
	// 		return item.nodeType===1;
	// 	});
	// 	return childs;
	// }

	// ele.getElementsByTagName("*");也可以获取所有的子元素

	function getChilds(ele,tagname){
		var childs=ele.children,
			result=[];
		if(childs.length===0) return;
		for(var i=0;i<childs.length;i++){
			if(childs[i].nodeType===1){
				if(tagname){
					if(childs[i].tagName.toLowerCase()===tagname.toLowerCase()){
						result.push(childs[i]);
					}
					continue;
				}
				result.push(childs[i]);
			}
		}
		return result;
	}

/*
	    prev:获取上一个哥哥元素节点
	 prevAll:获取所有的哥哥元素节点
	    next:获取下一个弟弟元素节点
	 nextAll:获取所有的弟弟元素节点
	siblings:获取所有的兄弟元素节点
	   index:获取当前元素在兄弟元素中的排名索引

		@parameter:
			ele:当前元素节点
		@return：
			节点或节点数组集合或索引
*/
	function prev(ele){
		var p=ele.previousSibling;
		while(p && p.nodeType!==1){
			p=p.previousSibling;
		}
		return p;
	}

	function prevAll(ele){
		var p=ele.previousSibling,
			result=[];

		while(p){
			p.nodeType===1?result.unshift(p):null;
			p=p.previousSibling;
		}
		return result;
	}

	function next(ele){
		var n=ele.nextSibling;
		while(n && n.nodeType!==1){
			n=n.nextSibling;
		}
		return n;
	}

	function nextAll(ele){
		var n=ele.nextSibling,
			result=[];
		while(n){
			n.nodeType===1?result.push(n):null;
			n=n.nextSibling;
		}
		return result;
	}

	function siblings(ele){
		var prevs=prevAll(ele);
		var nexts=nextAll(ele);
		return prevs.concat(nexts);
	}

	function nodeIndex(ele){
		var prevs=prevAll(ele);
		return prevs.length;
	}


/*
----------------------------------------------------------------
	样式获取
----------------------------------------------------------------
*/


/*
	getStyle:获取动态样式(简化版，后面有getCss)

		@parameter:
			ele:当前元素
			attr:要查询的属性
		@return:
			查询的样式值
*/
	function getStyle(ele,attr){
		if(window.getComputedStyle){
			return window.getComputedStyle(ele,null)[attr];
		}

		return ele.currentStyle[attr];
	}

/*
	queryURLParameter:解析url地址

		@parameter：
			url：要解析的url地址
			isAll:是否完整解析
		@return:
			object 以对象的形式返回解析结果
	
*/
	function queryURLParameter(url,isAll){
		var link=document.createElement("a");
		link.href=url;

		var result={};
		if(isAll){
			result.href=link.href;
			result.host=link.host;
			result.hostname=link.hostname;
			result.hash=link.hash;
			result.pathname=link.pathname;
			result.protocol=link.protocol;
		}
	
		if(link.search.length===0) return result;
		result.search=link.search;
		var arr=link.search.match(/[^?=&]+/g);
		for(var i=0;i<arr.length;i++){
			result[arr[i]]=arr[i+1];
			i++;
		}
		return result;
	}

/*
	offset：获取任意元素距离body的偏移量

		@parameter:
			ele:当前元素
		@return：
			object：返回一个对象，包含左偏移left和上偏移top
*/
	function offset(ele){
		var p=ele.offsetParent,
			l=ele.offsetLeft,
			t=ele.offsetTop;

		while(p.nodeName.toLowerCase()!=="body"){
			if(!/MSIE 8/i.test(window.navigator.userAgent)){
				// 不是IE8浏览器，要加上外边框
				l+=p.clientLeft;
				t+=p.clientTop;
			}
			l+=p.offsetLeft;
			t+=p.offsetTop;
			p=p.offsetParent;
		}
		return {top:t,left:l}
	}

/*
样式的操作：

	getCss:获取元素的任意样式值
	setCss：设置元素的样式
	setGroupCss：批量设置样式
	css：前面的综合
		
		@paramater：
			ele:当前元素
			attr：样式属性
			value：设置的属性值

		@return：
			获取的样式属性值
*/

	function getCss(ele,attr){
		var value;
		if(window.getComputedStyle){
			value=window.getComputedStyle(ele,null)[attr];
		}else{
			// IE6-8下处理透明度
			if(attr==='opacity'){
				value=ele.filter;
				var reg=/^alpha\(opacity=(.+)\)$/;
				value=reg.test(value)?reg.exec(value)[1]/100:1;
			}else{
				value=ele.currentStyle[attr];
			}
		}

		// 去除单位（只去除非复合样式属性数字值的单位）
		reg=/^-?(\d+)(\.\d+)?(px|pt|rem|em)?$/i;
		reg.test(value)?value=parseFloat(value):null;
		return value;
	}

	function setCss(ele,attr,value){
		if(attr==="opacity"){
			ele.style.opacity=value;
			ele.style.filter="alpha(opacity="+(value*100)+")";
			return;
		}
		var reg=/^(animationIterationCount|derImageWidth|fillOpacity|flexGrow|flexShrink|floodOpacity|fontWeight|order|orphans|shapeImageThreshold|stopOpacity|strokeMiterlimit|strokeOpacity|tabSize|webkitAnimationIterationCount|webkitBoxFlex|webkitBoxOrdinalGroup|webkitFlexGrow|webkitFlexShrink|webkitOpacity|webkitOrder|widows|zoom|zIndex)$/i;
		// value是纯数字，而且attr不是以上那些不需要单位的属性，就给value添加单位（这里还需要优化，有些单位是%或s）
		// 发现一个bug，zIndex无法设置
		!isNaN(value) && !reg.test(value)?value+="px":null;
		ele.style[attr]=value;
	}

	function setGroupCss(ele,options){
		// 判断option是否为对象
		if(Object.prototype.toString.call(options)!=="[object Object]") return;
		for(var attr in options){
			if(options.hasOwnProperty(attr)){
				setCss(ele,attr,options[attr]);
			}
		}
	}

	function css(){
		var len=arguments.length;
		if(len>=3){
			setCss.apply(this,arguments);
			return;
		}
		if(len===2 && Object.prototype.toString.call(arguments[1])==="[object Object]"){
			setGroupCss.apply(this,arguments);
			return;
		}

		return getCss.apply(this,arguments);
	}

/*
	getEleByClass:getElementsByClassName的兼容处理

		@parameter:
			strClass:样式类字符串
			context:上下文（节点范围），默认为document
		@return：
			Array 返回符合条件的元素节点数组集合

		strClass可以放多个样式类，用空格隔开，就和使用getElementsByClassName一样。
	
		我们可以把该方法放到原型上：
		Node.prototype.getEleByClass=function gerEleByClass(){...}

*/
	function getEleByClass(strClass,context){
		context=context || document;
		// 如果非IE6-8，使用原生方法，返回数组格式
		if("getElementsByClassName" in document){
			return toArray(context.getElementsByClassName(strClass));
		}
		// IE6-8使用
		strClass=strClass.replace(/(^\s+)|(\s+$)/g,"").split(/ +/);
		var eleList=context.getElementsByTagName("*"),
			result=[];
		for(var i=0;i<eleList.length;i++){
			var itemClass=eleList[i].className;
			var flag=true;
			for(var j=0;j<strClass.length;j++){
				var reg=new RegExp("(^|\\s+)"+strClass[j]+"(\\s+|&)");
				if(!reg.test(itemClass)){
					flag=false;
					break;
				}
			}
			flag?result.push(eleList[i]):null;
		}
		return result;
	}

/*
	winbox:document.documentElement和document.body的兼容处理
		@parameter:
			attr:指定的属性
			value：设定的属性值
		@return:
			如果只传入attr参数，返回该属性值；
			如果传入attr参数和value参数，则设置属性值，无返回。

*/
	function winbox(attr,value){
		if(arguments.length>1){
			document.documentElement[attr]=value;
			document.body[attr]=value;
			return;
		}
		return document.documentElement[attr]||document.body[attr];
	}


/*
----------------------------------------------------------------
	JS运动
----------------------------------------------------------------
*/


// 已单独独立出去


/*
----------------------------------------------------------------
	DOM0级事件、DOM2级事件若干兼容处理
----------------------------------------------------------------
*/
/*
	ieMouseEvent:鼠标事件对象兼容处理
	@parameter
		e:传入的事件对象
	@return
		返回标准化后的事件对象，之后的代码按标准事件对象操作即可

*/

function ieMouseEvent(e){
	// 如果为标准浏览器，直接退出函数
	// 不能用e判断，DOM2级事件下IE也是传入事件对象
	if(document.addEventListener){
		return;
	}
	// IE6-8下
	e=e||window.event;
	e.pageX=e.clientX+winbox('scrollLeft');
	e.pageY=e.clientY+winbox('scrollTop');
	e.target=e.srcElement;
	e.stopPropagation=function(){
		e.cancelBubble=true;
	};
	e.preventDefault=function(){
		e.returnValue=false;
	}

	return e;
}


	var $event=(function(){
		/*
			on:基于DOM2实现事件绑定（兼容所有浏览器）
			@parameter
				ele:当前要操作的元素
				type：要绑定的事件类型
				fn：需要绑定的事件方法
			@return
				不需要返回值

			解决IE6-8下DOM2级事件绑定的重复问题、执行顺序问题、this指向问题
		*/
		function on(ele,type,fn){
			if(document.addEventListener){
				ele.addEventListener(type,fn,false);
				return;
			}
			// console.log('IE开始执行');
			// IE6-8下自定义事件池
			if(typeof ele[type+"Pond"]==="undefined"){
				ele[type+"Pond"]=[];
				ele.attachEvent("on"+type,function(e){
					run.call(ele,e);
				});
			}

			// 忽略重复事件方法
			var ary=ele[type+"Pond"];
			for(var i=0;i<ary.length;i++){
				if(ary[i]===fn){
					return;
				}
			}
			ary.push(fn);
		}

		/*
			off:移除事件绑定
			@parameter
				ele:当前要操作的元素
				type：要移除的事件类型
				fn：需要移除的事件方法
			@return
				不需要返回值
		*/
		function off(ele,type,fn){
			if(document.addEventListener){
				ele.removeEventListener(type,fn,false);
				return;
			}

			var ary=ele[type+"Pond"];
			if(!ary) return;// 未绑定事件时，直接使用off方法，没有事件池，此时ary为undefined，此时return出去，避免后面使用undefined.length报错
			for(var i=0;i<ary.length;i++){
				if(ary[i]===fn){
					ary[i]=null;
					break;
				}
			}
		}

		/*
			run：桥接方法，按顺序执行自定义事件池中的事件
				@parameter
					e:事件对象
				@return
					无返回值
		*/
		function run(e){
			ieMouseEvent(e); // 事件对象兼容处理
			var ary=this[e.type+"Pond"];
			if(!ary) return;
			for(var i=0;i<ary.length;i++){
				var item=ary[i];
				// 解决off接触绑定造成的数组塌陷问题
				if(item===null){
					ary.splice(i,1);
					i--;
					continue;
				}
				// this指定为当前ele
				item.call(this,e);
			}
		}

		return {
			on:on,
			off:off
		}
	})();
	


	return {
		winbox:winbox,
		getChilds:getChilds,
		prev:prev,
		prevAll:prevAll,
		next:next,
		nextAll:nextAll,
		siblings:siblings,
		nodeIndex:nodeIndex,
		// getStyle:getStyle,
		queryURLParameter:queryURLParameter,
		offset:offset,
		// getCss:getCss,
		// setCss:setCss,
		// setGroupCss:setGroupCss,
		css:css,
		getEleByClass:getEleByClass,
		// animate:animate,（已独立出去）
		on:$event.on,
		off:$event.off
	}
})();