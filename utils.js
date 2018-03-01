var Util = {};

/**
 * 字符串工具方法
 * @type {{trim, getByteLength}}
 */
Util.strUtil = (function () {
  return {
    /**
     * 字符串去空格
     * @param val
     * @returns {*}
     */
    trim(val) {
      if (Boolean(val)) {
        return val.replace(/[\s\uFEFF\xa0\u3000]/g, '');
      } else {
        return val;
      }
    },
    /**
     * 获取字符串字节数
     * @param str
     * @param charset
     * @returns {number}
     */
    getByteLength(val, charset = 'UTF-16') {
      if (Boolean(val)) {
        val = val.toString();
        charset = charset.toUpperCase();
        var byteLength = 0;
        if (charset === 'GBK') {
          const reg = /[\u4e00-\u9fa5]/;
          for (let i = 0, len = val.length; i < len; i++) {
            if (!reg.test(val[i])) {
              byteLength += 1;
            } else {
              byteLength += 2;
            }
          }
        } else if (charset === 'UTF-8') {
          for (let i = 0, len = val.length; i < len; i++) {
            let charCode = val.charCodeAt(i);
            if (charCode <= 0x007f) {
              byteLength += 1;
            } else if (charCode <= 0x07ff) {
              byteLength += 2;
            } else if (charCode <= 0xffff) {
              byteLength += 3;
            } else {
              byteLength += 4;
            }
          }
        } else {
          for (let i = 0, len = val.length; i < len; i++) {
            let charCode = val.charCodeAt(i);
            if (charCode <= 0xffff) {
              byteLength += 2;
            } else {
              byteLength += 4;
            }
          }
        }
        return byteLength;
      } else {
        return 0;
      }
    },
  };
})();

/**
 * Object工具方法
 * @type {{isEmpty, isNotEmpty, getGlobal, copyProperties, extend, constantize, iteratorEntries}}
 */
Util.objectUtil = (function () {
  return {
    /**
     * 判断是否为空
     * @param val
     * @returns {boolean}
     */
    isEmpty(val) {
      if (typeof val === 'undefined') {
        return true;
      } else if (val === null) {
        return true;
      } else if (typeof val === 'string' && val === '') {
        return true;
      } else if (typeof val === 'number' && isNaN(val)) {
        return true;
      } else if (typeof val === 'object' && Object.keys(val).length === 0) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 判断是否不为空
     * @param val
     * @returns {boolean}
     */
    isNotEmpty(val) {
      return !this.isEmpty(val);
    },
    /**
     * 获取宿主环境顶层对象
     * @returns {*}
     */
    getGlobal() {
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
    },
    /**
     * 复制属性
     * @param target
     * @param source
     * @returns {{}}
     */
    copyProperties(target = {}, source = {}) {
      Object.keys(target).forEach(e => {
        target[e] = this.isNotEmpty(source[e]) ? source[e] : target[e];
      });
      return target;
    },
    /**
     * 继承
     * @param sub
     * @param sup
     */
    extend(sub = {}, sup = {}) {
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
      //5 自定义一个子类的静态属性接收父类的原型对象
      sub.superClass = sup.prototype;
      //6 为防止父类的constructor属性的设置落下，在extend()方法中加保险
      if (sup.prototype.constructor == Object.prototype.constructor) {
        //手动的还原原型对象的构造器
        sup.prototype.constructor = sup;
      }
    },
    /**
     * 冻结对象
     * @param obj
     */
    constantize(obj) {
      Object.freeze(obj);
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object') {
          this.constantize(obj[key]);
        }
      });
    },
    /**
     * 部署Iterator接口（使对象具有for of循环的能力）
     * @param obj
     */* iteratorEntries(obj) {
      for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
      }
    }
  };
})();

/**
 * 事件工具方法
 * @type {{addSeveralEvent, addEvent, removeEvent}}
 */
