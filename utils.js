/**
 * Created by ljw on 2017/7/1.
 *
 * String:
 *      $Utils.strUtils 定义一个字符串工具类
 *          isEmpty 判断字符串是否为空
 *          isNotEmpty 判断字符串是否不为空
 *          trim 字符串首尾去空格
 *
 * Object:
 *      $Utils.ajaxUtils 定义一个ajax工具类
 *          ajax 定义一个ajax工具函数
 *          get 方法
 *          post 方法
 *
 *      $Utils.elementUtils DOM元素工具类
 *          replaceClassName  替换字符串，设置className属性
 *          getInnerText  获取DOM元素内部文本的兼容方法
 *          setInnerText  设置DOM元素内部文本的兼容方法
 *          getNextElement  封装了获取元素的下一个兄弟元素的方法
 *          getPreviousElement  封装了获取元素的上一个兄弟元素的方法
 *          getFirstElement  封装寻找某个元素的第一个子元素的方法
 *          getLastElement  封装寻找某个元素的最后一个子元素的方法
 *          my$  封装了通过id获取元素的方法
 *
 *      $Utils.eventUntil 事件处理对象，封装了绑定事件的方法
 *          addSeveralEvent(element, eventName, fn);  给一个元素同时多个事件
 *          addEvent(element, eventName, fn);  封装添加事件的方法
 *          removeEvent(element, eventName, fn);  封装移除事件的方法
 *
 *      $Utils.getDateObj 获取指定格式的日期
 *          getDate 获取指定格式的日期
 *          transDateFormat 日期显示格式化函数
 *
 *      $Utils.getRandomObj 获取n个随机数 最终得到数组  Object.getRandomArr 得到随机数的数组
 *          getRandomArr(count, min, max);  获取n个随机数的方法 最终得到数组
 *
 * Browser:
 *      $Utils.browserUtils 定义一个浏览器工具类
 *          getInfo 获取浏览器信息
 *          getBasePath 获取网站根路径
 *          getUrlParameters 获取URL参数
 *
 * Class:
 *      $Utils.Interface(interfaceName, MethodsArr) 接口类
 *          verifyInterface(instanceSets) 接口校验方法
 *
 * Method:
 *      $Utils.animate(element, json, fn); js 特效中的动画函数封装
 *      $Utils.getAttrValue(element,attr);  获取属性的兼容方法
 *      $Utils.getObjArrMax(arr) 得到诸如[{attr1:2,attr2:3}, {attr1:1,attr2:2}]数组中各对象的attr1属性中最大的一个（比较勉强的方法）
 *      $Utils.getRandom(min, max);  获取一个随机整数 Math.random(); 中的参数可以是一个，考虑了参数是一个的情况
 *      $Utils.getColor(count); 获取随机的颜色数组
 *      $Utils.sortArr(arr) 数组冒泡排序
 *      $Utils.getChineseMoney(val) 获取大写人命币
 *      $Utils.formatCurrency(val) 将数值四舍五入(保留2位小数)后格式化成金额形式
 *      $Utils.formatCurrencyTenThou(val) 将数值四舍五入(保留2位小数)后格式化成金额形式
 *      $Utils.getGlobal() 获取宿主环境顶层对象
 *      $Utils.constantize() 冻结对象
 */
// 命名空间
var $Utils = {};

/**
 * String 定义一个字符串工具类
 * @type {{isEmpty, isNotEmpty, trim}}
 */
