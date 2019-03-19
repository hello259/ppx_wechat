var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data:{
    addressList:[]
  },
  toEdit(e){
    wx.navigateTo({
      url: '/pages/selfShop/myCenter/address/addressEdit/addressEdit?isshop=0&id=' + e.target.dataset.id
    })
  },
  toadd(e){
    wx.navigateTo({
      url: '/pages/selfShop/myCenter/address/addressEdit/addressEdit?isshop=0'
    })
  },
  delAddress(e){
    var that = this;
    var citobj = {
      token: app.globalData.token,
      v: app.globalData.v,
      guid: app.globalData.guid,
      client: app.globalData.client,
      address_id: e.target.dataset.id
    }
    app.fetch(app.globalData.url + '/mobile/index.php?act=member_address&op=address_del&t=json', citobj, 'POST', 'application/json').then(res => {
      if( res.data.code == 200 ){
        that.onLoad();
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      // this.swiperChange(e)
      var that = this;
        var msgobj = {
          token:app.globalData.token,
          v:app.globalData.v,
          guid:app.globalData.guid,
          client:app.globalData.client,
      }
        app.fetch(app.globalData.url+'/mobile/index.php?act=member_address&op=address_list&t=json', msgobj, 'POST', 'application/json').then(res => {
          if( res.data.code == 200 ){
            that.setData({
              addressList:res.data.data.address_list
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
    this.onLoad();
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