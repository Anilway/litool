~function () {
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
    window.ajax = function ({
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
}();