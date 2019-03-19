var app = getApp();
Page({
  data: {
    tabs: ["未使用", "已使用", "已过期/失效"],
    activeIndex: 0,//顶部导航激活项
    sliderOffset: 0,
    sliderLeft: 0,
    curpage: 1, //页
    page: 10, //每页数量,
    couponList: [], //优惠券列表
  },

  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var sliderWidth = 13;
        // console.log((res.windowWidth / that.data.tabs.length - sliderWidth) / 2)
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.getCouponList();
  },
  getCouponList() {
    var that = this;
    var msgobj = {
      curpage: that.data.curpage,
      page: that.data.page,
      voucher_state: Number(that.data.activeIndex) + 1
    }
    app.fetch(app.globalData.url + '/mobile/index.php?act=member_voucher&op=voucher_list&t=json', msgobj, 'POST', 'application/json').then(res => {
      if (res.data.code == 200) {
        if( !res.data.data.voucher_list || res.data.data.voucher_list == '' || res.data.data.voucher_list.length == 0 || res.data.data.voucher_list == null ){
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 2000
          })
          if( that.data.curpage <= 1 ){
            that.setData({
              couponList: []
            })
          }
        }else{
          that.setData({
            couponList: res.data.data.voucher_list
          })
        }
        
      } else {
        wx.showToast({
          title: res.data.error,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  toGetCoupon() {
    wx.navigateTo({
      url: '/pages/selfShop/myCenter/coupon/getCoupon/getCoupon'
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      curpage:1
    });
    this.getCouponList();
  },
  onReachBottom: function() {
    var that = this;
    this.setData({
      curpage: Number(that.data.curpage) + 1
    });
    this.getCouponList();
  },
})