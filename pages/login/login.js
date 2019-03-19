const app = getApp();
const com = require("../../utils/main.js");
Page({
  data:{
    CodeId: '',//手机号码区号id
    area_codes:'+86',//手机号码区号
    ishow: false,//输入框的阴影
    ishow2: false,//输入框的显示隐藏
    mobile: '',//手机号
    verifica_code: '',//验证码
    sendmsg: "60",//倒计时时间
    getmsg: '获取验证码',
    disable: false,//是否禁止获取按钮
    disables: false,//是否禁止登录按钮
    checkBox: ["agree"],//是否同意
    isFocus:'',//获取焦点
  },
  //获取验证码
  area_code() {
    wx.navigateTo({
      url: '../city/city'
    })
  },
  // 点击登录跳转
  login(){
    var that = this
    var params = {
      "token": app.globalData.token,
      "v": app.globalData.v,
      "guid": app.globalData.guid,
      "client": app.globalData.client,
      mobile:that.data.mobile,
      code:that.data.verifica_code
    }
      app.fetch(app.globalData.url+"/mobile/index.php?act=program&op=bind_mobile&t=json", params, "POST", 'application/json').then(res => {
        console.log(res)
        if( res.data.code == 200 ){

        }else{
          wx.showToast({
            title: res.data.error,
            icon: 'none',
            duration: 2000
          })
        }
          
      });
    // wx.navigateTo({
    //   url:'./selected/selected'
    // })
  },
  //点击登录   
  //调用登录接口
//   login() {
//     let Data = this.data;
//     let obj = {
//       mobileCountryCodeId: Data.CodeId,
//       mobile: Data.mobile,
//       captcha: Data.verifica_code,
//       timestamp: Date.parse(new Date()),//当前的时间戳
//       wxUnionId: app.globalData.unionid,
//       extensionNo: app.globalData.pathInfo.query && app.globalData.pathInfo.query.scene ? app.globalData.pathInfo.query.scene:"",//推广来源的参数
//     };
//     let str = com.strs2(com.objKeySort(com.sorts(obj)));
//     let sign = com.Encrypts(str);
//     let params = JSON.stringify({ param: sign });
//     app.fetch("/usercenter/smallRoutine/bindByWxUnionId", params, "POST", "application/json").then(res => {
//       if (!res.data.success) {
//         wx.showToast({
//           title: res.data.errorMessage,
//           icon: 'none',
//           duration: 1500
//         });
//       } else {
//         wx.setStorageSync('user', res.data.data);
//         app.globalData.user = res.data.data;
//         app.fetch('/usercenter/user/updateLoginTimeAndLocation', '', 'POST').then(res => {
//           return app.fetch('/usercenter/user/checkBasicMsg')
//         }).then(res => {
//           if (!res.data.data.isComplete) {
//             wx.redirectTo({
//               url: '/pages/my/userinfos/userInfo',
//             })
//           } else {
//             app.urlLink();
//           }
//         });
//       }
//     });
//   },
  //是否同意
  agreePage() {
    wx.navigateTo({
      url: '../userAgree/userAgree'
    })
  },
  agrees(e) {
    this.setData({
      checkBox: e.detail.value
    });
    this.verification();
  },
  //输入框失去或者获取焦点
  bindfocus(e) {
    this.setData({
      ishow: e.currentTarget.dataset.ishow
    })
  },
  blur() {
    this.setData({
      ishow: false,
    })
  },
  //点击x
  clearNum() {
    this.setData({
      mobile: '',
      disable: true,
      disables: true,
      ishow2: false
    })
  },
  //输入手机号
  bindKeyInput: function (e) {
    let reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
    this.setData({
      // disable: reg.test(e.detail.value) && this.data.getmsg == "获取" ? false : true,
      mobile: e.detail.value,
      // ishow2: e.detail.value.length > 0 ? true : false
    });
    // this.verification();
  },
  //输入验证码
  bindKeyInputs(e) {
    this.setData({
      verifica_code: e.detail.value,
    });
  },
  // 验证是否都填写正确
  verification() {
    let reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
    if (reg.test(this.data.mobile) && this.data.verifica_code.length == 4 && this.data.checkBox.length > 0) {
      this.setData({
        disables: false
      })
    } else {
      this.setData({
        disables: true
      })
    }
  },
  //获取验证码倒计时
  sendmsg() {
    var that = this;
    let reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
    this.setData({
      isFocus:false,
      disable: true,
      getmsg:'60s'
    });
    let Data = this.data;
    let sendmsg = Data.sendmsg;
    let interval = setInterval(() => {
      sendmsg--;
      this.setData({
        getmsg: sendmsg + 's',
        disable: true
      });
      if (sendmsg <= 0) {
        clearInterval(interval)
          this.setData({
            disable: false
          })
        this.setData({
          getmsg: '获取验证码',
          sendmsg: 60,
        })
      }
    }, 1000);

    // let params = {
    //   mobileCountryCodeId: Data.CodeId,
    //   mobile: Data.mobile
    // };
    // params.sign = com.Encrypt(com.strs(params));
    var params = {
      "token": app.globalData.token,
      "v": app.globalData.v,
      "guid": app.globalData.guid,
      "client": app.globalData.client,
      mobile:that.data.mobile
    }
      app.fetch(app.globalData.url+"/mobile/index.php?act=program&op=send_mobile_code&t=json", params, "POST", 'application/json').then(res => {
        if( res.data.code == 200 ){

        }else{
          wx.showToast({
            title: res.data.error,
            icon: 'none',
            duration: 2000
          })
        }
          
      });
  },
  onLoad(options) {

  }
})