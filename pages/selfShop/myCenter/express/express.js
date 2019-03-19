var app = getApp();
Page({
    data: {
        orderId: '', //订单id
        expressList: {} //物流信息
    },
    onLoad: function (option) {
        this.setData({
            orderId: option.orderId
        })
        var that = this;
        var msgobj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            order_id: that.data.orderId
        }
        app.fetch(app.globalData.url + '/mobile/index.php?act=member_order&op=search_deliver&t=json', msgobj, 'POST', 'application/json').then(res => {
            if( res.data.code == 200 ){
                var arr = [];
                for(var i=res.data.data.deliver_info.length-1;i>0;i--){
                    arr.push(
                        {
                            time: res.data.data.deliver_info[i].split("&nbsp;&nbsp;")[0],
                            msg: res.data.data.deliver_info[i].split("&nbsp;&nbsp;")[1]
                        }
                    )
                }
                res.data.data.deliver_info = arr
                that.setData({
                    expressList:res.data.data
                })
                console.log(that.data.expressList)
            }else{
                wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 2000
                  })
            }
        })
    },
    //复制快递订单号
    copyExpress(){
        var that = this;
        wx.setClipboardData({
            data: that.data.expressList.shipping_code,
            success(res) {
              wx.getClipboardData({
                success(res) {
                  console.log(res.data) // data
                }
              })
            }
          })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
})