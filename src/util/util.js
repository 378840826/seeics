
import { validatenull } from './validate';

// log
export const log = function () {
  try {
    JSON.stringify([...arguments]);
  } catch (error) {
    console.log.apply(console, [...arguments]);
    return;
  }
  console.log.apply(console, JSON.parse(JSON.stringify([...arguments])));
};

//表单序列化
export const serialize = data => {
  const list = [];
  Object.keys(data).forEach(ele => {
    list.push(`${ele}=${data[ele]}`);
  });
  return list.join('&');
};
export const getObjType = obj => {
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  if (obj instanceof Element) {
    return 'element';
  }
  return map[toString.call(obj)];
};
export const getViewDom = () => {
  return window.document.getElementById('avue-view').getElementsByClassName('el-scrollbar__wrap')[0];
};
/**
 * 对象深拷贝
 */
export const deepClone = data => {
  const type = getObjType(data);
  let obj;
  if (type === 'array') {
    obj = [];
  } else if (type === 'object') {
    obj = {};
  } else {
    //不再具有下一层次
    return data;
  }
  if (type === 'array') {
    for (let i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === 'object') {
    for (const key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
};
/**
 * 设置灰度模式
 */
export const toggleGrayMode = (status) => {
  if (status) {
    document.body.className = `${document.body.className } grayMode`;
  } else {
    document.body.className = document.body.className.replace(' grayMode', '');
  }
};
/**
 * 设置主题
 */
export const setTheme = (name) => {
  document.body.className = name;
};

/**
 * 加密处理
 */
export const encryption = (params) => {
  const {
    data,
    type,
    param,
    key
  } = params;
  const result = JSON.parse(JSON.stringify(data));
  if (type == 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele]);
    });
  } else if (type == 'Aes') {
    param.forEach(ele => {
      result[ele] = window.CryptoJS.AES.encrypt(result[ele], key).toString();
    });

  }
  return result;
};


/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
  if (fullscreenEnable()) {
    exitFullScreen();
  } else {
    reqFullScreen();
  }
};
/**
 * esc监听全屏
 */
export const listenfullscreen = (callback) => {
  function listen() {
    callback();
  }

  document.addEventListener('fullscreenchange', function () {
    listen();
  });
  document.addEventListener('mozfullscreenchange', function () {
    listen();
  });
  document.addEventListener('webkitfullscreenchange', function () {
    listen();
  });
  document.addEventListener('msfullscreenchange', function () {
    listen();
  });
};
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  const isFullscreen = document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen;
  return isFullscreen;
};

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  }
};
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen();
  }
};
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children.length != 0) {
      for (let j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id == id) {
          return menu[i];
        } 
        if (menu[i].children[j].children.length != 0) {
          return findParent(menu[i].children[j].children, id);
        }
        
      }
    }
  }
};
/**
 * 判断2个对象属性和值是否相等
 */

/**
 * 动态插入css
 */

export const loadStyle = url => {
  const link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(link);
};
/**
 * 判断路由是否相等
 */
export const diff = (obj1, obj2) => {
  delete obj1.close;
  const o1 = obj1 instanceof Object;
  const o2 = obj2 instanceof Object;
  if (!o1 || !o2) { /*  判断不是对象  */
    return obj1 === obj2;
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
    //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  }

  for (const attr in obj1) {
    const t1 = obj1[attr] instanceof Object;
    const t2 = obj2[attr] instanceof Object;
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr]);
    } else if (obj1[attr] !== obj2[attr]) {
      return false;
    }
  }
  return true;
};
/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value) => {
  let result = '';
  if (validatenull(dic)) {
    return value; 
  }
  if (typeof (value) === 'string' || typeof (value) === 'number' || typeof (value) === 'boolean') {
    let index = 0;
    index = findArray(dic, value);
    if (index != -1) {
      result = dic[index].label;
    } else {
      result = value;
    }
  } else if (value instanceof Array) {
    result = [];
    let index = 0;
    value.forEach(ele => {
      index = findArray(dic, ele);
      if (index != -1) {
        result.push(dic[index].label);
      } else {
        result.push(value);
      }
    });
    result = result.toString();
  }
  return result;
};
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
  for (let i = 0; i < dic.length; i++) {
    if (dic[i].value == value) {
      return i;
    }
  }
  return -1;
};
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = '';
  random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len ? len : 4);
  if (date) {
    random = random + Date.now(); 
  }
  return random;
};
/**
 * 打开小窗口
 */
