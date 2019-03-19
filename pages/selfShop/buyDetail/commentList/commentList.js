// pages/selfShop/buyDetail/commentList/commentList.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [] // 评论列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)  
    this.getCommentList(options.goods_id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  // 获取评论列表
  getCommentList: function (goods_id) {
    let that = this;

    let obj = {
      token: app.globalData.token,
      v: app.globalData.v,
      guid: app.globalData.guid,
      client: app.globalData.client,
      goods_id: goods_id,
      type: 0
    }

    app.fetch(app.globalData.url + '/mobile/index.php?act=goods&op=comments&t=json', obj, 'post', 'application/json').then(res => {
      console.log('评论列表', res)

      // 转换毫秒数
      let list = res.data.data.evaluate_list;
      for (var i = 0; i < list.length; i++) {
        var time = new Date(list[i].geval_addtime*1000)
        var year = time.getFullYear();
        var month = time.getMonth();
        var day = time.getDate();

        console.log(year + '-' + month + '-' + day)
        list[i].geval_addtime = year + '-' + month + '-' + day
      }

      // 赋值
      if (res.data.code == 200) {
        that.setData({
          commentList: res.data.data
        })

      } else if (res.data.code == 400) {
        console.log('评论列表', res)
      } else if (res.data.code == 401) {
        console.log('评论列表', res)
      }
    })
  },

  cilck: function () {
    // console.log(this.commentList)
    // let list = this.commentList.evaluate_list

    // for (var i = 0; i < list.length; i++) {
    //   var time = new Date(i.geval_addtime)
    //   var year = time.getFullYear();
    //   var month = time.getMonth();
    //   var day = time.getDate();
    //   console.log(year+ '-' + month + '-'+ day)
    // }

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