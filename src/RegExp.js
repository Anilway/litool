/*!
 * liTool.js v0.0.1
 * (c) 2018 Anilway
 * The project is Open Source and released under the MIT license, so anyone is welcome to contribute. 
 */

 var $reg=(function(){
 	

// 正则表达式相关的

 	/*
 	 myTemplate：按指定模板格式格式化字符串。

		@parameter
	 		temp:格式模板（可选，默认为年月日时分秒）
	 		reg：匹配的正则（可选，默认匹配数字）

 		@return
 			按模板格式化后的字符串
 	*/
 	String.prototype.myTemplate=function myTemplate(temp,reg){
		temp=temp||"{0}年{1}月{2}日 {3}时{4}分{5}秒";
		reg=reg||new RegExp('\\d+','g');
		var ary=this.match(reg);
		temp=temp.replace(/\{(\d+)\}/g,function(){
			return ary[arguments[1]] || '00';
		});
		return temp;
 	}

 	/*
		去除字符串首尾空格（原味原生trim、trimLeft、trimRight不兼容）
 	*/
 	String.prototype.myTrim=function myTrim(){
 		return this.replace(/^\s+|\s+$/g,'');
 	}

 	/*
		myQueryURL:url地址解析,只解析？后面的参数

			@parameter
				无

			@return
				返回解析后的对象
				{
					search:'?name=Join&age=27&sex=0#doctor',
					name:'Join',
					age:27,
					sex:0,
					hash:'doctor',	
				}
 	*/
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

 	/*
	myQueryURLAll:url地址解析

		@parameter：无

		@return：
			将解析后的结果以对象的形式返回
			{
				protocol:'http',
				    host:'www.google.com/stu/index.html',
				hostname:'www.google.com',
				pathname:'/stu/index.html', 
				  search:'?name=Join&age=27&sex=0#doctor',
				    name:'Join',
				     age:27,
				     sex:0,
				    hash:'doctor',	
			}
 	*/
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

	// 另外的实现方式
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

// 检测数据类型

	function isClass(data,classType){
		classType=classType.slice(0,1).toUpperCase()+classType.slice(1).toLowerCase();
		var reg=new RegExp('\\[object '+classType+'\\]'),
			str=Object.prototype.toString.call(data);
		return reg.test(str);
	}

// 转换为驼峰命名格式

	function toCamelCase(name){
		var str='';
		ary=name.match(/[^-_]+/g);
		str+=ary[0].toLowerCase();
		for(var i=1;i<ary.length;i++){
			str+=ary[i].slice(0,1).toUpperCase()+ary[i].slice(1).toLowerCase();				
		}
		return str;
	}

// 首字母大写

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


 // 方法汇总：
 /*
字符串、正则匹配方面：


加在原型上：

	String原型上：

		myTemplate
		myTrim
		myQueryURL
		myQueryURLAll

加在$reg上：

	isClass
	toCamelCase
	toInitialUpper
 */