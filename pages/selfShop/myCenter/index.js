var app =getApp();
Page({

    /**
     * 页面的初始数据
     */
    data:{
        islogin:app.globalData.islogin,//是否登录
        avatar:app.globalData.avatar,//会员头像
        mobileBind:app.globalData.mobileBind,//是否绑定手机号码
        nickname:app.globalData.nickname,//会员名字
        sex:app.globalData.sex,//性别
        invite:app.globalData.invite,//拼拼侠邀请码
        lucky:app.globalData.lucky//拼拼侠吉祥码
    },
    //页面跳转函数
    routerTo(e){
        wx.navigateTo({
            url: e.currentTarget.dataset.to
        })
    },
    //页面跳转函数
    routerToBar(e){
        app.globalData.orderList = e.currentTarget.dataset.type
        wx.switchTab({
            url: e.currentTarget.dataset.to
          })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    bindgetuserinfo(res){
        console.log(res)
        app.fetch(app.globalData.url+'/mobile/index.php?act=program&op=get_user_info&t=json', obj, 'POST', 'application/json').then(res => {
            console.log(res);
            
        })
    },
    onLoad: function(options) {
        console.log(app.globalData.avatar)

        var that =this;
        that.setData({
            islogin:app.globalData.islogin,//是否登录
                    avatar:app.globalData.avatar,//会员头像
                    mobileBind:app.globalData.mobileBind,//是否绑定手机号码
                    nickname:app.globalData.nickname,//会员名字
                    sex:app.globalData.sex,//性别
                    invite:app.globalData.invite,//拼拼侠邀请码
                    lucky:app.globalData.lucky//拼拼侠吉祥码
                })
        // var obj = {
        //     token:app.globalData.token,
        //     v:app.globalData.v,
        //     guid:app.globalData.guid,
        //     client:app.globalData.client,
        // }
        // app.fetch(app.globalData.url+'/mobile/index.php?act=program&op=get_user_info&t=json', obj, 'POST', 'application/json').then(res => {
        //     console.log(res.data)
        //     that.setData({
        //         avatar:res.data.data.member_avatar,//会员头像
        //         mobileBind:res.data.data.member_mobile_bind,//是否绑定手机号码
        //         nickname:res.data.data.member_nickname,//会员名字
        //         sex:res.data.data.member_sex,//性别
        //         invite:res.data.data.invite_code,//拼拼侠邀请码
        //         lucky:res.data.data.lucky_code//拼拼侠吉祥码
        //     })
        // })
        
    },
    getuserinfo(){
        var that = this;
        app.getToken().then(function(res){
            // res.data.code = '300'
            if(res.data.code == 200){
                app.globalData.guid = res.data.data.guid;
                app.globalData.token = res.data.data.token;
                wx.authorize({
                    scope: 'scope.userInfo',
                    success() {
                        wx.getUserInfo({
                            success(res){
                                var obj = {
                                    v:app.globalData.v,
                                    token:app.globalData.token,
                                    guid:app.globalData.guid,
                                    client:app.globalData.client,
                                    iv:res.iv,
                                    encryptedData:res.encryptedData,
                                    rawData:res.rawData,
                                    signature:res.signature,
                                    userInfo:res.userInfo
                                }
                                app.fetch(app.globalData.url + '/mobile/index.php?act=program&op=set_user_info&t=json', obj, 'POST', 'application/json').then(res => {
                                    
                                      if(res.data.code == 200){
                                        var msgobj = {
                                            token:app.globalData.token,
                                            v:app.globalData.v,
                                            guid:app.globalData.guid,
                                            client:app.globalData.client,
                                        }
                                        app.fetch(app.globalData.url+'/mobile/index.php?act=program&op=get_user_info&t=json', msgobj, 'POST', 'application/json').then(res => {
                                            app.globalData.avatar = res.data.data.member_avatar,//会员头像
                                            app.globalData.mobileBind = res.data.data.member_mobile_bind,//是否绑定手机号码
                                            app.globalData.nickname = res.data.data.member_nickname,//会员名字
                                            app.globalData.sex = res.data.data.member_sex,//性别
                                            app.globalData.invite = res.data.data.invite_code,//拼拼侠邀请码
                                            app.globalData.lucky = res.data.data.lucky_code//拼拼侠吉祥码
                                            app.globalData.islogin = true;
                                            that.setData({
                                                islogin: app.globalData.islogin,//是否登录
                                                avatar: app.globalData.avatar,//会员头像
                                                mobileBind: app.globalData.mobileBind,//是否绑定手机号码
                                                nickname: app.globalData.nickname,//会员名字
                                                sex: app.globalData.sex,//性别
                                                invite: app.globalData.invite,//拼拼侠邀请码
                                                lucky: app.globalData.lucky//拼拼侠吉祥码
                                            })
                                        })
                                      }else{
                                        wx.showToast({
                                            title: '请到个人中心登录',
                                            icon: 'none',
                                            duration: 2000
                                          })
                                          app.globalData.islogin = false;
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
                  app.globalData.islogin = false;
            }
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})