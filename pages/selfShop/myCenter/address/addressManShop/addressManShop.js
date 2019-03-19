var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkboxItems: [
      // {name: 'USA', value: '美国'},
      // {name: 'CHN', value: '中国', checked: 'true'},
      // {name: 'BRA', value: '巴西'},
      // {name: 'JPN', value: '日本'},
      // {name: 'ENG', value: '英国'},
      // {name: 'TUR', value: '法国'},
    ],
    addressList: []
  },
  checkboxChange: function (e) {
    console.log(e)
    //     var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    //     for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
    //         checkboxItems[i].checked = false;
    //         console.log(values)
    //         for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
    //           console.log(values[j])
    //             if(checkboxItems[i].value == values[j]){
    //                 checkboxItems[i].checked = true;
    //                 break;
    //             }
    //         }
    //     }

    //     this.setData({
    //         checkboxItems: checkboxItems
    //     });
  },
  //编辑地址
  toEdit(e) {
    wx.navigateTo({
      url: '/pages/selfShop/myCenter/address/addressEdit/addressEdit?isshop=1&id=' + e.target.dataset.id
    })
  },
  //添加地址
  toadd(e){
    wx.navigateTo({
      url: '/pages/selfShop/myCenter/address/addressEdit/addressEdit?isshop=0'
    })
  },
  //删除地址
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
  //选择地址返回购物
  addressToShop(e){
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面
    prevPage.setData({
      addressList: {
        address_id: e.currentTarget.dataset.addressid,
        mob_phone: e.currentTarget.dataset.phone,
        true_name: e.currentTarget.dataset.name,
        area_info: e.currentTarget.dataset.areainfo,
        address: e.currentTarget.dataset.address,
        city_id: e.currentTarget.dataset.cityid,
        isChangeAddress:true
      }
    })
    var citobj = {
      true_name: e.currentTarget.dataset.name,//姓名
      mob_phone: e.currentTarget.dataset.phone,//手机号码
      area_id: e.currentTarget.dataset.area_id,
      city_id: e.currentTarget.dataset.cityid,
      area_info: e.currentTarget.dataset.areainfo,
      address: e.currentTarget.dataset.address,
      is_default: 1,
      address_id: e.currentTarget.dataset.addressid,
    }
    var apiUrl = '/mobile/index.php?act=member_address&op=address_edit&t=json';
    app.fetch(app.globalData.url + apiUrl, citobj, 'POST', 'application/json').then(res => {
      if (res.data.code == 200) {
        wx.navigateBack({
          delta: 1
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.swiperChange(e)
    var that = this;
      var msgobj = {
        token: app.globalData.token,
        v: app.globalData.v,
        guid: app.globalData.guid,
        client: app.globalData.client,
      }
      app.fetch(app.globalData.url + '/mobile/index.php?act=member_address&op=address_list&t=json', msgobj, 'POST', 'application/json').then(res => {
        if (res.data.code == 200) {
          that.setData({
            addressList: res.data.data.address_list
          })
        }
      })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})