// pages/selfShop/sharePage/sharePage.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order_id:'',//拼团id
        goods_id:'',//商品id
        maskFlag: true, // 遮罩层
        ruleMaskFlag: true, // 规则遮罩层
        isShareClose: true, // 分享关闭按钮
        isRuleClose: true, // 规则关闭按钮
        isShareSuccessClose: true, // 分享成功关闭按钮
        remainTime: 0, // 倒计时
        // clock: formatTime(1),
        shareImg:'', //分享图片
        title:'', //分享title
        buyer_avatar:'' ,//团主头像
        own_avatar: '' , //自己头像
        surplus_number: '', //差几天拼团成功
        order_status:0, //拼团状态
        mode:'', //模式


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            order_id: options.order_id,
            goods_id: options.goods_id
        })
        var that = this;
        // this.handlerOpenSuccess();
        var obj = {
            order_id: that.data.order_id,
            goods_id: that.data.goods_id,
        }
        app.fetch(app.globalData.url + '/mobile/index.php?act=goods_assemble&op=assemble_info&t=json', obj, 'POST', 'application/json').then(res => {
            console.log(res)
            if (res.data.code == 200) {
                
                that.setData({
                    remainTime: res.data.data.surplus_time,
                    buyer_avatar: res.data.data.buyer_avatar,
                    surplus_number: res.data.data.goods_assemble_surplus_number,
                    order_status: res.data.data.order_status,
                    mode: res.data.data.goods_assemble_mode,
                    own_avatar: app.globalData.avatar
                })
                that.formatTime(res.data.data.surplus_time)
                that.conutDown();
            } else {
                wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
        var obj2 = {
            goods_id: that.data.goods_id
        }
        app.fetch(app.globalData.url + '/mobile/index.php?act=goods&op=goods_detail&t=json', obj2, 'POST', 'application/json').then(res => {
            console.log(res)
            if (res.data.code == 200) {

                that.setData({
                    shareImg:res.data.data.share_shareImg,
                    title:res.data.data.share_title
                })
            } else {
                wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },

    /* 点击打开分享弹出层 */
    // handlerOpenShare: function() {
    //     this.setData({
    //         maskFlag: false,
    //         isShareClose: false
    //     })
    // },

    /* 点击关闭分享弹出层 */
    // handlerCloseShare: function() {
    //     this.setData({
    //         maskFlag: true,
    //         isShareClose: true
    //     })
    // },

    /* 点击打开规则弹出层 */
    handlerOpenRule: function() {
        this.setData({
            ruleMaskFlag: false,
            isRuleClose: false
        })
    },

    /* 点击关闭规则弹出层 */
    handlerCloseRule: function() {
        this.setData({
            ruleMaskFlag: true,
            isRuleClose: true
        })
    },

    // 打开分享成功弹出层
    handlerOpenSuccess: function() {

        this.setData({
            maskFlag: false,
            isShareSuccessClose: false
        })
    },

    // 点击关闭分享成功弹出层
    handlerCloseuccess: function() {
        console.log(12123)
        this.setData({
            maskFlag: true,
            isShareSuccessClose: true
        })
    },


    // 回到首页
    handlerHome: function() {
        wx.switchTab({
            url: '/pages/selfShop/index/index',
            success: function() {
                console.log(res)
            },
            fail: function(res) {
                console.log(res)
            }
        })
    },
    formatTime(time) {
        let seconds = 0;
        let minutes = 0;
        let hours = 0;
        let day = 0;
    
        if (time) {
            seconds = time;
    
            if (seconds > 59) {
                minutes = Math.floor(seconds / 60);
                seconds = seconds % 60;
                if (minutes > 59) {
                    hours = Math.floor(minutes / 60);
                    minutes = minutes % 60;
    
                    if (hours > 23) {
                        day = Math.floor(hours / 24);
                        hours = hours % 60;
                    }
                }
            }
        }
    
        let ds = day > 0 ? day : `${day}天`;
        let hs = hours > 9 ? hours : `0${hours}`;
        let ms = minutes > 9 ? minutes : `0${minutes}`;
        let ss = seconds > 9 ? seconds : `0${seconds}`;
        let obj = {};
        obj.hours = hs;
        obj.minutes = ms;
        obj.seconds = ss;
        obj.days = ds;
        // return ds > 0 ? `${ds} ${hs}: ${ms}: ${ss}` : `${hs}: ${ms}: ${ss}`
    
        // return ds > 0 ? `${hs}: ${ms}: ${ss}` : `${hs}: ${ms}: ${ss}`;
        return obj;
    },
    conutDown() {
        var that = this;
        let seconds = that.data.remainTime;
        
        if (seconds === 0) {
            that.setData({
                remaimTime: 0,
                clock: that.formatTime(0)
            })
            
            return;
        }
    
        
        setTimeout(function() {
            that.setData({
                remainTime: seconds - 1,
                clock: that.formatTime(seconds - 1)
            });
            that.conutDown()
        }, 1000)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // let time = new Date();
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
    onShareAppMessage: function(res) {
        var _that = this;
        console.log(_that)
        if (res.from === 'button') {
            console.log("来自页面内转发按钮");
        } else {
            console.log("来自右上角转发菜单")
        }
        return {
            title: _that.data.title,
            path: '/pages/selfShop/sharePage/shareGroup/shareGroup?order_id=' + _that.data.order_id + '&goods_id=' + _that.data.goods_id,
            imageUrl: _that.data.shareImg,
            success: (res) => {
                console.log("转发成功", res);
                        // 调用继续分享
                    _that.handlerOpenSuccess();

            },
            fail: (res) => {
                console.log("转发失败", res);

                if (res.errMsg === 'shareAppMessage:cancel') {
                    console.log(2222)
                    _that.setData({
                        maskFlag: true,
                        isShareSuccessClose: true
                    })
                }
            }
        }
    }

})