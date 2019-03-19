var linkflow = require("/utils/linkflow-wechatapp.min.js");
const com = require("/utils/main.js")
App({
    onLaunch(options) {
        //获取小程序的来源 场景值和参数
        this.globalData.pathInfo = options;
        var that = this;
        that.getToken().then(function(res){
            if(res.data.code == 200){
                that.globalData.guid = res.data.data.guid;
                that.globalData.token = res.data.data.token;
                wx.authorize({
                    scope: 'scope.userInfo',
                    success() {
                        wx.getUserInfo({
                            success(res){
                                var obj = {
                                    v:that.globalData.v,
                                    token:that.globalData.token,
                                    guid:that.globalData.guid,
                                    client:that.globalData.client,
                                    iv:res.iv,
                                    encryptedData:res.encryptedData,
                                    rawData:res.rawData,
                                    signature:res.signature,
                                    userInfo:res.userInfo
                                }
                                that.fetch(that.globalData.url + '/mobile/index.php?act=program&op=set_user_info&t=json', obj, 'POST', 'application/json').then(res => {
                                    
                                      if(res.data.code == 200){
                                        var msgobj = {
                                            token:that.globalData.token,
                                            v:that.globalData.v,
                                            guid:that.globalData.guid,
                                            client:that.globalData.client,
                                        }
                                        that.fetch(that.globalData.url+'/mobile/index.php?act=program&op=get_user_info&t=json', msgobj, 'POST', 'application/json').then(res => {  
                                            that.globalData.avatar = res.data.data.member_avatar,//会员头像
                                                that.globalData.mobileBind = res.data.data.member_mobile_bind,//是否绑定手机号码
                                                that.globalData.nickname = res.data.data.member_nickname,//会员名字
                                                that.globalData.sex = res.data.data.member_sex,//性别
                                                that.globalData.invite = res.data.data.invite_code,//拼拼侠邀请码
                                                that.globalData.lucky = res.data.data.lucky_code//拼拼侠吉祥码
                                        })
                                      }else{
                                        wx.showToast({
                                            title: '请到个人中心登录',
                                            icon: 'none',
                                            duration: 2000
                                          })
                                          that.globalData.islogin = false;
                                      }
                                    
                                })
                            }
                        })
                    }
                })
            }else{
                wx.showToast({
                    title: '请到个人中心登录',
                    icon: 'none',
                    duration: 2000
                  })
                that.globalData.islogin = false;
            }
        });
        
    },
    getToken: function(){
        var that = this;
        return new Promise(function(resolve, reject){
              wx.login({
                success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  if (res.code) {
                    var obj = {
                        v:that.globalData.v,
                        client:'program',
                        code:res.code
                    }
                    that.fetch( that.globalData.url +'/mobile/index.php?act=program&op=login&t=json', obj, 'POST', 'application/json').then(res => {
                        resolve(res);
                        
                    })
                  } else {
                    console.log('获取用户登录态失败！' + res.errMsg);
                    reject('error');
                  }
                }
              })
        })
      },
    onShow: function (options) {

        //当有新版本的时候自动更新
        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
        });
        // 当微信检查到小程序有新版本，会主动触发下载操作，当下载完成后，会通过 onUpdateReady 告知开发者。
        updateManager.onUpdateReady(function () {
            wx.showModal({
                showCancel: false,
                confirmColor: '#FF7C0D',
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate();
                    }
                }
            })
        });
        // 新的版本下载失败
        updateManager.onUpdateFailed(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本下载失败',
                showCancel: false,
                confirmColor: '#FF7C0D'
            })
        });
    },
    //全局存储
    globalData: {
        islogin:true,//是否登录
        smallRoutineName: "EMPLOY",
        avatar: '', //用户信息头像微信获取的,
        mobileBind: 0 , //是否绑定手机号码
        nickname:'',//会员名字
        sex:'',//性别
        invite:'',//拼拼侠邀请码
        lucky:'',//拼拼侠吉祥码
        users: {}, //个人信息
        employInfo: null,
        user: null, //token的存放,userId,
        unionid: "", //存unionid,
        openid: '', //存openid,
        backLink: '', //哪里跳转到登录就跳回哪里
        param_sever: {
            order: 1
        }, //首页服务高级筛选参数
        sever_obj: "",
        param_demand: {
            order: 0
        }, //首页需求高级筛选参数
        demand_obj: "",
        pathInfo: {}, //存储小程序的打开路径和分享来源
        url: "https://t.mall.jimiws.com", //测试域名
        getwxUrl: "https://api.jimiws.com", //获取微信号
        // url: 'https://mall.jimiws.com', //正式域名
        v: 1,
        token: "",
        guid: "",
        client:'program',
        appId:'wx1c43ddd1cc114c49',
        orderList: '' //订单列表类型
    },
    //根据分享卡片跳转
    urlLink() {
        if (this.globalData.backLink) {
            wx.switchTab({
                url: this.globalData.backLink
            });
        } else {
            wx.switchTab({
                url: '/pages/index/index'
            });
        }
    },
    //格式化日期
    formatNumber(n) {
        n = n.toString();
        return n[1] ? n : '0' + n;
    },
    dateFormat(value, format = 'Y/M/D h:m') {
        let dateFormat = value.match(/\d+-\d+-\d+|\d+:\d+:\d+/g).join(" ").replace(/-/g, '/');
        const date = new Date(dateFormat);
        const formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
        const dateArr = [];

        dateArr.push(date.getFullYear());
        dateArr.push(this.formatNumber(date.getMonth() + 1));
        dateArr.push(this.formatNumber(date.getDate()));

        dateArr.push(this.formatNumber(date.getHours()));
        dateArr.push(this.formatNumber(date.getMinutes()));
        dateArr.push(this.formatNumber(date.getSeconds()));

        for (var i in dateArr) {
            format = format.replace(formateArr[i], dateArr[i]);
        }
        return format;
    },
    //promise语法后台数据请求封装
    fetch: function (url, data, type, contentType, token, flag, flags) {
        var that = this;
        if (!flags) {
            wx.showLoading({
                title: '加载中...',
                icon: 'loading',
            });
        }
        //设置响应头
        let header = this.globalData.user ? "Bearer " + this.globalData.user.accessToken : "Bearer " + wx.getStorageSync('user').accessToken; //获取的Token
        //公共参数
        var appObj = {
            token: that.globalData.token,
            v: that.globalData.v,
            guid: that.globalData.guid,
            client: that.globalData.client,
        }
        var appObj2 = {
            v: that.globalData.v,
            guid: that.globalData.guid,
            client: that.globalData.client,
        }
        if (data) {
            // 商品详情不需要穿token
            if (String(url).indexOf('act=goods&op=goods_detail') != -1) {
                data = Object.assign(appObj2, data)
            } else {
                data = Object.assign(appObj, data)
            }
        }else{
            data = appObj
        }
        return new Promise((resolve, reject) => {
            wx.request({
                method: type ? type : "GET",
                url: url,
                header: {
                    'content-type': contentType ? contentType : 'application/x-www-form-urlencoded',
                    "access-token": token ? "" : header
                },
                // data: data ? data : "",
                data: data,
                success: function (res) {
                    setTimeout(() => {
                        wx.hideLoading();
                    }, 1000);
                    if (res.statusCode != 200) {

                        reject({
                            errorMessage: '服务器忙，请稍后重试',
                            code: 500
                        });
                        return;
                    };
                    if (res.data.errorCode && res.data.errorMessage) {
                        wx.showToast({
                            title: res.data.errorMessage == "Token error！" ? "请重新登录" : res.data.errorMessage,
                            icon: "none",
                            duration: 2000,
                            success() {
                                if (res.data.errorMessage == "Token error！") {
                                    wx.redirectTo({
                                        url: '/pages/wechat/wechat'
                                    });
                                }
                            }
                        })
                        reject({
                            errorMessage: res.data.errorMessage,
                            code: res.data.code
                        });
                        return;
                    }
                    resolve(res)
                },
                fail: reject,
                complete() {
                    if (!flag && !flags) {
                        wx.hideLoading();
                    }
                }
            })
        })
    },
    //微信支付
    wechatPay(Data, callback) {
        if (Data.success) {
            wx.requestPayment({
                'timeStamp': Data.data.timeStamp,
                'nonceStr': Data.data.nonceStr,
                'package': Data.data.package_,
                'signType': Data.data.signType,
                'paySign': Data.data.paySign,
                'success': function (res) {
                    console.log(res)
                    callback();
                },
                'fail': function () {
                    wx.showToast({
                        title: "支付已取消",
                        icon: 'none',
                        duration: 2000
                    });
                },
            })
        } else {
            wx.showToast({
                title: Data.errorMessage,
                icon: 'none',
                duration: 2000
            });
        }
    },
    //返回页面刷新
    back(num, params = {
        onshows: true
    }) {
        let pages = getCurrentPages(); //当前页面
        let prevPage = pages[pages.length - (num + 1)]; //上一页面
        prevPage.setData(params);
        setTimeout(() => {
            wx.navigateBack({
                delta: num
            })
        }, 1000)
    },
    pageReload(cb) {
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];
        if (currPage.data.onshows) {
            delete currPage.data.onshows
            cb(currPage.data);
        };
    },
    //领到账户支付
    ldPay(Data, callback) {
        const sign = com.Encrypt(com.strs(Data));
        const obj = com.sort(Data);
        obj.sign = sign;
        this.fetch('/financecenter/lingDaoPay/v1/pay', obj, 'POST').then(res => {
            wx.showToast({
                title: '支付成功',
                icon: 'none',
                duration: 1000
            });
            callback(res);
        })
    }
})