Util.eventUtil = (function () {
  return {
    /**
     * 给一个元素同时多个事件
     * @param element
     * @param eventName
     * @param fn
     */
    addSeveralEvent(element, eventName, fn) {
      var oddEvent = element['on' + eventName];
      if (oddEvent == null) {
        element['on' + eventName] = fn;
      } else {
        element['on' + eventName] = function () {
          oddEvent();
          fn();
        }
      }
    },
    /**
     * 添加事件
     * @param element
     * @param eventName
     * @param fn
     */
    addEvent(element, eventName, fn) {
      if (element.addEventListener) {
        element.addEventListener(eventName, fn, false);
      } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, fn);
      } else {
        element['on' + eventName] = fn;
      }
    },
    /**
     * 移除事件
     * @param element 需要绑定事件的元素 Dom Object
     * @param eventName 需要绑定的事件类型名称 string
     * @param fn 回调函数 function
     */
    removeEvent(element, eventName, fn) {
      if (element.removeEventListener) {
        element.removeEventListener(eventName, fn, false);
      } else if (element.attachEvent) {
        element.detachEvent('on' + eventName, fn);
      } else {
        element['on' + eventName] = null;
      }
    }
  };
})();

/**
 * DOM元素工具方法
 * @type {{getAttrValue, replaceClassName, getInnerText, setInnerText, getNextElement, getPreviousElement, getFirstElement, getLastElement}}
 */
