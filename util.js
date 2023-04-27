export default {
  /**
   * 转换成数字类型
   * @param value
   * @returns {number}
   */
  toNumber(value) {
    value = Number(value);
    return isNaN(value) ? 0 : value;
  },

  /**
   * 保留小数位数（返回字符串）
   * @param {*} value
   * @param {*} digits
   */
  toFixed(value, digits = 2) {
    if (util.isNotEmpty(value)) {
      let k = Math.pow(10, digits);
      return (
        '' +
        Number.parseFloat(
          Math.round(
            Number.parseFloat((value * k).toFixed(digits * 2)),
          ).toFixed(digits * 2),
        ) /
          k
      );
    } else {
      return '';
    }
  },

  /**
   * 获取一个字符在字符串中第几次出现的索引（num从0开始，第一次传0）
   * @param {*} value
   * @param {*} char
   * @param {*} num
   */
  findManyIndex(value, char, num = 0) {
    let index = value.indexOf(char);
    for (let i = 0; i < num; i++) {
      index = value.indexOf(char, index + 1);
    }
    return index;
  },

  /**
   * 判断是否为空
   * @param value
   * @returns {boolean}
   */
  isEmpty(value) {
    if (typeof value === 'undefined') {
      return true;
    } else if (value === null) {
      return true;
    } else if (typeof value === 'string' && value === '') {
      return true;
    } else if (typeof value === 'number' && isNaN(value)) {
      return true;
    } else if (Array.isArray(value) && value.length === 0) {
      return true;
    } else if (value instanceof Number && isNaN(value)) {
      return true;
    } else if (
      value.toString() === '[object Object]' &&
      Object.keys(value).length === 0
    ) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 判断是否为不为空
   * @param value
   * @returns {boolean}
   */
  isNotEmpty(value) {
    return !this.isEmpty(value);
  },

  /**
   * 判断是否全部为空
   * @param value
   * @returns {boolean}
   */
  everyEmpty(...value) {
    return value.every((e) => this.isEmpty(e));
  },

  /**
   * 判断是否全部不为空
   * @param value
   * @returns {boolean}
   */
  everyNotEmpty(...value) {
    return value.every((e) => this.isNotEmpty(e));
  },

  /**
   * 判断是否有一个为空
   * @param value
   * @returns {boolean}
   */
  someEmpty(...value) {
    return value.some((e) => this.isEmpty(e));
  },

  /**
   * 判断是否有一个不为空
   * @param value
   * @returns {boolean}
   */
  someNotEmpty(...value) {
    return value.some((e) => this.isNotEmpty(e));
  },

  /**
   * 字符串去空格
   * @param value
   * @returns {string}
   */
  trim(value) {
    if (this.isNotEmpty(value)) {
      return value.replace(/[\s\uFEFF\xa0\u3000]/g, '');
    } else {
      return value;
    }
  },

  /**
   * 获取人名币人名币大写
   * @param value
   * @returns {string}
   */
  getRMB(value) {
    if (this.isEmpty(value)) {
      return '';
    }
    value = value.toString();
    let head = '';
    if (value.startsWith('-')) {
      head = '负';
      value = value.substr(1);
    }
    if (value.match(/[^,.\d]/) !== null) {
      console.error('输入包含非法字符!');
      return '';
    }
    if (
      value.match(
        /^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/,
      ) === null
    ) {
      console.error('输入有误!');
      return '';
    }

    const MAXIMUM_NUMBER = 99999999999.99;
    value = value.replace(/,/g, '');
    value = value.replace(/^0+/, '');
    if (Number(value) > MAXIMUM_NUMBER) {
      console.error('数额太大，转换金额上限小于1千亿!');
      return '';
    }

    const CN_ZERO = '零';
    const CN_ONE = '壹';
    const CN_TWO = '贰';
    const CN_THREE = '叁';
    const CN_FOUR = '肆';
    const CN_FIVE = '伍';
    const CN_SIX = '陆';
    const CN_SEVEN = '柒';
    const CN_EIGHT = '捌';
    const CN_NINE = '玖';
    const CN_TEN = '拾';
    const CN_HUNDRED = '佰';
    const CN_THOUSAND = '仟';
    const CN_TEN_THOUSAND = '万';
    const CN_HUNDRED_MILLION = '亿';
    const CN_SYMBOL = '';
    const CN_DOLLAR = '元';
    const CN_TEN_CENT = '角';
    const CN_CENT = '分';
    const CN_INTEGER = '整';

    let integral;
    let decimal;
    let outputCharacters;
    let parts;
    let digits, radices, bigRadices, decimals;
    let zeroCount;
    let i, p, d;
    let quotient, modulus;

    parts = value.split('.');
    if (parts.length > 1) {
      integral = parts[0];
      decimal = parts[1];
      decimal = decimal.substr(0, 2);
    } else {
      integral = parts[0];
      decimal = '';
    }
    digits = new Array(
      CN_ZERO,
      CN_ONE,
      CN_TWO,
      CN_THREE,
      CN_FOUR,
      CN_FIVE,
      CN_SIX,
      CN_SEVEN,
      CN_EIGHT,
      CN_NINE,
    );
    radices = new Array('', CN_TEN, CN_HUNDRED, CN_THOUSAND);
    bigRadices = new Array('', CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
    decimals = new Array(CN_TEN_CENT, CN_CENT);
    outputCharacters = '';
    if (Number(integral) > 0) {
      zeroCount = 0;
      for (i = 0; i < integral.length; i++) {
        p = integral.length - i - 1;
        d = integral.substr(i, 1);
        quotient = p / 4;
        modulus = p % 4;
        if (d == '0') {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            outputCharacters += digits[0];
          }
          zeroCount = 0;
          outputCharacters += digits[Number(d)] + radices[modulus];
        }
        if (modulus == 0 && zeroCount < 4) {
          outputCharacters += bigRadices[quotient];
        }
      }
      outputCharacters += CN_DOLLAR;
    }
    if (decimal != '') {
      for (i = 0; i < decimal.length; i++) {
        d = decimal.substr(i, 1);
        if (d != '0') {
          outputCharacters += digits[Number(d)] + decimals[i];
        }
      }
    }
    if (outputCharacters == '') {
      outputCharacters = CN_ZERO + CN_DOLLAR;
    }
    if (decimal == '') {
      outputCharacters += CN_INTEGER;
    }
    outputCharacters = head + CN_SYMBOL + outputCharacters;
    return outputCharacters;
  },

  /**
   * 千分位转换
   * @param {*} value（要格式化的值）
   * @param {*} decimals（保留几位小数，默认2位）
   * @param {*} decPoint（小数点符号，默认.）
   * @param {*} thousandsSep（千分位符号，默认,）
   * @param {*} roundtag（舍入参数，'ceil'向上取，'floor'向下取，'round'四舍五入，默认round）
   * @returns {string}
   */
  getCurrency(value, decimals, decPoint, thousandsSep, roundtag) {
    if (this.isNotEmpty(value)) {
      value = (value + '').replace(/[^0-9+-Ee.]/g, '');
      roundtag = roundtag || 'round';
      let n = !isFinite(+value) ? 0 : +value,
        prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
        dec = typeof decPoint === 'undefined' ? '.' : decPoint,
        sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep,
        s = '',
        toFixedFix = (n, prec) => {
          let k = Math.pow(10, prec);
          return (
            '' +
            parseFloat(
              Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(
                prec * 2,
              ),
            ) /
              k
          );
        };
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
      const re = /(-?\d+)(\d{3})/;
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, '$1' + sep + '$2');
      }

      if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
      }
      return s.join(dec);
    } else {
      return '';
    }
  },

  /**
   * 获取HashCode
   * @param {*} value
   * @returns {string}
   */
  getHashCode: (function () {
    function pad(hash, len) {
      while (hash.length < len) {
        hash = '0' + hash;
      }
      return hash;
    }

    function fold(hash, text) {
      var i;
      var chr;
      var len;
      if (text.length === 0) {
        return hash;
      }
      for (i = 0, len = text.length; i < len; i++) {
        chr = text.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
      }
      return hash < 0 ? hash * -2 : hash;
    }

    function foldObject(hash, o, seen) {
      return Object.keys(o).sort().reduce(foldKey, hash);
      function foldKey(hash, key) {
        return foldValue(hash, o[key], key, seen);
      }
    }

    function foldValue(input, value, key, seen) {
      var hash = fold(fold(fold(input, key), toString(value)), typeof value);
      if (value === null) {
        return fold(hash, 'null');
      }
      if (value === undefined) {
        return fold(hash, 'undefined');
      }
      if (typeof value === 'object') {
        if (seen.indexOf(value) !== -1) {
          return fold(hash, '[Circular]' + key);
        }
        seen.push(value);
        return foldObject(hash, value, seen);
      }
      return fold(hash, value.toString());
    }

    function toString(o) {
      return Object.prototype.toString.call(o);
    }
    return (value) => {
      return pad(foldValue(0, value, '', []).toString(16), 8);
    };
  })(),

  /**
   * 获取字符串字节数
   * @param value
   * @param charset {GBK, UTF-8, UTF-16}
   * @returns {number}
   */
  getByteLength(value, charset = 'UTF-16') {
    if (this.isEmpty(value)) {
      value = value.toString();
      charset = charset.toUpperCase();
      var byteLength = 0;
      if (charset === 'GBK') {
        const reg = /[\u4e00-\u9fa5]/;
        for (let i = 0, len = value.length; i < len; i++) {
          if (!reg.test(value[i])) {
            byteLength += 1;
          } else {
            byteLength += 2;
          }
        }
      } else if (charset === 'UTF-8') {
        for (let i = 0, len = value.length; i < len; i++) {
          let charCode = value.charCodeAt(i);
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
        for (let i = 0, len = value.length; i < len; i++) {
          let charCode = value.charCodeAt(i);
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

  /**
   * 判断一个集合（数组）是否包含另一个集合（数组）的所有元素
   * @param allArray
   * @param subArray
   * @returns {boolean}
   */
  includeAll(allArray, subArray) {
    return subArray.every((e) => allArray.includes(e));
  },

  /**
   * 浮点数比较
   * @param value
   * @param other
   * @returns {boolean}
   */
  floatEqual(value, other) {
    value = Number(value);
    other = Number(other);
    if (isNaN(value) || isNaN(other)) {
      return false;
    } else {
      return Math.abs(value - other) < Number.EPSILON * Math.pow(2, 2);
    }
  },

  /**
   * 复制属性方法
   * @param target
   * @param source
   * @returns {object}
   */
  copyProperties(target, source) {
    if (!target || !source) {
      return target;
    }
    for (let e in target) {
      target[e] = e in source ? source[e] : target[e];
    }
    return target;
  },

  /**
   * 深度复制对象
   * @param {*} source
   * @param {*} target
   * @returns {object}
   */
  copyDeep(source, target = {}) {
    if (
      ['[object Object]', '[object Array]'].includes(
        Object.prototype.toString.call(source),
      )
    ) {
      for (let i in source) {
        if (source.hasOwnProperty(i)) {
          if (
            ['[object Object]', '[object Array]'].includes(
              Object.prototype.toString.call(source[i]),
            )
          ) {
            target[i] = Array.isArray(source[i]) ? [] : {};
            this.copyDeep(source[i], target[i]);
          } else {
            target[i] = source[i];
          }
        }
      }
      return target;
    } else {
      return source;
    }
  },

  /**
   * 深度克隆对象
   * @param {*} source
   * @returns {object}
   */
  cloneDeep(source) {
    if (
      ['[object Object]', '[object Array]'].includes(
        Object.prototype.toString.call(source),
      )
    ) {
      let result = source.constructor();
      for (let i in source) {
        if (source.hasOwnProperty(i)) {
          result[i] = ['[object Object]', '[object Array]'].includes(
            Object.prototype.toString.call(source),
          )
            ? this.cloneDeep(source[i])
            : source[i];
        }
      }
      return result;
    } else {
      return source;
    }
  },

  /**
   * 对象继承
   * @param target
   * @param source
   */
  extend(target, source) {
    //目的：需要实现只继承父类的原型对象
    //1 需要创建一个空函数  目的： 中转
    let F = new Function();
    //2 实现空函数的原型对象和超类的原型对象转换
    F.prototype = source.prototype;
    //3 原型继承
    target.prototype = new F();
    //4 还原子类的构造器
    target.prototype.constructor = target;
    // 保存父类的原型对象 目的：一方面方便解耦； 另一方面可以轻松的获得父类的原型对象
    //5 自定义一个子类的静态属性接收父类的原型对象
    target.superClass = source.prototype;
    //6 为防止父类的constructor属性的设置落下，在extend()方法中加保险
    if (source.prototype.constructor == Object.prototype.constructor) {
      //手动的还原原型对象的构造器
      source.prototype.constructor = source;
    }
  },

  /**
   * 深度封闭对象
   * @param obj
   * @return {object}
   */
  sealDeep(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    // 取回定义在obj上的属性名
    let propNames = Object.getOwnPropertyNames(obj);
    // 在冻结自身之前封闭属性
    propNames.forEach((e) => {
      let prop = obj[e];
      // 如果prop是个对象，封闭它
      if (typeof prop === 'object' && prop !== null) {
        this.sealDeep(prop);
      }
    });
    // 封闭自身(no-op if already frozen)
    return Object.seal(obj);
  },

  /**
   * 深度冻结对象
   * @param obj
   * @return {object}
   */
  freezeDeep(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    // 取回定义在obj上的属性名
    let propNames = Object.getOwnPropertyNames(obj);
    // 在冻结自身之前冻结属性
    propNames.forEach((e) => {
      let prop = obj[e];
      // 如果prop是个对象，冻结它
      if (typeof prop === 'object' && prop !== null) {
        this.freezeDeep(prop);
      }
    });
    // 冻结自身(no-op if already frozen)
    return Object.freeze(obj);
  },

  /**
   * 获取元素属性
   * @param element
   * @param attr
   * @returns {string}
   */
  getAttribute(element, attr) {
    return element.currentStyle
      ? element.currentStyle[attr]
      : window.getComputedStyle(element, null)[attr];
  },

  /**
   * 获取元素样式
   * @param element
   * @param cssRule
   * @returns {string}
   */
  getStyle(element, cssRule) {
    let strValue = '';
    if (document.defaultView && document.defaultView.getComputedStyle) {
      strValue = document.defaultView
        .getComputedStyle(element, '')
        .getPropertyValue(cssRule);
    } else if (element.currentStyle) {
      cssRule = cssRule.replace(/\-(\w)/g, (match, p1) => {
        return p1.toUpperCase();
      });
      strValue = element.currentStyle[cssRule];
    }
    return strValue;
  },

  /**
   * 添加元素Class
   * @param element
   * @param value
   */
  addClass(element, value) {
    let classList = element.className.split(' ');
    if (classList.indexOf(value) > -1) {
      return;
    }
    classList.push(value);
    element.className = classList.join(' ');
  },

  /**
   * 删除元素Class
   * @param element
   * @param value
   */
  removeClass(element, value) {
    let classList = element.className.split(' ');
    let index = classList.indexOf(value);
    if (index < 0) {
      return;
    }
    classList.splice(index, 1);
    element.className = classList.join(' ');
  },

  /**
   * 替换元素Class
   * @param element
   * @param oldStr
   * @param newStr
   */
  replaceClass(element, oldStr, newStr) {
    element.className = element.className.replace(oldStr, newStr);
  },

  /**
   * 添加事件绑定
   * @param element
   * @param event
   * @param handler
   */
  addEvent: (function () {
    if (document.addEventListener) {
      return (element, event, handler) => {
        element.addEventListener(event, handler, false);
      };
    } else if (document.attachEvent) {
      return (element, event, handler) => {
        element.attachEvent('on' + event, handler);
      };
    } else {
      return (element, event, handler) => {
        element['on' + event] = handler;
      };
    }
  })(),

  /**
   * 移除事件绑定
   * @param element
   * @param event
   * @param handler
   */
  removeEvent: (function () {
    if (document.removeEventListener) {
      return (element, event, handler) => {
        element.removeEventListener(event, handler, false);
      };
    } else if (document.detachEvent) {
      return (element, event, handler) => {
        element.detachEvent('on' + event, handler);
      };
    } else {
      return (element, event, handler) => {
        element['on' + event] = null;
      };
    }
  })(),

  /**
   * 获取事件冒泡路径，兼容ie11,edge,chrome,firefox,safari
   * @param evt
   * @returns {*}
   */
  getEventPath(evt) {
    const path = evt.path || (evt.composedPath && evt.composedPath()),
      target = evt.target;
    if (this.isNotEmpty(path) && Array.isArray(path) && path.length > 0) {
      return path.indexOf(window) < 0 ? path.concat(window) : path;
    }

    if (target === window) {
      return [window];
    }

    function getParents(node, memo) {
      memo = memo || [];
      const parentNode = node.parentNode;

      if (!parentNode) {
        return memo;
      } else {
        return getParents(parentNode, memo.concat(parentNode));
      }
    }

    return [target].concat(getParents(target), window);
  },

  /**
   * 获取Event
   * @param event
   * @returns {object}
   */
  getEvent(event) {
    return event ? event : window.event;
  },

  /**
   * 获取事件来源
   * @param event
   * @returns {object}
   */
  getTarget(event) {
    return event.target || event.srcElement;
  },

  /**
   * 派发一个键盘事件
   * @param {*} el
   * @param {*} type
   * @param {*} keyCode
   */
  dispatchKeyEvent(el, type, keyCode) {
    let evtObj;
    if (document.createEvent) {
      if (window.KeyEvent) {
        //firefox 浏览器下模拟事件
        evtObj = document.createEvent('KeyEvents');
        evtObj.initKeyEvent(
          type,
          true,
          true,
          window,
          true,
          false,
          false,
          false,
          keyCode,
          0,
        );
      } else {
        //chrome 浏览器下模拟事件
        evtObj = document.createEvent('UIEvents');
        evtObj.initUIEvent(type, true, true, window, 1);

        delete evtObj.keyCode;
        if (typeof evtObj.keyCode === 'undefined') {
          //为了模拟keycode
          Object.defineProperty(evtObj, 'keyCode', { value: keyCode });
        } else {
          evtObj.key = String.fromCharCode(keyCode);
        }

        if (typeof evtObj.ctrlKey === 'undefined') {
          //为了模拟ctrl键
          Object.defineProperty(evtObj, 'ctrlKey', { value: true });
        } else {
          evtObj.ctrlKey = true;
        }
      }
      el.dispatchEvent(evtObj);
    } else if (document.createEventObject) {
      //IE 浏览器下模拟事件
      evtObj = document.createEventObject();
      evtObj.keyCode = keyCode;
      el.fireEvent('on' + type, evtObj);
    }
  },

  /**
   * 阻止默认行为
   * @param {*} event
   */
  preventDefault(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },

  /**
   * 阻止事件传播
   * @param event
   */
  stopPropagation(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  },

  /**
   * 下载文件
   * @param url
   * @param fileName
   */
  download(url, fileName = '') {
    let isChrome = this.getBrowser().versions.chrome;
    if (isChrome) {
      let a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
    } else {
      window.open(url);
    }
  },

  /**
   * 打开新窗口
   * @param url
   * @param title
   * @param w
   * @param h
   */
  openWindow(url, title, w, h) {
    // Fixes dual-screen position Most browsers       Firefox
    let dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : screen.left;
    let dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : screen.top;

    let width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width;
    let height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height;

    let left = width / 2 - w / 2 + dualScreenLeft;
    let top = height / 2 - h / 2 + dualScreenTop;
    let newWindow = window.open(
      url,
      title,
      'titlebar=yes, toolbar=yes, menubar=yes, scrollbars=yes, location=yes, directories=yes, status=yes, resizable=yes, width=' +
        w +
        ', height=' +
        h +
        ', top=' +
        top +
        ', left=' +
        left,
    );

    // Puts focus on the newWindow
    if (window.focus) {
      newWindow.focus();
    }
  },

  /**
   * 设置垂直滚动高度
   * @param {*} el
   * @param {number} [from=0]
   * @param {*} to
   * @param {number} [duration=500]
   * @param {*} endCallback
   */
  scrollTop(el, from = 0, to, duration = 500, endCallback) {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame =
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          return window.setTimeout(callback, 1000 / 60);
        };
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil((difference / duration) * 50);

    function scroll(start, end, step) {
      if (start === end) {
        endCallback && endCallback();
        return;
      }

      let d = start + step > end ? end : start + step;
      if (start > end) {
        d = start - step < end ? end : start - step;
      }

      if (el === window) {
        window.scrollTo(d, d);
      } else {
        el.scrollTop = d;
      }
      window.requestAnimationFrame(() => scroll(d, end, step));
    }
    scroll(from, to, step);
  },

  /**
   * 获取宿主环境顶层对象
   * @returns {object}
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
   * 获取浏览器信息
   * @returns {object}
   */
  getBrowser() {
    let operatingSystem = '';
    let agent = navigator.userAgent.toLowerCase();
    if (/macintosh|mac os x/i.test(agent)) {
      operatingSystem = 'mac';
    } else if (agent.indexOf('win32') >= 0 || agent.indexOf('wow32') >= 0) {
      operatingSystem = '32';
    } else if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) {
      operatingSystem = '64';
    }
    return {
      navigator: navigator,
      appVersion: navigator.appVersion,
      userAgent: navigator.userAgent,
      language: (navigator.browserLanguage || navigator.language).toLowerCase(),
      versions: (function () {
        let u = navigator.userAgent;
        return {
          trident: u.includes('Trident'), //IE内核
          presto: u.includes('Presto'), //opera内核
          webKit: u.includes('AppleWebKit'), //苹果、谷歌内核
          gecko: u.includes('Gecko') && !u.includes('KHTML'), //火狐内核
          ie: window.ActiveXObject || 'ActiveXObject' in window, //是否为IE
          edge: u.includes('Edge'), //是否为Edge
          opera: u.includes('Opera'), //是否为Opera
          firefox: u.includes('Firefox'), //是否为Firefox
          safari: u.includes('Safari') && !u.includes('Chrome'), //是否为Safari
          chrome:
            u.includes('Chrome') && u.includes('Safari') && !u.includes('Edge'), //是否为Chrome
          win: u.includes('Win'), //是否为Windows
          mac: u.includes('Mac'), //是否为Mac
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //是否为ios终端
          android: u.includes('Android') || u.includes('Adr'), //是否为android终端
          iPhone: u.includes('iPhone'), //是否为iPhone或者QQHD浏览器
          iPad: u.includes('iPad'), //是否为iPad
          webApp: !u.includes('Safari'), //是否为web应用程序，没有头部与底部
          weChat: u.includes('MicroMessenger'), //是否为微信
          alipay: u.includes('AlipayClient'), //是否为支付宝
          weibo: u.includes('Weibo'), //是否为微博
          dingTalk: u.includes('DingTalk'), //是否为钉钉
          govDingTalk: u.includes('TaurusApp') || u.includes('saas'), //是否为政务钉钉
          qq: !!u.match(/QQ\//i), //是否为QQ
          operatingSystem: operatingSystem, // 电脑操作系统 32/64/mac
        };
      })(),
    };
  },

  /**
   * 获取所有的参数
   * @returns {*}
   */
  getAllParams() {
    let query = window.location.search.substring(1);
    let entries = query.split('&');
    return Array.prototype.reduce.call(
      entries,
      function (obj, item) {
        var param = item.split('=');
        obj[param[0]] = param[1];
        return obj;
      },
      {},
    );
  },

  /**
   * 获取所有的URL参数
   * @param {*} url
   * @returns {object}
   */
  getUrlParams(url) {
    // 用JS拿到URL，如果函数接收了URL，那就用函数的参数。如果没传参，就使用当前页面的URL
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    // 用来存储我们所有的参数
    var obj = {};
    // 如果没有传参，返回一个空对象
    if (!queryString) {
      return obj;
    }
    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];
    // 将参数分成数组
    var arr = queryString.split('&');
    for (var i = 0; i < arr.length; i++) {
      // 分离成key:value的形式
      var a = arr[i].split('=');
      // 将undefined标记为true
      var paramName = a[0];
      var paramValue = typeof a[1] === 'undefined' ? true : a[1];
      // 如果paramName以方括号结束, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {
        // 如果paramName不存在，则创建key
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) {
          obj[key] = [];
        }
        // 如果是索引数组 e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // 获取索引值并在对应的位置添加值
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // 如果是其它的类型，也放到数组中
          obj[key].push(paramValue);
        }
      } else {
        // 处理字符串类型
        if (!obj[paramName]) {
          // 如果如果paramName不存在，则创建对象的属性
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string') {
          // 如果属性存在，并且是个字符串，那么就转换为数组
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // 如果是其它的类型，还是往数组里丢
          obj[paramName].push(paramValue);
        }
      }
    }
    return obj;
  },

  /**
   * 获取指定的URL参数
   * @param {*} key
   * @returns {string}
   */
  getUrlParam(key) {
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    var r = window.location.search.substring(1).match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    } else {
      return null;
    }
  },

  /**
   * 拼接参数
   * @param {*} url
   * @param {*} params
   * @returns
   */
  parseParams(url, params = {}) {
    const paramsArray = [];
    Object.keys(params).forEach(
      (key) => params[key] && paramsArray.push(`${key}=${params[key]}`),
    );
    if (url.search(/\?/) === -1) {
      url += `?${paramsArray.join('&')}`;
    } else {
      url += `&${paramsArray.join('&')}`;
    }
    return url;
  },

  /**
   * 获取日期时间信息
   * @param value
   * @returns {object}
   */
  getDateInfo(value) {
    let date, year, month, week, day, hours, minutes, seconds, time;
    if (typeof value === 'string') {
      value = value.replace(/-/g, '/');
    }
    date = this.isNotEmpty(value) ? new Date(value) : new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    month = month > 9 ? month : `0${month}`;
    week = date.getDay();
    day = date.getDate();
    day = day > 9 ? day : `0${day}`;
    hours = date.getHours();
    hours = hours > 9 ? hours : `0${hours}`;
    minutes = date.getMinutes();
    minutes = minutes > 9 ? minutes : `0${minutes}`;
    seconds = date.getSeconds();
    seconds = seconds > 9 ? seconds : `0${seconds}`;
    time = date.getTime();
    return (function () {
      return {
        date: date,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        week: week,
        day: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        dateInfo: `${year}-${month}-${day}`,
        timeInfo: `${hours}:${minutes}:${seconds}`,
        dateTimeInfo: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
        time: time,
      };
    })();
  },

  /**
   * 获取应用路径
   * @returns {string}
   */
  getBasePath() {
    return (
      window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port ? ':' + window.location.port : '')
    );
  },

  /**
   * 获取应用上下文路径
   * 例如：http://localhost:3000/orange/#/index 返回 '/orange/'
   * @returns {string}
   */
  getContextPath() {
    let pathName = window.location.pathname;
    let index = pathName.substr(1).indexOf('/');
    let result = pathName.substr(0, index + 1);
    return result + '/';
  },

  /**
   * 获取一个随机数
   * @param min 最小值
   * @param max 最大值
   * @returns {number}
   */
  getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  /**
   * 获取一个随机颜色
   * @param min 最小值
   * @param max 最大值
   * @returns {string}
   */
  getRandomColor(min, max) {
    let r = this.getRandomNum(min, max);
    let g = this.getRandomNum(min, max);
    let b = this.getRandomNum(min, max);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  },

  /**
   * 生成短Id
   * @returns {number}
   */
  generateShortId() {
    return parseInt(Math.random() * 1e10);
  },

  /**
   * 生成UUID
   * @returns {string}
   */
  generateUUID() {
    let s = [];
    let hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';
    let uuid = s.join('');
    return uuid.replace(/-/g, '');
  },

  /**
   * 生成GUID
   * @returns {function}
   */
  generateGUID: (function () {
    let counter = 0;
    return function (prefix = '') {
      counter = counter % (32 * 3);
      let guid = new Date().getTime().toString(32);

      for (let i = 0; i < 5; i++) {
        guid += Math.floor(Math.random() * 65535).toString(32);
      }

      return prefix + guid + (counter++).toString(32);
    };
  })(),

  /**
   * 生成错误文本
   * @param {*} filename
   * @param {*} value
   */
  generateText(filename, value) {
    let element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(value),
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    element.click();
  },

  /**
   * RGB颜色转换成十六进制颜色
   * @param {*} value
   * @returns
   */
  rgbToHex(value) {
    //十六进制颜色值的正则表达式
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是rgb颜色表示
    if (/^(rgb|RGB)/.test(value)) {
      let aColor = value.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
      let strHex = '#';
      for (let i = 0; i < aColor.length; i++) {
        let hex = Number(aColor[i]).toString(16);
        if (hex.length < 2) {
          hex = '0' + hex;
        }
        strHex += hex;
      }
      if (strHex.length !== 7) {
        strHex = value;
      }
      return strHex;
    } else if (reg.test(value)) {
      let aNum = value.replace(/#/, '').split('');
      if (aNum.length === 6) {
        return value;
      } else if (aNum.length === 3) {
        let numHex = '#';
        for (let i = 0; i < aNum.length; i += 1) {
          numHex += aNum[i] + aNum[i];
        }
        return numHex;
      }
    }
    return value;
  },

  /**
   * 十六进制颜色转换成RGB颜色
   * @param {*} value
   * @returns
   */
  hexToRGA(value) {
    let sColor = String(value).toLowerCase();
    //十六进制颜色值的正则表达式
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = '#';
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      //处理六位的颜色值
      let sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
      }
      return 'RGB(' + sColorChange.join(',') + ')';
    }
    return sColor;
  },

  /**
   * 加载脚本
   * @param {*} files ['http://127.0.0.1:3000/a.js', 'http://127.0.0.1:3000/b.js'];
   * @param {*} callback
   */
  loadJS(files, callback) {
    // 获取head标签
    const head = document.getElementsByTagName('head')[0];

    Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          // 创建script标签并添加到head
          const s = document.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.src = file;
          // 监听load事件，如果加载完成则resolve
          s.addEventListener('load', () => resolve(), false);
          head.appendChild(s);
        });
      }),
    ).then(callback); // 所有均完成，执行用户的回调事件
  },

  /**
   * 是否为JSON字符串
   * @param {*} str
   * @returns
   */
  isJSON(str) {
    if (typeof str === 'string') {
      try {
        let obj = JSON.parse(str);
        if (typeof obj === 'object' && obj) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.error('error：' + str + '!!!' + err);
        return false;
      }
    }
  },

  /**
   * 元素是否在视口内
   * @param {*} element
   * @returns
   */
  isInViewPort(element) {
    if (element) {
      const viewWidth =
        window.innerWidth || document.documentElement.clientWidth;
      const viewHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const { top, right, bottom, left } = element.getBoundingClientRect();
      return (
        top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight
      );
    } else {
      return false;
    }
  },

  /**
   * 函数缓存
   * @param {*} resultFn
   * @param {*} isEqual
   * @returns
   */
  memoize(resultFn, isEqual) {
    /**
     * 比较方法
     */
    function areInputsEqual(newInputs, lastInputs) {
      if (newInputs.length !== lastInputs.length) {
        return false;
      }
      for (let i = 0; i < newInputs.length; i++) {
        if (newInputs[i] !== lastInputs[i]) {
          return false;
        }
      }
      return true;
    }

    if (isEqual === void 0) {
      isEqual = areInputsEqual;
    }
    let lastThis;
    let lastArgs = [];
    let lastResult;
    let calledOnce = false;

    function memoized() {
      let newArgs = [];
      for (let _i = 0; _i < arguments.length; _i++) {
        newArgs[_i] = arguments[_i];
      }
      if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
        return lastResult;
      }
      lastResult = resultFn.apply(this, newArgs);
      calledOnce = true;
      lastThis = this;
      lastArgs = newArgs;
      return lastResult;
    }

    return memoized;
  },
};
