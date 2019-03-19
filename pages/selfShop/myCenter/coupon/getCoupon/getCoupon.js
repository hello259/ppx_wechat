var app = getApp();
Page({
    data: {
        url: ''
    },
    onLoad(){
        this.setData({
            url:'https://t.act.vtplus.cn/m/ccec728695ad468883d17dc3e94ac7d0.html?token=' + app.globalData.token + '&guid=' + app.globalData.guid + '#wechat_redirect'
        })
        console.log( app.globalData.token )
    },
// 上拉
    onReachBottom: function () {

    },
})