Util.elementUtil = (function () {
  return {
    /**
     * 获取元素属性
     * @param element
     * @param attr
     * @returns {string}
     */
    getAttrValue(element, attr) {
      return element.currentStyle ? element.currentStyle[attr] : window.getComputedStyle(element, null)[attr];
    },
    /**
     * 替换字符串，设置className属性
     * @param element
     * @param oldStr
     * @param newStr
     */
    replaceClassName(element, oldStr, newStr) {
      element.className = element.className.replace(oldStr, newStr);
    },
    /**
     * 获取DOM元素内部文本
     * @param element
     * @returns {*}
     */
    getInnerText(element) {
      if (typeof element.innerText === 'string') {
        return element.innerText;
      } else {
        return element.textContent;
      }
    },
    /**
     * 设置DOM元素内部文本
     * @param element
     * @param content
     */
    setInnerText(element, content) {
      if (typeof element.innerText === 'string') {
        element.innerText = content;
      } else {
        element.textContent = content;
      }
    },
    /**
     * 获取元素的下一个兄弟元素
     * @param element
     * @returns {Element | null}
     */
    getNextElement(element) {
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
     * 获取元素的上一个兄弟元素
     * @param element
     * @returns {*}
     */
    getPreviousElement(element) {
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
     * 获取元素的第一个子元素的方法
     * @param element
     * @returns {*}
     */
    getFirstElement(element) {
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
     * 获取元素的最后一个子元素的方法
     * @param element DOM元素
     * @returns {*}
     */
    getLastElement(element) {
      if (element.lastElementChild) {
        return element.lastElementChild;
      } else {
        var last = element.lastChild;
        if (last && 1 !== last.nodeType) {
          last = last.previousSibling;
        }
        return last;
      }
    }
  };
})();

/**
 * 浏览器工具方法
 * @type {{getInfo, getBasePath, getUrlParameters}}
 */
Util.browserUtil = (function () {
  return {
    /**
     * 获取浏览器信息
     * @returns {{navigator: Navigator | WorkerNavigator, appVersion: string, userAgent: string, language: string, versions: {trident, presto, webKit, gecko, mobile, ios, android, iPhone, iPad, webApp, weChat, alipay, weibo, dingTalk, qq}}}
     */
    getInfo() {
      return {
        navigator: navigator,
        appVersion: navigator.appVersion,
        userAgent: navigator.userAgent,
        language: (navigator.browserLanguage || navigator.language).toLowerCase(),
        versions: (function () {
          let u = navigator.userAgent;
          return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
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
            qq: u.match(/QQ\//i) === 'QQ/' //是否为QQ
          };
        })()
      };
    },
    /**
     * 获取网站根路径
     * @returns {string}
     */
    getBasePath() {
      return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/';
    },
    /**
     * 获取URL参数
     * @returns {*}
     */
    getUrlParameters() {
      var query = location.search.substring(1);
      var entries = query.split('&');
      return Array.prototype.reduce.call(entries, function (obj, item) {
        var param = item.split('=');
        obj[param[0]] = param[1];
        return obj;
      }, {});
    }
  };
})();

/**
 * 格式化工具方法
 */
Util.formatterUtil = (function () {
  return {
    formatterRMB(val = '') {
      const fraction = ['角', '分'];
      const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
      const head = val < 0 ? '（负数）' : '';
      val = Math.abs(val);
      var str = '';
      for (let i = 0; i < fraction.length; i++) {
        str += (digit[Math.floor(val * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
      }
      str = str || '整';
      val = Math.floor(val);
      for (let i = 0; i < unit[0].length && val > 0; i++) {
        var p = '';
        for (let j = 0; j < unit[1].length && val > 0; j++) {
          p = digit[val % 10] + unit[1][j] + p;
          val = Math.floor(val / 10);
        }
        str = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + str;
      }
      return head + str.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    },
    formatterCurrency(val, dec = 2) {
      val = val.toString().replace(/\$|\,/g, '');
      if (isNaN(val)) {
        val = '0';
      }
      var decLen = Math.pow(10, dec);
      var sign = (val == (val = Math.abs(val)));
      val = Math.floor(val * decLen + 0.50000000001);
      var cents = val % decLen;
      val = Math.floor(val / decLen).toString();
      if (cents < 10) {
        cents = '0' + cents;
      }
      for (let i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
        val = val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3));
      }
      return (((sign) ? '' : '-') + val + '.' + cents);
    }
  };
})();

/**
 * 日期工具方法
 * @type {{getCurrentDateInfo}}
 */
Util.dateUtil = (function () {
  return {
    /**
     * 获取当前日期时间信息
     * @returns {{currentDate, currentYear, currentMonth, currentWeek, currentDay, currentHours, currentMinutes, currentSeconds, currentDateInfo, currentDateTimeInfo, currentTime}}
     */
    getCurrentDateInfo() {
      var currentDate, currentYear, currentMonth, currentWeek, currentDay, currentHours, currentMinutes, currentSeconds,
        currentTime;
      currentDate = new Date();
      currentYear = currentDate.getFullYear();
      currentMonth = currentDate.getMonth() + 1;
      currentMonth = (currentMonth > 9) ? currentMonth : `0${currentMonth}`;
      currentWeek = currentDate.getDay();
      currentDay = currentDate.getDate();
      currentDay = (currentDay > 9) ? currentDay : `0${currentDay}`;
      currentHours = currentDate.getHours();
      currentHours = (currentHours > 9) ? currentHours : `0${currentHours}`;
      currentMinutes = currentDate.getMinutes();
      currentMinutes = (currentMinutes > 9) ? currentMinutes : `0${currentMinutes}`;
      currentSeconds = currentDate.getSeconds();
      currentSeconds = (currentSeconds > 9) ? currentSeconds : `0${currentSeconds}`;
      currentTime = currentDate.getTime();
      return (function () {
        return {
          currentDate: currentDate,
          currentYear: currentDate.getFullYear(),
          currentMonth: currentDate.getMonth() + 1,
          currentWeek: currentWeek,
          currentDay: currentDate.getDate(),
          currentHours: currentHours,
          currentMinutes: currentMinutes,
          currentSeconds: currentSeconds,
          currentDateInfo: `${currentYear}-${currentMonth}-${currentDay}`,
          currentDateTimeInfo: `${currentYear}-${currentMonth}-${currentDay} ${currentHours}:${currentMinutes}:${currentSeconds}`,
          currentTime: currentTime
        };
      })();
    }
  };
})();
