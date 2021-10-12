/**
 *多叉树
 * @class Tree
 */
export class Tree {
  static defaultProps = {
    id: 'code',
    label: 'name',
    pid: 'pcode',
    children: 'children',
  };

  constructor(obj) {
    for (let e in obj) {
      this[e] = obj[e];
    }
  }

  /**
   * 获取树形数据
   */
  static getTree(array, props = Tree.defaultProps, sort = true) {
    array = _.cloneDeep(array);
    let { id, label, pid, children } = props;
    let buffer = array.reduce((collect, e, i, arr) => {
      let tree = new Tree(e);
      tree[id] = e[id];
      tree[label] = e[label];
      tree[children] = e[children] || [];
      arr[i] = tree;
      collect[e[id]] = tree;
      return collect;
    }, {});
    array.forEach((e) => {
      let parent = buffer[e[pid]];
      parent && parent[children].push(e);
    });
    let compareToIgnoreCase = (a, b) => {
      let idA = String(a[id]).toUpperCase();
      let idB = String(b[id]).toUpperCase();
      if (idA < idB) {
        return -1;
      }
      if (idA > idB) {
        return 1;
      }
      return 0;
    };
    let result = array.filter((e) => {
      if (e[children].length > 0 && sort) {
        e[children].sort(compareToIgnoreCase);
      }
      return !e[pid] || !buffer.hasOwnProperty(e[pid]);
    });
    return !sort ? result : result.sort(compareToIgnoreCase);
  }

  /**
   * 获取平形数据
   */
  static getArray(tree, props, hasChildren = false) {
    tree = _.cloneDeep(tree);
    let temp = [...tree];
    let result = [];
    while (temp.length > 0) {
      let first = temp.shift();
      result.push(first);
      if (first[props.children] && first[props.children].length > 0) {
        if (hasChildren) {
          temp = first[props.children].concat(temp);
        } else {
          let children = [...first[props.children]];
          delete first[props.children];
          temp = children.concat(temp);
        }
      }
    }
    return result;
  }

  /**
   * 获取节点级次
   */
  static getNodeLever(tree, props = Tree.defaultProps) {
    let result = {};
    function getLever(tree, level) {
      tree.forEach((e) => {
        result[e[props.id]] = level;
        if (e[props.children] && e[props.children].length > 0) {
          getLever(e[props.children], level + 1);
        }
      });
    }
    getLever(tree, 0);
    return result;
  }

  /**
   * 查找节点（广度）
   */
  static findNode(tree, id, props = Tree.defaultProps) {
    let temp = tree.map((e) => e);
    let result = null;
    while (temp.length > 0) {
      result = temp.shift();
      if (result[props.id] === id) {
        return result;
      }
      if (result[props.children] && result[props.children].length > 0) {
        temp = temp.concat(result[props.children]);
      }
    }
    return null;
  }

  /**
   * 查找节点集合（广度）
   */
  static findNodeList(tree, ids, props = Tree.defaultProps) {
    let temp = tree.map((e) => e);
    let result = [];
    while (temp.length > 0) {
      let first = temp.shift();
      if (ids.includes(first[props.id])) {
        result.push(first);
      }
      if (first[props.children] && first[props.children].length > 0) {
        temp = temp.concat(first[props.children]);
      }
    }
    return result;
  }

  /**
   * 根据名称查找节点集合（深度）
   */
  static findNodeListByName(tree, name, props = Tree.defaultProps) {
    let temp = tree.map((e) => e);
    let result = [];
    while (temp.length > 0) {
      let first = temp.shift();
      if (first[props.label].includes(name)) {
        result.push(first);
      }
      if (first[props.children] && first[props.children].length > 0) {
        temp = first[props.children].concat(temp);
      }
    }
    return result;
  }

  /**
   * 根据code模糊查找节点集合（深度）
   */
  static findNodeListByCode(tree, id, props = Tree.defaultProps) {
    let temp = tree.map((e) => e);
    let result = [];
    while (temp.length > 0) {
      let first = temp.shift();
      if (first[props.id].includes(id)) {
        result.push(first);
      }
      if (first[props.children] && first[props.children].length > 0) {
        temp = first[props.children].concat(temp);
      }
    }
    return result;
  }

