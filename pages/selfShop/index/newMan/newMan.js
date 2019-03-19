var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marginTop:'',
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },//滚动条位置
    isbottom:false,//是否到底部
    curpage:1,//页数，默认：1
    page:20,//每页显示多少条商品
    bid:'',//品牌ID
    storeid:'',//商家id
    areaid:'',//区域ID
    resList:[] //商品列表
  },
  scrollTopFun: function(e){
    if(e.detail.scrollTop > 0){//触发gotop的显示条件
      this.setData({
        'scrollTop.goTop_show': true
      });
    }else{
      this.setData({
        'scrollTop.goTop_show': false
      });
    }
  },
  //滚动条置顶
  goTopFun: function(e){
    var _top=this.data.scrollTop.scroll_top;//发现设置scroll-top值不能和上一次的值一样，否则无效，所以这里加了个判断
    if(_top==1){
      _top=0;
    }else{
      _top=1;
    }
    this.setData({
      'scrollTop.scroll_top': _top
    });
  },
  //去详情
  toDetail(e){
    wx.navigateTo({
      url: '/pages/selfShop/buyDetail/buyDetail?goods_id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var that = this;
    var msgobj = {
      token: app.globalData.token,
      v: app.globalData.v,
      guid: app.globalData.guid,
      client: app.globalData.client,
      xianshi_id:options.id
    }
    app.fetch(app.globalData.url + '/mobile/index.php?act=index&op=special_list&t=json', msgobj, 'POST', 'application/json').then(res => {
      if( res.data.code == 200 ){
        that.setData({
          resList:res.data.data
        })
        query.select('.banner-text').boundingClientRect(function (rect) {
          // console.log(rect.width)
          console.log(rect)
          that.setData({
            marginTop: rect.height + 'rpx'
          })
        }).exec();
      }else{
        wx.showToast({
          title: res.data.error,
          icon: 'none',
          duration: 2000
        })
      }
    })
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
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