$Utils.strUtils = (function () {
    return {
        /**
         * 判断字符串是否为空
         * @param val
         * @returns {boolean}
         */
        isEmpty: function (val) {
            if ((val === null || typeof(val) === 'undefined') || (typeof(val) === 'string' && val === '')) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * 判断字符串是否不为空
         * @param val
         * @returns {boolean}
         */
        isNotEmpty: function (val) {
            return !this.isEmpty(val);
        },
        /**
         * 字符串首尾去空格
         * @param val
         * @returns {*}
         */
        trim: function (val) {
            if (this.isNotEmpty(val)) {
                return val.replace(/[\s\uFEFF\xa0\u3000]/g, '');
            } else {
                return val;
            }
        }
    }
})();

/**
 * Object 定义一个ajax工具
 * @type {{ajax, get, post}}
 */
$Utils.ajaxUtils = (function () {
    return {
        /**
         * ajax 工具函数
         * @param options 是一个对象
         * @returns {*}
         */
        ajax: function (options) {
            /*如果你什么都没传呢？停止执行*/
            if (!options || typeof  options != 'Object') return fasle;
            /*如果传了*/
            var type = options.type || 'get';
            var url = options.url || location.pathname;
            /* false true  "" false  */
            var async = options.async === false ? false : true;
            /*需要传递的数据*/
            var data = options.data || {};
            /*需要data转化成ajax传递数据的格式 {name:'',age:''} ===>>> name=gc&age=10 */
            var dataStr = '';
            for (key in data) {
                dataStr += key + '=' + data[key] + '&';
            }
            /*str.slice(0,-1); 取到倒着数几个字符*/
            dataStr = dataStr && dataStr.slice(0, -1);
            /*ajax编程*/
            /*初始化*/
            var xhr = new XMLHttpRequest();
            /*设置请求行*/
            /*如果是get请求  参数是不是该拼接在url后面*/
            xhr.open(type, type == 'get' ? url + '?' + dataStr : url, async);
            /*设置请求头*/
            if (type == 'post') {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            /*设置请求内容*/
            xhr.send(type == 'get' ? null : dataStr);
            /*响应*/
            xhr.onreadystatechange = function () {
                /*首先确定通讯完全完成*/
                if (xhr.readyState == 4) {
                    /*如果是成功的请求 status == 200 */
                    if (xhr.status == 200) {
                        /*成功*/
                        /*知道后台想要返回什么数据类型 application/json;charset=utf-8*/
                        /*application/xml application/json text/html text/xml text/json text/css*/
                        var contentType = xhr.getResponseHeader('Content-Type');
                        var result = null;
                        if (contentType.indexOf('xml') > -1) {
                            /*返回什么数据类型xml*/
                            result = xhr.responseXML;
                        } else if (contentType.indexOf('json') > -1) {
                            /*返回什么数据类型json*/
                            var data = xhr.responseText;
                            result = data && JSON.parse(data);
                        } else {
                            result = xhr.responseText;
                        }
                        /*执行成功回调函数*/
                        options.success && options.success(result);

                    } else {
                        /*失败*/
                        options.error && options.error({status: xhr.status, statusText: xhr.statusText});
                    }
                }
            }
        },
        /**
         * get 方法
         * @param options
         */
        get: function (options) {
            options.type = 'get';
            this.ajax(options);
        },
        /**
         * post 方法
         * @param options
         */
        post: function (options) {
            options.type = 'post';
            this.ajax(options);
        }
    }
})();

/**
 * Object 事件处理对象，封装了绑定事件的方法
 * @returns {{addSeveralEvent: addSeveralEvent, addEvent: addEvent, removeEvent: removeEvent}}
 * @constructor
 */
$Utils.eventUntil = (function () {
    return {
        /**
         * Method 给一个元素同时多个事件
         * @param element 需要绑定事件的元素 Dom Object
         * @param eventName 需要绑定的事件类型名称 string
         * @param fn 回调函数 function
         */
        addSeveralEvent: function (element, eventName, fn) {
            var oddEvent = element["on" + eventName];
            if (oddEvent == null) {
                element["on" + eventName] = fn;
            } else {
                element["on" + eventName] = function () {
                    oddEvent();
                    fn();
                }
            }
        },
        /**
         * 封装添加事件的方法
         * @param element 需要绑定事件的元素 Dom Object
         * @param eventName 需要绑定的事件类型名称 string
         * @param fn 回调函数 function
         */
        addEvent: function (element, eventName, fn) {
            if (element.addEventListener) {  // 谷歌和火狐
                element.addEventListener(eventName, fn, false);
            } else if (element.attachEvent) {  // IE8
                element.attachEvent("on" + eventName, fn);
            } else {  // 所有浏览器
                element["on" + eventName] = fn;
            }
        },
        /**
         * 移除事件的兼容方法
         * @param element 需要绑定事件的元素 Dom Object
         * @param eventName 需要绑定的事件类型名称 string
         * @param fn 回调函数 function
         */
        removeEvent: function (element, eventName, fn) {
            if (element.removeEventListener) { // 谷歌和火狐
                element.removeEventListener(eventName, fn, false);
            } else if (element.attachEvent) { // IE8
                element.attachEvent("on" + eventName, fn);
            } else {  // 所有浏览器
                element["on" + eventName] = null;
            }
        }
    };
})();

/**
 * Object DOM元素工具类
 * @type {{replaceClassName, getInnerText, setInnerText, getNextElement, getPreviousElement, getFirstElement, getLastElement, my$}}
 */
$Utils.elementUtils = (function () {
    return {
        /**
         * 替换字符串，设置className属性
         * @param element 要替换class属性的元素
         * @param oldStr 替换前的类名
         * @param newStr 新的类名
         */
        replaceClassName: function (element, oldStr, newStr) {
            element.className = element.className.replace(oldStr, newStr);
        },

        /**
         * 获取DOM元素内部文本的兼容方法
         * @param element DOM元素
         * @returns {*}
         */
        getInnerText: function (element) {
            if (typeof element.innerText === "string") {
                return element.innerText;
            } else {
                return element.textContent;
            }
        },

        /**
         * 设置DOM元素内部文本的兼容方法
         * @param element DOM元素
         * @param content 要设置的内容
         */
        setInnerText: function (element, content) {
            if (typeof element.innerText === "string") {
                element.innerText = content;
            } else {
                element.textContent = content;
            }
        },

        /**
         * 封装了获取元素的下一个兄弟元素的方法
         * @param element DOM元素
         * @returns {*}
         */
        getNextElement: function (element) {
            if (element.nextElementSibling) {
                return element.nextElementSibling;
            } else {
                var next = element.nextSibling;
                while (next && next.nodeType !== 1) {
                    next = next.nextSibling;
                }
                return next;
            }
        },

        /**
         * 封装了获取元素的上一个兄弟元素的方法
         * @param element DOM元素
         * @returns {*}
         */
        getPreviousElement: function (element) {
            if (element.previousElementSibling) {
                return element.previousElementSibling;
            } else {
                var previous = element.previousSibling;
                while (previous && 1 !== next.nodeType) {
                    previous = previous.previousSibling;
                }
                return previous;
            }
        },

        /**
         * 封装寻找某个元素的第一个子元素的方法
         * @param element DOM元素
         * @returns {*}
         */
        getFirstElement: function (element) {
            // return element.children[0];  // 为了更严瑾用下面的方法
            if (element.firstElementChild) {
                return element.firstElementChild;
            } else {
                var first = element.firstChild;
                while (first && 1 !== first.nodeType) {
                    first = first.nextSibling;
                }
                return first;
            }
        },

        /**
         * 封装寻找某个元素的最后一个子元素的方法
         * @param element DOM元素
         * @returns {*}
         */
        getLastElement: function (element) {
            // return element.children[element.children.length-1];  // 为了更严瑾用下面的方法
            if (element.lastElementChild) {
                return element.lastElementChild;
            } else {
                var last = element.lastChild;
                if (last && 1 !== last.nodeType) {
                    last = last.previousSibling;
                }
                return last;
            }
        },

        /**
         * 封装了通过id获取元素的方法
         * @param id
         * @returns {Element}
         */
        my$: function (id) {
            return document.getElementById(id);
        }
    }
})();

/**
 * Object 获取指定格式的日期
 * @type {{getDate, transDateFormat}}
 */
$Utils.getDateObj = (function () {
    return {
        /**
         * 获取指定格式的日期
         * @param date
         * @returns {string}
         */
        // 封装一个指定日期格式的获取日期的函数
        getDate: function (date) {
            // 获取年
            var year = date.getFullYear();
            // 获取月
            var mouth = date.getMonth() + 1;
            // 获取日
            var day = date.getDate();
            // 获取小时
            var hours = date.getHours();
            // 获取分钟
            var minute = date.getMinutes();
            // 获取秒
            var second = date.getSeconds();
            // 设置格式
            mouth = this.transDateFormat(mouth);
            day = this.transDateFormat(day);
            hours = this.transDateFormat(hours);
            minute = this.transDateFormat(minute);
            second = this.transDateFormat(second);
            return year + "年" + mouth + "月" + hours + "日" + " " + hours + ":" + minute + ":" + second;
        },
        /**
         * 日期显示格式化函数
         * @param val 时分秒数字 0~59
         * @returns {string}
         */
        transDateFormat: function (val) {
            return val < 10 ? "0" + val : val;
        }
    }
})();

/**
 * Object 获取n个随机数 最终得到数组  Object.getRandomArr 得到随机数的数组
 * 说明：因为要传递参数，所以不能用立即执行函数
 * @type {{getRandomArr}}
 */
$Utils.getRandomObj = (function () {
    var arr = [];
    return {
        /**
         * 获取n个随机数的方法 最终得到数组
         * @param count 需要得到的随机数组中随机数的个数
         * @param min 随机数的最小值
         * @param max 随机数的最大值
         * @returns {Array}
         */
        getRandomArr: function (count, min, max) {
            while (arr.length < count) {
                var num = $Utils.getRandom(min, max);
                if (arr.indexOf(num) === -1) {
                    arr.push(num);
                }
            }
            return arr;
        }
    }
})();

/**
 * Browser 定义一个浏览器工具类
 * @type {{getInfo, getBasePath, getUrlParameters}}
 */
$Utils.browserUtils = (function () {
    return {
        /**
         * 获取信息
         * @returns {{navigator: (Navigator|WorkerNavigator), appVersion: string, userAgent: string, language: string, versions: {trident, presto, webKit, gecko, mobile, ios, android, iPhone, iPad, webApp, weChat, alipay, weibo, dingTalk, qq}}}
         */
        getInfo: function () {
            return {
                navigator: navigator,
                appVersion: navigator.appVersion,
                userAgent: navigator.userAgent,
                language: (navigator.browserLanguage || navigator.language).toLowerCase(),
                versions: function () {
                    var u = navigator.userAgent;
                    return {
                        trident: u.indexOf('Trident') > -1, //IE内核
                        presto: u.indexOf('Presto') > -1, //opera内核
                        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                        android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
                        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                        iPad: u.indexOf('iPad') > -1, //是否为iPad
                        webApp: u.indexOf('Safari') == -1, //是否为web应用程序，没有头部与底部
                        weChat: u.indexOf('MicroMessenger') > -1, //是否为微信
                        alipay: u.indexOf('AlipayClient') > -1, //是否为支付宝
                        weibo: u.indexOf('Weibo') > -1, //是否为微博
                        dingTalk: u.indexOf('DingTalk') > -1, //是否为钉钉
                        qq: u.match(/QQ\//i) == "QQ/" //是否为QQ
                    };
                }()
            }
        },
        /**
         * 获取网站根路径
         * @returns {string}
         */
        getBasePath: function () {
            return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/';
        },
        /**
         * 获取URL参数
         * @returns {*}
         */
        getUrlParameters: function () {
            var query = location.search.substring(1);
            var entries = query.split('&');
            return Array.prototype.reduce.call(entries, function (obj, item) {
                var param = item.split('=');
                obj[param[0]] = param[1];
                return obj;
            }, {});
        }
    }
})();

/**
 * Method js 特效中的动画函数封装
 * @param element 要添加动画的元素
 * @param json 需要产生动画的数据
 * @param fn 回调函数
 */
$Utils.animate = function (element, json, fn) {
    clearInterval(element.timeId);
    element.timeId = setInterval(function () {
        var flag = true;//假设都达到了目标
        for (var attr in json) {
            if (attr == "opacity") {//判断属性是不是opacity
                var current = getAttrValue(element, attr) * 100;
                //每次移动多少步
                var target = json[attr] * 100;//直接赋值给一个变量,后面的代码都不用改
                var step = (target - current) / 10;//(目标-当前)/10
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                current = current + step;
                element.style[attr] = current / 100;
            } else if (attr == "zIndex") {//判断属性是不是zIndex
                element.style[attr] = json[attr];
            } else {//普通的属性
                //获取当前的位置----getAttrValue(element,attr)获取的是字符串类型
                var current = parseInt(getAttrValue(element, attr)) || 0;
                //每次移动多少步
                var target = json[attr];//直接赋值给一个变量,后面的代码都不用改
                var step = (target - current) / 10;//(目标-当前)/10
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                current = current + step;
                element.style[attr] = current + "px";
            }
            if (current != target) {
                flag = false;//如果没到目标结果就为false
            }
        }
        if (flag) {//结果为true
            clearInterval(element.timeId);
            if (fn) {//如果用户传入了回调的函数
                fn(); //就直接的调用,
            }
        }
        console.log("target:" + target + "current:" + current + "step:" + step);
    }, 10);
};

/**
 * CLASS 接口类：2个参数
 * @param interfaceName 接口名称
 * @param MethodsArr 接口抽象方法的方法名存放数组
 * @constructor $Utils.Interface
 */
$Utils.Interface = function (interfaceName, MethodsArr) {
    // 判断参数传入的参数个数是否等于2
    if (arguments.length !== 2) {
        throw new Error("传入的接口参数个数不正确");
    }
    this.interfaceName = interfaceName;
    // 用一个空数组接收第二个参数数组
    this.Methods = [];
    for (var i = 0; i < MethodsArr.length; i++) {
        // 判断方法是否存在，方法名是否是"string"类型
        if (typeof MethodsArr[i] !== "string") {
            throw new Error("接口方法名必须是string类型的");
        }
        this.Methods.push(MethodsArr[i]);
    }
};

/**
 * CLASS.Method 接口校验
 * @param instanceSets  实例的集合，传入多个参数：第一个实现类的实例，第二个，第三个...接口实例
 */
$Utils.Interface.verifyInterface = function (instanceSets) {
    // 判断传入的参数个数是否正确
    if (arguments.length < 2) {
        throw new Error("接口校验方法的构造器实参个数必须大于等于2");
    }
    // 判断传进来的参数的个数是否大于等于2，如果小于2，则抛出异常
    for (var i = 1; i < arguments.length; i++) {
        // 将接口实例保存到一个变量中
        var interfaceInstance = arguments[i];
        // 判断传过来的对象的构造器是否是Interface，不是则抛出异常
        if (interfaceInstance.constructor !== $Utils.Interface) {
            throw new Error("参数的构造器不是Interface对象");
        }
        // 检测方法
        for (var j = 0; j < interfaceInstance.Methods.length; j++) {
            // 用一个参数来接收方法名称
            var MethodName = interfaceInstance.Methods[j];
            if (!InstanceSets[MethodName] || typeof InstanceSets[MethodName] !== "function") {
                throw new Error("方法：'" + MethodName + "'不存在");
            }
        }
    }
};

/**
 * Method 获取随机的颜色数组
 * @param count 需要获取的颜色数目
 * @returns {Array}
 */
$Utils.getColor = function (count) {
    var colorSingle;
    var colorArr = [];
    var color = "#";
    for (var i = 0; i < count; i++) {
        for (var j = 0; j < 6; j++) {
            var colorRandom = $Utils.getRandom(16);
            switch (colorRandom) {
                case 10:
                    colorSingle = "A";
                    break;
                case 11:
                    colorSingle = "B";
                    break;
                case 12:
                    colorSingle = "C";
                    break;
                case 13:
                    colorSingle = "D";
                    break;
                case 14:
                    colorSingle = "E";
                    break;
                case 15:
                    colorSingle = "F";
                    break;
                default:
                    colorSingle = colorRandom;
            }
            color += colorSingle;
        }
        colorArr.push(color);
        color = "#";
    }
    return colorArr;
};

/**
 * Method EXTEND 继承（原型继承，仅仅继承原型中的属性和方法） + call()/apply只继承 混合继承
 * @param {Object} sub 子类构造函数
 * @param {Object} sup 父类构造函数
 */
$Utils.extend = function (sub, sup) {
    //目的：需要实现只继承父类的原型对象
    //1 需要创建一个空函数  目的： 中转
    var F = new Function();
    //2 实现空函数的原型对象和超类的原型对象转换
    F.prototype = sup.prototype;
    //3 原型继承
    sub.prototype = new F();
    //4 还原子类的构造器
    sub.prototype.constructor = sub;
    // 保存父类的原型对象 目的：一方面方便解耦； 另一方面可以轻松的获得父类的原型对象
    //5 自定义一个子类的静态属性  接收父类的原型对象
    sub.superClass = sup.prototype;
    //6 为防止父类的constructor属性的设置落下 在extend()方法中加保险
    if (sup.prototype.constructor == Object.prototype.constructor) {
        //手动的还原原型对象的构造器
        sup.prototype.constructor = sup;
    }
};

/**
 * Method 获取属性的兼容方法
 * @param element 要获取属性的兼容方法
 * @param attr 要获取的属性
 * @returns {*|number}
 */
$Utils.getAttrValue = function (element, attr) {
    return element.currentStyle ? element.currentStyle[attr] : window.getComputedStyle(element, null)[attr];
};

/**
 * Method 得到诸如[{attr1:2,attr2:3}, {attr1:1,attr2:2}]数组中各对象的attr1属性中最大的一个（仅适用于对象的attr1属性排序）
 * @param arr [{attr1:2,attr2:3}, {attr1:1,attr2:2}]
 */
$Utils.getObjArrMax = function (arr) {
    Math.max.apply(null, arr.map(function (v) {
        return v.attr1;
    }));
};

/**
 * Method 获取一个随机整数 Math.random(); 中的参数可以是一个，考虑了参数是一个的情况
 * @param min 随机数的范围的下限
 * @param max 随机数的范围的上限
 * @returns {Number}
 */
$Utils.getRandom = function (min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return parseInt(Math.random() * (max - min) + min);
};

/**
 * Method 数组冒泡排序
 * @param arr 需要排序的数组
 * @returns {*}
 */
$Utils.sortArr = function (arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        var flag = true;
        for (var j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                var tempValue = arr[j + 1];
                arr[j + 1] = arr[j];
                arr[j] = tempValue;
                flag = false;
            }
        }
        if (flag) {
            break;
        }
    }
    return arr;
};

/**
 * 获取大写人名币
 * @param val
 * @returns {string}
 */
$Utils.getChineseMoney = function (val) {
    var fraction = ['角', '分'];
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
    var head = val < 0 ? '欠' : '';
    val = Math.abs(val);
    var s = '';
    for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(val * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    val = Math.floor(val);
    for (var i = 0; i < unit[0].length && val > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && val > 0; j++) {
            p = digit[val % 10] + unit[1][j] + p;
            val = Math.floor(val / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
};

/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 * @param val
 * @returns {string}
 */
$Utils.formatCurrency = function (val) {
    val = val.toString().replace(/\$|\,/g, '');
    if (isNaN(val)) {
        val = '0';
    }
    var sign = (val == (val = Math.abs(val)));
    val = Math.floor(val * 100 + 0.50000000001);
    var cents = val % 100;
    val = Math.floor(val / 100).toString();
    if (cents < 10) {
        cents = '0' + cents;
    }
    for (var i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
        val = val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3));
    }
    return (((sign) ? '' : '-') + val + '.' + cents);
};

/**
 * 将数值四舍五入(保留1位小数)后格式化成金额形式
 * @param val
 * @returns {string}
 */
$Utils.formatCurrencyTenThou = function (val) {
    val = val.toString().replace(/\$|\,/g, '');
    if (isNaN(val)) {
        val = '0';
    }
    var sign = (val == (val = Math.abs(val)));
    val = Math.floor(val * 10 + 0.50000000001);
    var cents = val % 10;
    val = Math.floor(val / 10).toString();
    for (var i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
        val = val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3));
    }
    return (((sign) ? '' : '-') + val + '.' + cents);
};

/**
 * 获取宿主环境顶层对象
 * @returns {Object}
 */
$Utils.getGlobal = function () {
    if (typeof self !== 'undefined') {
        return self;
    }
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    throw new Error('unable to locate global object');
};

/**
 * 冻结一个对象
 * @param obj
 */
$Utils.constantize = function (obj) {
    Object.freeze(obj);
    Object.keys(obj).forEach(function (key, i) {
        if (typeof obj[key] === 'object') {
            $Utils.constantize(obj[key]);
        }
    });
};