  /**
   * 查找节点所有子节点
   */
  static findChildren(tree, id, props = Tree.defaultProps) {
    let result = [];
    let node = Tree.findNode(tree, id, props);
    function getChildren(array, props) {
      let result = [];
      array.forEach((e) => {
        result.push(e);
        if (e[props.children] && e[props.children].length > 0) {
          result.push(...getChildren(e[props.children], props));
        }
      });
      return result;
    }
    if (node && node[props.children] && node[props.children].length > 0) {
      result = getChildren(node[props.children], props);
    }
    return result;
  }

  /**
   * 查询节点父节点
   */
  static findParent(tree, id, props = Tree.defaultProps) {
    let result = [];
    let node = Tree.findNode(tree, id, props);
    let array = Tree.getArray(tree, props);
    let ids = array.map((e) => {
      return e[props.id];
    });
    function getParent(node, props) {
      let result = [];
      let parentNode = array.find((e) => {
        return e[props.id] === node[props.pid];
      });
      if (parentNode) {
        result.push(parentNode);
        if (parentNode[props.pid] && ids.includes(parentNode[props.pid])) {
          result.push(...getParent(parentNode, props));
        }
      }
      return result;
    }
    if (node && node[props.pid] && ids.includes(node[props.pid])) {
      result = getParent(node, props);
    }
    return result;
  }

  /**
   * 查找节点级次
   */
  static findNodeLevel(tree, id, props = Tree.defaultProps) {
    let result = null;
    function getLever(tree, id, level) {
      for (let e of tree) {
        if (e[props.id] === id) {
          result = level;
          break;
        }
        if (e[props.children] && e[props.children].length > 0) {
          getLever(e[props.children], id, level + 1);
        }
      }
    }
    getLever(tree, id, 0);
    return result;
  }
}

/**
 * 栈
 * @class Stack
 */
export class Stack {
  data = [];

  /**
   * 向栈内压入一个(或多个)元素
   * @param {*} value
   * @memberof Stack
   */
  push(...value) {
    this.data.push(...value);
  }

  /**
   * 把栈顶元素弹出
   * @returns
   * @memberof Stack
   */
  pop() {
    return this.data.pop();
  }

  /**
   * 返回栈顶元素
   * @returns
   * @memberof Stack
   */
  peek() {
    return this.data[this.data.length - 1];
  }

  /**
   * 判断栈是否为空
   * @returns
   * @memberof Stack
   */
  isEmpty() {
    return !this.data.length;
  }

  /**
   * 栈元素个数
   * @returns
   * @memberof Stack
   */
  size() {
    return this.data.length;
  }

  /**
   * 清空栈
   * @memberof Stack
   */
  clear() {
    this.data = [];
  }
}

/**
 * 队列
 * @class Queue
 */
export class Queue {
  data = [];

  /**
   * 向队列尾部添加一个(或多个)新的项
   * @param {*} value
   * @memberof Queue
   */
  enqueue(...value) {
    this.data.push(...value);
  }

  /**
   * 移除队列的第一(即排在队列最前面的)项，并返回被移除的元素
   * @returns
   * @memberof Queue
   */
  dequeue() {
    return this.data.shift();
  }

  /**
   * 返回队列第一个元素，队列不做任何变动
   * @returns
   * @memberof Queue
   */
  head() {
    return this.data[0];
  }

  /**
   * 返回队列最后一个元素，队列不做任何变动
   * @returns
   * @memberof Queue
   */
  tail() {
    return this.data[this.data.length - 1];
  }

  /**
   * 队列内无元素返回true，否则返回false
   * @returns
   * @memberof Queue
   */
  isEmpty() {
    return !this.data.length;
  }

  /**
   * 返回队列内元素个数
   * @returns
   * @memberof Queue
   */
  size() {
    return this.data.length;
  }

  /**
   * 清空队列
   * @memberof Queue
   */
  clear() {
    this.data = [];
  }
}

/**
 * 消息发布订阅模式
 * @class Observable
 */
export class Observable {
  subscribers = {};

  subscribe(topic, callback) {
    if (!this.subscribers[topic]) {
      this.subscribers[topic] = [];
    }
    this.subscribers[topic].push(callback);
    return this;
  }

  unsubscribe(topic, callback) {
    if (!this.subscribers[topic]) {
      return;
    }
    this.subscribers[topic] = this.subscribers[topic].filter(
      (e) => e !== callback,
    );
    return this;
  }

  publish(topic, ...args) {
    if (!this.subscribers[topic]) {
      return;
    }
    this.subscribers[topic].forEach((e) => {
      e(...args);
    });
    return this;
  }
}

