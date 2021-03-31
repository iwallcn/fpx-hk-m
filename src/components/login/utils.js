/* eslint-disable */

export let tgc = getCookie('TGC') || getStorage('TGC');
// var tgc = getCookie('TGC');
// alert(tgc)
export let service = GetQueryString("service");
// var service = 'http://10.10.106.34:9080/cas';
export let fservice = GetQueryString("fservice");
// var fservice = 'http://10.10.106.37:8888';
export let countryId = 460;
export let loginURL = escape(window.location.href);
setCookie('countryId', countryId, 8)


// crypto-js.js
let CryptoJS = require('cryp-to-js').default
// aes加密：theKey密钥  pass密码(原文)
export const encrypt = (theKey, pass) => {
  CryptoJS.mode.ECB = (function () {
    var ECB = CryptoJS.lib.BlockCipherMode.extend()
    ECB.Encryptor = ECB.extend({
      processBlock: function (words, offset) {
        this._cipher.encryptBlock(words, offset)
      }
    })
    ECB.Decryptor = ECB.extend({
      processBlock: function (words, offset) {
        this._cipher.decryptBlock(words, offset)
      }
    })
    return ECB
  }())
  var key = CryptoJS.enc.Utf8.parse(theKey);
  var srcs = CryptoJS.enc.Utf8.parse(pass);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

// aes解密：theKey密钥  pass密码(密文)
export const decrypt = (theKey, pass) => {
  var key = CryptoJS.enc.Utf8.parse(theKey);
  var decrypt = CryptoJS.AES.decrypt(pass, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

// 生成密钥：n 生成多少位的密钥(默认8位)
export function getKey(n) {
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  if (n == null || n == undefined) {
    n = 8;
  }
  var res = "";
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }
  return res;
}

// 账号基本格式验证
export function verifyUser(val) {
  var regPhone = /^(1|\+861)[3-8]{1}\d{9}$/
  // var regEmail = /^\w{2,18}@[0-9a-zA-Z]{1,12}(\.[a-zA-Z]{2,3}){1,2}$/
  var regEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  if (regPhone.test(val) || regEmail.test(val)) {
    if (regPhone.test(val)) {
      return {
        bool: true,
        msg: 'phone'
      }
    } else {
      return {
        bool: true,
        msg: 'email'
      }
    }

  } else {
    return {
      bool: false,
      msg: '請正確輸入手機號碼或郵箱'
    }
  }
}

// 账号格式调整
export function cutStrings(val) {
  var regPhone = /^\+86/
  var regHk = /^\+852/
  if (regPhone.test(val)) {
    return val.substr(3)
  } else if (regHk.test(val)) {
    return val.substr(4)
  } else {
    return val
  }
}

// 手机号基本格式验证
export function verifyPhone(val) {
  var regPhone = /^(1|\+861)[3-8]{1}\d{9}$/
  if (regPhone.test(val)) {
    return {
      bool: true,
      msg: '手機號格式正確'
    }
  } else {
    return {
      bool: false,
      msg: '請正確輸入手機號碼'
    }
  }
}

// 账号基本格式验证
export function verifyAccount(val) {
  // var regEmail = /^\w{2,18}@[0-9a-zA-Z]{1,12}(\.[a-zA-Z]{2,3}){1,2}$/
  var regEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  var regPhone = /^((1|\+861)[3-8]{1}\d{9})|(\d{8}|[+852]\d{8})$/
  if (regEmail.test(val) || regPhone.test(val)) {
    return {
      bool: true,
      msg: '格式正確'
    }
  } else {
    return {
      bool: false,
      msg: '請正確輸入郵箱或手機號碼'
    }
  }
}

// 邮箱基本格式验证
export function verifyEmail(val) {
  // var regEmail = /^\w{2,18}@[0-9a-zA-Z]{1,12}(\.[a-zA-Z]{2,3}){1,2}$/
  var regEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  if (regEmail.test(val)) {
    return {
      bool: true,
      msg: '郵箱格式正確'
    }
  } else {
    return {
      bool: false,
      msg: '請正確輸入郵箱'
    }
  }
}

// 密码长度验证
export function verifyPass(val) {
  // var regPass = /^.{8,20}$/
  // if (regPass.test(val)) {
  //     return true
  // } else {
  //     return false
  // }
  var str1_format1 = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#%&?~^*$])[\da-zA-Z!@#%&?~^*$]{8,20}$/; //数字，字母，字符
  var str1_format2 = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z]{8,20}$/; //数字，字母
  if (!str1_format1.test(val) && !str1_format2.test(val)) {
    return {
      bool: false,
      msg: '密碼長度為8-20比特，必須同時包含英文字母和數位，英文字母區分大小寫，可以包含！、@、#、%、&、？、~、^、*、$特殊字元'
    }
  }
  return {
    bool: true,
    msg: '密碼格式正確'
  }
}

// 查询字符
export function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

//设置cookie
export function setCookie(key, val, hours) {
  var Now = new Date();
  var times = new Date(Now.getTime() + hours * 60 * 60 * 1000);
  document.cookie = key + '=' + escape(val) + '; expires=' + times + '; path=/';
}
//获取cookie
export function getCookie(key) {
  var arr = document.cookie.split('; ');
  for (var i = 0; i < arr.length; i++) {
    var arr2 = arr[i].split('=');
    if (arr2[0] == key) {
      return unescape(arr2[1]);
    };
  };
  return null;
}
//删除cookie
export function rmCookie(key) {
  // var Now=new Date();
  // Now.setDate(Now.getDate()-1);
  // document.cookie=key+'=4px; expires='+Now;
  setCookie(key, '', -48);
}

//设置localStorage
export function setStorage(key, value) {
  var curTime = new Date().getTime();
  //把包含storage值和时间的json对象转成json字符串
  window.localStorage.setItem(key, JSON.stringify({
    "data": value,
    "times": curTime
  }));
}
// 获取localStorage
export function getStorage(key) {
  var dataStr = window.localStorage.getItem(key);
  if (!dataStr) {
    return null;
  }
  var dataObj = JSON.parse(dataStr); //转成json对象
  if ((new Date().getTime() - dataObj.times) > (8 * 60 * 60 * 1000)) {
    // console.log('已超过8小时，信息已过期');
    return null;
  } else {
    //console.log('在8小时内，信息有效');
    return dataObj.data;
  }
}
// 删除localStorage
// window.localStorage.removeItem("TGC");

// 设置环境变量
var env = '';
if (location.href.indexOf('uat') !== -1) {
  // UAT
  env = 'uat'
} else if (location.href.indexOf('localhost') !== -1) {
  // 本地
  env = 'uat'
} else if (location.href.indexOf('yf') !== -1) {
  env = 'yf'
} else {
  // 生产
  env = 'prod'
}
export function getApiUrl() {
  switch (env) {
    case "uat":
      return "http://sso.uat.4px.com";
    case "prod":
      return "https://sso-c.4px.com";
    case "yf":
      return "https://sso-c.4px.com";
    default:
      return "http://10.10.106.10:9080"; // wj本地
  }
}
export function getLinkUrl() {
  switch (env) {
    case "uat":
      return "http://user-c.uat.4px.com/m/hk/";
    case "prod":
      return "http://user-c.4px.com/m/hk/";
    case "yf":
      return "http://user-c.4px.com/m/hk/";
    default:
      return "http://10.10.112.25:8888/m/hk/"; // tsj本地
  }
}
export function getServiceUrl() {
  switch (env) {
    case "uat":
      return "http://user-c.uat.4px.com";
    case "prod":
      return "http://user-c.4px.com";
    case "yf":
      return "http://user-c.4px.com";
    default:
      return "http://10.10.106.34:8080"; // lw本地
  }
}
