(function(){
	var litool=function litool(){
		return new litool.prototype.init();
	};

	var tool=(function(){
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
	var reg=(function(){
 	String.prototype.myTemplate=function myTemplate(temp,reg){
		temp=temp||"{0}年{1}月{2}日 {3}时{4}分{5}秒";
		reg=reg||new RegExp('\\d+','g');
		var ary=this.match(reg);
		temp=temp.replace(/\{(\d+)\}/g,function(){
			return ary[arguments[1]] || '00';
		});
		return temp;
 	}
 	String.prototype.myTrim=function myTrim(){
 		return this.replace(/^\s+|\s+$/g,'');
 	}
	String.prototype.myQueryURL=function myQueryURL(){
		var obj={};
		obj.search=this.slice(this.indexOf("?"));
		obj.search.replace(/([^?=&#]+)=([^?=&#]+)/g,function(){
			obj[arguments[1]]=arguments[2];
		});
		obj.search.replace(/#([^?=&#]+)/g,function(){
			obj.hash=arguments[1];
		});
		return obj;
	}
 	String.prototype.myQueryURLAll=function myQueryURLAll(){
		var obj=this.myQueryURL();
		this.replace(/^([^:]+):/g,function(){
			obj.protocol=arguments[1];
		});
		this.replace(/\/\/([^?]+)?/g,function(){
			obj.host=arguments[1];
		});
		obj.host.replace(/([^/]+[^/])/,function(){
			obj.hostname=arguments[1];
		});
		obj.pathname=obj.host.split(obj.hostname)[1];
		return obj;
	};

	String.prototype.queryURLParameter=function queryURLParameter(){
		var reg=/^([^:]+)\:\/\/([^/]+)(\/[^?]+)?(\?[^#]+)?(#.+)?$/,
			ary=reg.exec(this);

		var	part1={
				protocol:ary[1],
				hostname:ary[2],
				pathname:ary[3],
				host:ary[2]+ary[3],
				hash:ary[5],
				search:ary[4]+ary[5]
		};

		var reg1=/([^?=&#]+)=([^?=&#]+)/g;
		var ary1=reg1.exec(ary[4]);
		var part2={};
		while(ary1){
			part2[ary1[1]]=ary1[2];
			ary1=reg1.exec(ary[4]);
		}

		var result=[];
		result.push(part1);
		result.push(part2);
		return result;
	}

	function isClass(data,classType){
		classType=classType.slice(0,1).toUpperCase()+classType.slice(1).toLowerCase();
		var reg=new RegExp('\\[object '+classType+'\\]'),
			str=Object.prototype.toString.call(data);
		return reg.test(str);
	}

	function toCamelCase(name){
		var str='';
		ary=name.match(/[^-_]+/g);
		str+=ary[0].toLowerCase();
		for(var i=1;i<ary.length;i++){
			str+=ary[i].slice(0,1).toUpperCase()+ary[i].slice(1).toLowerCase();				
		}
		return str;
	}
	function toInitialUpper(str) {
		str=str || '';
		str=str.replace(/(^|\s+|,|\.|!|;|\?|&)\w/g,function(){
			return arguments[0].toUpperCase();
		});
		return str;
	}

	return{
		isClass:isClass,
		toCamelCase:toCamelCase,
		toInitialUpper:toInitialUpper
	}
	})();
	var dom=(function(){
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
		function getStyle(ele,attr){
			if(window.getComputedStyle){
				return window.getComputedStyle(ele,null)[attr];
			}

			return ele.currentStyle[attr];
		}
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
		function winbox(attr,value){
			if(arguments.length>1){
				document.documentElement[attr]=value;
				document.body[attr]=value;
				return;
			}
			return document.documentElement[attr]||document.body[attr];
		}

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
			queryURLParameter:queryURLParameter,
			offset:offset,
			css:css,
			getEleByClass:getEleByClass,
			on:$event.on,
			off:$event.off
		}
	})();
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
					b[key]=dom.css(ele,key);
					c[key]=target[key]-b[key];
				}
			}
			//在设置新动画之前，先把之前正在运行的动画清除掉，防止当前元素相同的动画共存
			clearInterval(ele.animateTimer);
			ele.animateTimer=setInterval(function(){
				var cur={};
				t+=17;
				if(t>=d){
					dom.css(ele,target);
					clearInterval(ele.animateTimer);
					callBack && callBack();
					return;
				}

				for(var key in target){
					if(target.hasOwnProperty(key)){
						cur[key]=effect(t,b[key],c[key],d);
					}
				}
				dom.css(ele,cur);
			},17);
		}

		return animate;
	})();
	var ajax=(function () {
	    class ajaxClass {
	        //=>send ajax
	        init() {
	            let xhr = new XMLHttpRequest();
	            xhr.onreadystatechange = ()=> {
	                if (!/^[23]\d{2}$/.test(xhr.status)) return;
	                if (xhr.readyState === 4) {
	                    let result = xhr.responseText;
	                    //=>数据类型
	                    try {
	                        switch (this.dataType.toUpperCase()) {
	                            case 'TEXT':
	                            case 'HTML':
	                                break;
	                            case 'JSON':
	                                result = JSON.parse(result);
	                                break;
	                            case 'XML':
	                                result = xhr.responseXML;
	                        }
	                    } catch (e) {
	                        
	                    }
	                    this.success(result);
	                }
	            };

	            //=>数据
	            if (this.data !== null) {
	                this.formatData();

	                if (this.isGET) {
	                    this.url += this.querySymbol() + this.data;
	                    this.data = null;
	                }
	            }

	            //=>缓存
	            this.isGET ? this.cacheFn() : null;

	            xhr.open(this.method, this.url, this.async);
	            xhr.send(this.data);
	        }

	        //=>将对象转换为字符串
	        formatData() {
	            
	            if (Object.prototype.toString.call(this.data) === '[object Object]') {
	                let obj = this.data,
	                    str = ``;
	                for (let key in obj) {
	                    if (obj.hasOwnProperty(key)) {
	                        str += `${key}=${obj[key]}&`;
	                    }
	                }
	                str = str.replace(/&$/g, '');
	                this.data = str;
	            }
	        }

	        cacheFn() {
	            
	            !this.cache ? this.url += `${this.querySymbol()}_=${Math.random()}` : null;
	        }

	        querySymbol() {
	           
	            return this.url.indexOf('?') > -1 ? '&' : '?';
	        }
	    }

	    //=>初始化参数
	    return function ({
	        url = null,
	        method = 'GET',
	        type = null,
	        data = null,
	        dataType = 'JSON',
	        cache = true,
	        async = true,
	        success = null
	    }={}) {
	        let _this = new ajaxClass();
	        ['url', 'method', 'data', 'dataType', 'cache', 'async', 'success'].forEach((item)=> {
	            if (item === 'method') {
	                _this.method = type === null ? method : type;
	                return;
	            }
	            if (item === 'success') {
	                _this.success = typeof success === 'function' ? success : new Function();
	                return;
	            }
	            _this[item] = eval(item);
	        });
	        _this.isGET = /^(GET|DELETE|HEAD)$/i.test(_this.method);
	        _this.init();
	        return _this;
	    };
	})();
	
	litool.fn=litool.prototype;
	litool.fn.construcotr=litool;
	var init=litool.fn.init=function(){};
	function getMethods(obj){
		for(var key in obj){
			if(obj.hasOwnProperty(key)){
				litool.fn[key]=obj[key];
			}
		}
	}

	var arr=[tool,reg,dom];
	for (var i = 0; i < arr.length; i++) {
		getMethods(arr[i]);
	}

	litool.fn.animate=animate;
	litool.fn.ajax=ajax;

	litool.fn.init.prototype=litool.fn;

	window.$=window.litool=litool();
})();