/**
 * https://github.com/axihe/snowflake.git
 * 网上搜到的方案基本是按照推特的方案（10位的数据机器位分成 5位机器ID + 5位数据ID ），目前代码按照这个方案来做的；
 * 实现参考：https://github.com/twitter-archive/snowflake
 *
 * 名词说明：
 * Twitter_Snowflake
 * SnowFlake的结构如下(每部分用-分开):
 *
 * 0 - 0000000000 0000000000 0000000000 0000000000 0 - 00000 - 00000 - 000000000000
 * A-|--------------------B--------------------------|-------C-------|------D------|
 *
 * A区：1位标识，由于long基本类型在Java中是带符号的，最高位是符号位，正数是0，负数是1，所以id一般是正数，最高位是0
 * B区：41位时间截(毫秒级)，注意，41位时间截不是存储当前时间的时间截，而是存储时间截的差值（当前时间截 - 开始时间截)得到的值，
 *      这里的的开始时间截，一般是我们的id生成器开始使用的时间，由我们程序来指定的（如下下面程序IdWorker类的startTime属性）。41位的时间截，可以使用69年，
 *      年T = (1n << 41n) / (1000n * 60n * 60n * 24n * 365n) = 69n
 * C区：10位的数据机器位，可以部署在1024个节点，包括5位datacenterId和5位workerId（2^5 * 2^5 = 1024）
 * D区：12位序列，毫秒内的计数，12位 的计数顺序号支持每个节点每毫秒(同一机器，同一时间截)产生4096个ID序号（2^12=4096）
 * 加起来刚好64位，为一个Long型。
 *
 * SnowFlake的优点是，整体上按照时间自增排序，并且整个分布式系统内不会产生ID碰撞(由数据ID和机器ID作区分)，并且效率较高。
 * 理论1S内生成的ID数量是 1000*4096 = 4096000（四百零九万六千个）
 * 代码中使用Bigint实现，该类型在Node10.X版本才开始支持，返回出去的结果是Bigint转为String后的字符串类型，toString方法消耗总性能的三分之一时间；
 * 性能测试结果：
 *      生成100W条ID，      约850-1000ms；  如果不toString后再转，  时间约 640-660ms
 *      生成409.6WW条ID，   约3600-3850ms； 如果不toString后再转，  时间约约 2600-2800ms
 */
