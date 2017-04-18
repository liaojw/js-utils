(function () {
    var utils = {
        isEmptyString: isEmptyString,
        isNotEmptyString: isNotEmptyString,
        isEmptyObject: isEmptyObject,
        isNotEmptyObject: isNotEmptyObject,
        isOwnEmptyObject: isOwnEmptyObject,
        isNotOwnEmptyObject: isNotOwnEmptyObject,
        trim: trim,
        phoneProcess: phoneProcess,
        getHttpBasePath: getHttpBasePath,
        getUrlParameters: getUrlParameters,
        timestampFormat: timestampFormat,
        getChineseMoney: getChineseMoney,
        imgBase64Decode: imgBase64Decode,
        getBrowser: getBrowser
    };
    window.$Utils = utils;

    /**
     * 判断String是否为空
     * @param val
     * @returns {boolean}
     */
    function isEmptyString(val) {
        if ((val === null || typeof(val) === 'undefined') || (typeof(val) === 'string' && val === '')) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断String是否不为空
     * @param val
     * @returns {boolean}
     */
    function isNotEmptyString(val) {
        return !this.isEmptyString(val);
    }

    /**
     * 检测对象是否是空对象(不包含任何可读属性)
     * 方法既检测对象本身的属性，也检测从原型继承的属性(因此没有使hasOwnProperty)
     * @param obj
     * @returns {boolean}
     */
    function isEmptyObject(obj){
        for (var name in obj){
            return false;
        }
        return true;
    }

    /**
     * 检测对象是否不是空对象(不包含任何可读属性)
     * 方法既检测对象本身的属性，也检测从原型继承的属性(因此没有使hasOwnProperty)
     * @param obj
     * @returns {boolean}
     */
    function isNotEmptyObject(obj) {
        return !this.isEmptyObject(obj);
    }

    /**
     * 检测对象是否是空对象(不包含任何可读属性)
     * 方法只既检测对象本身的属性，不检测从原型继承的属性
     * @param obj
     * @returns {boolean}
     */
    function isOwnEmptyObject(obj){
        for(var name in obj){
            if(obj.hasOwnProperty(name)){
                return false;
            }
        }
        return true;
    }

    /**
     * 检测对象是否不是空对象(不包含任何可读属性)
     * 方法只既检测对象本身的属性，不检测从原型继承的属性
     * @param obj
     * @returns {boolean}
     */
    function isNotOwnEmptyObject(obj){
        return !this.isOwnEmptyObject(obj);
    }
    
    /**
     * 字符串首尾去空格
     * @param val
     * @returns
     */
	function trim(val) {
		if (this.isNotEmpty(val)) {
			return val.replace(/[\s\uFEFF\xa0\u3000]/g, '');
		} else {
			return val;
		}
	}
	
	/**
	 * 手机号处理
	 * @param val
	 * @returns
	 */
	function phoneProcess(val){
		if (this.isNotEmpty(val)) {
			val = val.toString().replace(/-/g, '');
			val = val.toString().replace(/ /g, '');
			return val;
		} else {
			return val;
		}
	}

    /**
     * 获取网站根路径地址
     * @returns
     */
    function getHttpBasePath() {
        var basePath = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/';
        return basePath;
    }

    /**
     * 获取url路径参数
     * @returns {*}
     */
    function getUrlParameters() {
        var query = location.search.substring(1);
        var entries = query.split('&');
        return Array.prototype.reduce.call(entries, function (obj, item) {
            var param = item.split('=');
            obj[param[0]] = param[1];
            return obj;
        }, {});
    }

    /**
     * 时间戳转换
     * @param  {string} format    格式（Y-m-d H:i:s）
     * @param  {int}    timestamp 10位时间戳
     * @return {string}           格式化的时间字符串
     */
    function timestampFormat(format, timestamp){
        var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date());
        var pad = function(n, c){
            if((n = n + "").length < c){
                return new Array(++c - n.length).join("0") + n;
            } else {
                return n;
            }
        };
        var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"};
        var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var f = {
            d: function(){return pad(f.j(), 2)},
            D: function(){return f.l().substr(0,3)},
            j: function(){return jsdate.getDate()},
            l: function(){return txt_weekdays[f.w()]},
            N: function(){return f.w() + 1},
            S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'},
            w: function(){return jsdate.getDay()},
            z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0},
            W: function(){
                var a = f.z(), b = 364 + f.L() - a;
                var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
                if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){
                    return 1;
                } else{
                    if(a <= 2 && nd >= 4 && a >= (6 - nd)){
                        nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                        return date("W", Math.round(nd2.getTime()/1000));
                    } else{
                        return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                    }
                }
            },
            F: function(){return txt_months[f.n()]},
            m: function(){return pad(f.n(), 2)},
            M: function(){return f.F().substr(0,3)},
            n: function(){return jsdate.getMonth() + 1},
            t: function(){
                var n;
                if( (n = jsdate.getMonth() + 1) == 2 ){
                    return 28 + f.L();
                } else{
                    if( n & 1 && n < 8 || !(n & 1) && n > 7 ){
                        return 31;
                    } else{
                        return 30;
                    }
                }
            },
            L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0},
            Y: function(){return jsdate.getFullYear()},
            y: function(){return (jsdate.getFullYear() + "").slice(2)},
            a: function(){return jsdate.getHours() > 11 ? "pm" : "am"},
            A: function(){return f.a().toUpperCase()},
            B: function(){
                var off = (jsdate.getTimezoneOffset() + 60)*60;
                var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
                var beat = Math.floor(theSeconds/86.4);
                if (beat > 1000) beat -= 1000;
                if (beat < 0) beat += 1000;
                if ((String(beat)).length == 1) beat = "00"+beat;
                if ((String(beat)).length == 2) beat = "0"+beat;
                return beat;
            },
            g: function(){return jsdate.getHours() % 12 || 12},
            G: function(){return jsdate.getHours()},
            h: function(){return pad(f.g(), 2)},
            H: function(){return pad(jsdate.getHours(), 2)},
            i: function(){return pad(jsdate.getMinutes(), 2)},
            s: function(){return pad(jsdate.getSeconds(), 2)},
            O: function(){
                var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4);
                if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
                return t;
            },
            P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2))},
            c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()},
            U: function(){return Math.round(jsdate.getTime()/1000)}
        };
        return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){
            var ret;
            if( t!=s ){
                ret = s;
            } else if( f[s] ){
                ret = f[s]();
            } else{
                ret = s;
            }
            return ret;
        });
    }

    /**
     * 获取大写人名币
     * @param money
     * @returns {string}
     */
    function getChineseMoney(money) {
        var dists = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        var units = [['元', '万', '亿'], ['', '十', '百', '千']];
        var s = '';
        for (var i = 0; money > 0 && i < units[0].length; i++) {
            var p = '';
            for (var j = 0; money > 0 && j < units[1].length; j++) {
                var left = money % 10;
                p = dists[left] + units[1][j] + p;
                money = Math.floor(money / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + units[0][i] + s;
        }
        return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^$/, '零元') + '整';
    }

    /**
     * 图片Base64Decode
     * @param data
     * @returns {string}
     */
    function imgBase64Decode(data) {
    	return 'data:image/png;base64,' + data;
    }

    /**
     * 获取浏览器信息
     * @returns {{versions: {trident, presto, webKit, gecko, mobile, ios, android, iPhone, iPad, webApp, weixin, alipay, qq}, language: string}}
     */
    function getBrowser() {
        return {
            versions: function () {
                var u = navigator.userAgent, app = navigator.appVersion;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                    alipay: u.indexOf('AlipayClient') > -1, //是否为支付宝
                    qq: u.match(/\sQQ/i) == " qq" //是否QQ
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }
    }
})();



