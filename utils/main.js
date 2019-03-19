const app = getApp();

const CryptoJS = require("aes.js");

const key = "a5a4da37b09b4bd7ad2c34d6ced2b409";
const keys = "f599f76ace9046e0a4e5a39d494187cf";

//去除对象的值为空的项
function sort(obj){
  let newObj = {}; 
  for(let key in obj){
    if (obj[key] != "" || obj[key] === 0) {
      newObj[key] = obj[key];
    }   
  }
  return newObj;
};
//去除对象的值为空的并且url加密2
function sorts(obj) {
  let newObj = {};
  for (let key in obj) {
    if (obj[key] != "" || obj[key] === 0) {
      newObj[key] = encodeURIComponent(obj[key]);
    }
  }
  return newObj;
};
//排序的函数
function objKeySort(arys) {
  //再利用Array原型上的sort方法对获取的属性名进行排序，然后reverse的方法倒序得到newkey是一个数
  let newkey = Object.keys(arys).sort().reverse();
  let newObj = {}; 
  for (var i = 0; i < newkey.length; i++) {
    //向新创建的对象中按照排好的顺序依次增加键值对
    if (arys[newkey[i]] != "" || arys[newkey[i]] === 0){
      newObj[newkey[i]] = arys[newkey[i]];
    }      
  }
  return newObj; 
};
//拼接字符串
function strs(object){
  let obj = objKeySort(object);
  let str = '';
  for (let k in obj) {
    str += `${k}=${obj[k]}&`
  };
  str = `${str}key=${key}`;
  return str;
};
//拼接字符串2
function strs2(object) {
  let obj = objKeySort(object);
  let str = '';
  for (let k in obj) {
    str += `${k}=${obj[k]}&`
  };
  str = `${str}key=${keys}`;
  return str;
};
// 加密
function Encrypt(word) {
  const keys = CryptoJS.enc.Utf8.parse(key);
  const strs = CryptoJS.enc.Utf8.parse(word);
  return CryptoJS.AES.encrypt(strs, keys, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
};
// 加密2
function Encrypts(word) {
  // console.log(word)
  let key2= CryptoJS.enc.Utf8.parse(keys);
  const strs = CryptoJS.enc.Utf8.parse(word);
  return CryptoJS.AES.encrypt(strs, key2, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
};
// 解密
function Decrypt(word) {
  const keys = CryptoJS.enc.Utf8.parse(keys);
  let decrypt = CryptoJS.AES.decrypt(word, keys, { 
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypt.toString(CryptoJS.enc.Utf8).toString();
};
//小程序模板消息
// function formSubmit(template_id, form_id, data, page){
//   wx.request({
//     url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${res.data.access_token}`,//发送模版消息
//     method: 'POST',
//     data: {
//       "touser": app.globalData.openid,
//       "template_id": "UoYnwe2Njnv0MUNutQu9Pf7hxkEx-S9OiXS3u-ShxdM",//模板id
//       "page": "/pages/index/index",
//       "form_id": e.detail.formId,//提交表单的ID
//       "data": {
//         "keyword1": {
//           "value": app.globalData.userInfo.nickName
//         },
//         "keyword2": {
//           "value": "2015年01月05日 12:30"
//         },
//         "keyword3": {
//           "value": "粤海喜来登酒店"
//         },

//       },
//       "emphasis_keyword": app.globalData.userInfo.nickName
//     },
//     success: function (res) {
//       if (res.data.errmsg == "ok") {
//         wx.showToast({
//           title: '消息发送成功',
//           icon: 'success',
//           duration: 2000
//         })
//       } else {
//         wx.showToast({
//           title: '消息发送失败',
//           icon: 'success',
//           duration: 2000
//         })
//       }
//     }
//   });
// };
module.exports = {
  Encrypt: Encrypt,//加密
  Decrypt: Decrypt,//解密
  sort: sort,//去除对象的空值
  strs: strs,//拼接字符串
  key: key,
  objKeySort: objKeySort,
  Encrypts: Encrypts,
  sorts: sorts,
  strs2: strs2,
  promisify: api => {
    return (options, ...params) => {
      return new Promise((resolve, reject) => {
        const extras = {
          success: resolve,
          fail: reject
        }
        api({ ...options, ...extras }, ...params)
      })
    }
  }
};