export class Snowflake {
  /**
   * 构造函数
   * @param workerId 工作ID (0~31)
   * @param datacenterId 数据标识ID (0~31)
   */
  constructor(_workerId, _dataCenterId) {
    /** 开始时间截 ：2019-12-20 13:52:35 */
    this.twepoch = 1576821155667n;

    /** 机器id所占的位数 */
    this.workerIdBits = 5n;

    /** 数据标识id所占的位数 */
    this.dataCenterIdBits = 5n;

    /**
     * 支持的最大机器id，结果是31 (这个移位算法可以很快的计算出几位二进制数所能表示的最大十进制数)
     * 用位运算计算n个bit能表示的最大数值，计算是 -1 左移 5，得结果a，然后 -1 异或 a
     *
     * 步骤
     * 先 -1 左移 5，得结果a ：
     *         11111111 11111111 11111111 11111111 //-1的二进制表示（补码，补码的意义是拿补码和原码相加，最终加出一个“溢出的0”）
     *   11111 11111111 11111111 11111111 11100000 //高位溢出的不要，低位补0
     *         11111111 11111111 11111111 11100000 //结果a
     * 再 -1 异或 a ：
     *         11111111 11111111 11111111 11111111 //-1的二进制表示（补码）
     *     ^   11111111 11111111 11111111 11100000 //两个操作数的位中，相同则为0，不同则为1
     * ---------------------------------------------------------------------------
     *         00000000 00000000 00000000 00011111 //最终结果31
     * */
    this.maxWrokerId = -1n ^ (-1n << this.workerIdBits); // 值为：31

    /** 支持的最大数据标识id，结果是31 */
    this.maxDataCenterId = -1n ^ (-1n << this.dataCenterIdBits); // 值为：31

    /** 序列在id中占的位数 */
    this.sequenceBits = 12n;

    /** 机器ID向左移12位 */
    this.workerIdShift = this.sequenceBits; // 值为：12

    /** 数据标识id向左移17位(12序列id+5机器ID) */
    this.dataCenterIdShift = this.sequenceBits + this.workerIdBits; // 值为：17

    /** 时间截向左移22位( 12序列id + 5机器ID + 5数据ID) */
    this.timestampLeftShift =
      this.sequenceBits + this.workerIdBits + this.dataCenterIdBits; // 值为：22

    /** 生成序列的掩码，这里为4095
     * 用位运算计算n个bit能表示的最大数值，计算是 -1 左移 12，得结果a，然后 -1 异或 a
     *
     * 步骤
     * 先 -1 左移 12，得结果a ：
     *         11111111 11111111 11111111 11111111 //-1的二进制表示（补码，补码的意义是拿补码和原码相加，最终加出一个“溢出的0”）
     * 1111 11111111 11111111 11111111 11110000 00000000 //高位溢出的不要，低位补0
     *         11111111 11111111 11110000 00000000 //结果a
     * 再 -1 异或 a ：
     *         11111111 11111111 11111111 11111111 //-1的二进制表示（补码）
     *     ^   11111111 11111111 11110000 00000000 //两个操作数的位中，相同则为0，不同则为1
     * ---------------------------------------------------------------------------
     *         00000000 00000000 00001111 11111111 //最终结果2^12  = 4096
     */
    this.sequenceMask = -1n ^ (-1n << this.sequenceBits); // 值为：4095

    /** 工作机器ID(0~31) */
    // this.workerId = 0n
    /** 数据中心ID(0~31) */
    // this.dataCenterId = 0n

    /** 上次生成ID的时间截 */
    this.lastTimestamp = -1n;

    this.workerId = BigInt(_workerId || 0n); //工作机器ID(0~31)
    this.dataCenterId = BigInt(_dataCenterId || 0n); //数据标识ID(0~31)
    this.sequence = 0n; //毫秒内序列(0~4095)

    // workerId 校验
    if (this.workerId > this.maxWrokerId || this.workerId < 0) {
      throw new Error(
        `workerId must max than 0 and small than maxWrokerId ${this.maxWrokerId}`,
      );
    }
    // dataCenterId 校验
    if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0) {
      throw new Error(
        `dataCenterId must max than 0 and small than maxDataCenterId ${this.maxDataCenterId}`,
      );
    }
  }

  /**
   * 获得下一个ID (该方法是线程安全的)
   * @return SnowflakeId
   */
  nextId() {
    var timestamp = this.timeGen();

    //如果当前时间小于上一次ID生成的时间戳，说明系统时钟回退过这个时候应当抛出异常
    if (timestamp < this.lastTimestamp) {
      throw new Error(
        'Clock moved backwards. Refusing to generate id for ' +
          (this.lastTimestamp - timestamp),
      );
    }

    //如果是同一时间生成的，则进行毫秒内序列
    if (this.lastTimestamp === timestamp) {
      /**
       * 按位于操作 对于每一个比特位，只有两个操作数相应的比特位都是1时，结果才为1，否则为0。
       * 假设最开始 this.sequence 为 0n 加1后，则为1
       * 结果如下
       *   00000000 00000000 00000000 00000001 //1的二进制
       *   00000000 00000000 00001111 11111111 //最终结果2^12  = 4096
       *---------------------------------------------------------------------------
       *   00000000 00000000 00000000 00000001 //结果1的二进制
       */
      this.sequence = (this.sequence + 1n) & this.sequenceMask;
      //毫秒内序列溢出
      if (this.sequence === 0n) {
        //阻塞到下一个毫秒,获得新的时间戳
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      //时间戳改变，毫秒内序列重置
      this.sequence = 0n;
    }

    //上次生成ID的时间截
    this.lastTimestamp = timestamp;

    //移位并通过或运算拼到一起组成64位的ID
    let result =
      ((timestamp - this.twepoch) << this.timestampLeftShift) |
      (this.dataCenterId << this.dataCenterIdShift) |
      (this.workerId << this.workerIdShift) |
      this.sequence;
    return result;
  }

  /**
   * 阻塞到下一个毫秒，直到获得新的时间戳
   * @param lastTimestamp 上次生成ID的时间截
   * @return 当前时间戳
   */
  tilNextMillis(lastTimestamp) {
    var timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
  }

  /**
   * 返回以毫秒为单位的当前时间
   * @return 当前时间(毫秒)
   */
  timeGen() {
    return BigInt(Date.now());
  }
}