export const openWindow = (url, title, w, h) => {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  const left = ((width / 2) - (w / 2)) + dualScreenLeft;
  const top = ((height / 2) - (h / 2)) + dualScreenTop;
  const newWindow = window.open(url, title, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=${ w }, height=${ h }, top=${ top }, left=${ left}`);

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus();
  }
};

/**
 * 获取顶部地址栏地址
 */
export const getTopUrl = () => {
  return window.location.href.split('/#/')[0];
};

/**
 * 获取url参数
 * @param name 参数名
 */
export const getQueryString = (name) => {
  const reg = new RegExp(`(^|&)${ name }=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(decodeURI(r[2])); 
  }
  return null;
};

/**
 * 下载文件
 * @param {String} path - 文件地址
 * @param {String} name - 文件名,eg: test.png
 */
export const downloadFileBlob = (path, name) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', path);
  xhr.responseType = 'blob';
  xhr.send();
  xhr.onload = function () {
    if (this.status === 200 || this.status === 304) {
      // 如果是IE10及以上，不支持download属性，采用msSaveOrOpenBlob方法，但是IE10以下也不支持msSaveOrOpenBlob
      if ('msSaveOrOpenBlob' in navigator) {
        navigator.msSaveOrOpenBlob(this.response, name);
        return;
      }
      const url = URL.createObjectURL(this.response);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
};

/**
 * 下载文件
 * @param {String} path - 文件地址
 * @param {String} name - 文件名,eg: test.png
 */
export const downloadFileBase64 = (path, name) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', path);
  xhr.responseType = 'blob';
  xhr.send();
  xhr.onload = function () {
    if (this.status === 200 || this.status === 304) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.response);
      fileReader.onload = function () {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = this.result;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    }
  };
};

/**
 * 导出报表
 * @param {Response} res -下载接口的 Response
 * @param {String} fileName - 可选的文件名，默认为 Response 中的 filename
 */
export const downloadExcel = (res, fileName) => {
  return new Promise((resolve, reject) => {
    // 如果没有返回文件
    if (res.headers['content-type'].includes('application/json')) {
      const blob = new Blob([res.data], { type: 'application/json' });
      const reader = new FileReader();
      reader.readAsText(blob, 'application/json');
      reader.onload = () => {
        reject(JSON.parse(reader.result));
      };
      return;
    }
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
    const blobUrl = window.URL.createObjectURL(blob);
    const name = fileName || res.headers['content-disposition'].split(';')[1].split('filename=')[1];
    const a = document.createElement('a');
    a.download = `${window.decodeURIComponent(name)}`;
    a.href = blobUrl;
    a.click();
    resolve();
  });
};

/**
 * 导出
 * @param {Blob} blob - blob文件
 * @param {String} fileName -文件名(带后缀名 默认xls)
 */
export const downloadFile = (blob, fileName) => {
  const blobs = new Blob([blob], { type: 'application/vnd.ms-excel' });
  if ('download' in document.createElement('a')) { //非IE下载
    const a = document.createElement('a');
    a.download = fileName;
    a.style.display = 'none';
    a.href = URL.createObjectURL(blobs);
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  } else { //IE10+下载
    navigator.msSaveBlob(blobs, fileName);
  }
};

/**
 * 存储页码数量配置
 * @param {String} path 模块路径
 * @param {Nunber} num 
 */
export const setPageSetup = (path, num) => {
  let arr = JSON.parse(localStorage.getItem('page-setup')) || [];
  arr.forEach(item => {
    if (item.path === path && item.size !== num) {
      item.size = num;
    } 
    return item;
  });
  arr.push({
    size: num,
    path
  });
  const obj = {};
  arr = arr.reduce(function(item, next) {
    obj[next.path] ? '' : obj[next.path] = true && item.push(next);
    return item;
  }, []);
  localStorage.setItem('page-setup', JSON.stringify(arr));
};

/**
 * 获取模块的页码数量
 * @param {String} path 路径
 * @returns 
 */
export const getPageSetup = (path) => {
  const arr = JSON.parse(localStorage.getItem('page-setup')) || [];
  const res = arr.filter(item => item.path === path)[0] || null;
  return res && res.size;
};

/**
 * 删除存储配置
 */
export const removePageSetup = () => {
  localStorage.removeItem('page-setup');
};