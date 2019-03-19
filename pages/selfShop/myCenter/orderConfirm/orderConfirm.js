// pages/selfShop/cart/orderConfirm/orderConfirm.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList:{}, //订单详情
        btnArr: [] ,//底部按钮组
        isshow: false,
        orderId: '', //确认收货订单id
        img: '' ,//确认收货第一张商品图片
        index:0, //上一级订单状态
        istake:false //是否确认收货
    },
    //查物流
  toExpress(e){
    wx.navigateTo({
      url: '/pages/selfShop/myCenter/express/express?orderId=' + e.currentTarget.dataset.orderid
    })
  },
    //去支付页
  toPayPage(e){
    wx.redirectTo({
      url:'/pages/selfShop/cart/orderConfirm/orderConfirm?pay_sn=' + e.currentTarget.dataset.orderkey + '&order_id=' + e.currentTarget.dataset.orderid + '&type=1'
    })
  },
// 去评价
    toComment(e) {
        wx.navigateTo({
            url: '/pages/selfShop/myCenter/pushComment/pushComment?orderId=' + e.currentTarget.dataset.orderid + '&activeIndex=' + this.data.index
        })
    },
    //确认确认收货弹窗
  goodsSureBtn(){
    var that = this;
    var msgobj = {
      token: app.globalData.token,
      v: app.globalData.v,
      guid: app.globalData.guid,
      client: app.globalData.client,
      order_id: that.data.orderId
    }
    app.fetch(app.globalData.url + '/mobile/index.php?act=member_order&op=order_receive&t=json', msgobj, 'POST', 'application/json').then(res => {
      if( res.data.code == 200 ){
        wx.showToast({
            title: '确认收货成功',
            icon: 'none',
            duration: 2000
          })
        that.setData({
          isshow:false,
          istake:true
        })
        that.onLoad({orderId:that.data.orderId})
      }else{
        wx.showToast({
          title: res.data.error,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //取消确认收货弹窗
  goodsCancelBtn(){
    this.setData({
      isshow:false
    })
  },
  //确认收货
  takeGoods(e){
    var that = this;
    this.setData({
      isshow:true,
      orderId: e.currentTarget.dataset.orderid,
      img: e.currentTarget.dataset.img
    })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderId: options.orderId,
            index: options.index
        })
        var that = this;
        var msgobj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            order_id: options.orderId
        }
        app.fetch(app.globalData.url + '/mobile/index.php?act=member_order&op=order_orderid_detail&t=json', msgobj, 'POST', 'application/json').then(res => {
            if( res.data.code == 200 ){
                that.setData({
                    orderList: res.data.data,
                    img: res.data.data.goods_list[0].goods_image_url
                })
                var reslist = res.data.data;
                //判断有哪些按钮
                var btnArr = [];
                    if (reslist.order_state == 0) { //0已取消 无按钮
                        btnArr.push({ noBtn: true });
                    } else if (reslist.order_state == 10) { //10未付款 立刻支付
                        btnArr.push({ payBtn: true });
                    } else if (reslist.order_state == 20) { //20已付款 取消订单 查看物流
                        btnArr.push({ cancelOrderBtn: true, checkExpressBtn: true });
                    } else if (reslist.order_state == 30) { //30已发货 查看物流 确定收货
                        btnArr.push({ checkExpressBtn: true, makeGoods: true });
                    } else if (reslist.order_state == 40 && reslist.evaluation_state == 0) { //40已收货 0未评价 查看物流 去评价
                        btnArr.push({ checkExpressBtn: true, evaluate: true });
                    } else if (reslist.order_state == 40 && reslist.evaluation_state == 1) { //40已收货 1已评价 查看物流
                        btnArr.push({ checkExpressBtn: true });
                    } else if (reslist.order_state == 40 && reslist.evaluation_state == 2) { //40已收货 2已过期未评价 查看物流
                        btnArr.push({ checkExpressBtn: true });
                    }
                that.setData({
                    btnArr:btnArr
                })
            }else{
                wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 2000
                  })
            }
        })


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
        if( this.data.activeIndexBack ){
            this.onLoad({
                orderId:this.data.orderId,
                index: this.data.activeIndexBack

            })
        }else if(this.data.istake){
            this.onLoad({
                orderId:this.data.orderId,
                index: this.data.index
            })
        }
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