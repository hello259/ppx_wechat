var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rushId: '', //限时抢购id
    goodsList: [], //商品列表
    time: null,
    timer: null,
    content: '',
    flag: true,
    text: ['天', '时', '分', '秒'],
    nowTime: '',
    overTime: '',
    hours:'00' ,
    minute:'00' ,
    second:'00',
    activeText:'',
    isStart:true, //是否开始
    isStartText:'立即抢购'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if( this.data.rushId != '' ){
      that.setData({
        rushId:that.data.rushId
      })
    }else{
      this.setData({
        rushId:options.id
      })
    }
    var msgobj = {
      token: app.globalData.token,
      v: app.globalData.v,
      guid: app.globalData.guid,
      client: app.globalData.client,
      xianshi_id:this.data.rushId
    }
    app.fetch(app.globalData.url + '/mobile/index.php?act=index&op=special_list&t=json', msgobj, 'POST', 'application/json').then(res => {
      if( res.data.code == 200 ){
        //如果开始时间 减 现在时间 等于负数 证明已经开始 否则未开始
        //系统当前时间
        var realTime = Math.round(new Date().getTime()/1000).toString();
        if(res.data.data.start_time - realTime < 0 && res.data.data.end_time - realTime > 0){
          var time = that.formatTime( res.data.data.end_time - realTime )
          that.setData({
            activeText:'距离结束',
            nowTime:realTime,
            overTime:res.data.data.end_time,
            hours: time[1],
            minute: time[2],
            second: time[3],
            time: null,
            isStart:true,
            isStartText:'立即抢购'
          })
          that.time()
        }else if( res.data.data.start_time - realTime > 0 ){
          var time = that.formatTime( res.data.data.start_time - realTime )
          that.setData({
            activeText:'距离开始',
            nowTime:realTime,
            overTime:res.data.data.start_time,
            hours: time[1],
            minute: time[2],
            second: time[3],
            time: null,
            isStart:false,
            isStartText:'即将开始'
          })
          that.time()
        }else{
          that.setData({
            activeText:'已结束',
            hours: '00',
            minute: '00',
            second: '00',
            time: null,
            isStart:true,
            isStartText:'立即抢购'
          })
        }
        that.setData({
          goodsList:res.data.data
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
  formatTime(time){
    let day, hour, minute, second, content = '';
        // 计算、天、时、分、秒
        day = Math.floor(time / (60 * 60 * 24))
        hour = Math.floor((time % (60 * 60 * 24)) / (60 * 60)) + day*24
        minute = Math.floor(((time % (60 * 60 * 24)) % (60 * 60)) / 60)
        second = Math.floor(((time % (60 * 60 * 24)) % (60 * 60)) % 60)
        let array = [day, hour, minute, second]
        // 处理数据，如果、天、时、分、秒小于10，则拼接成09这种形式
        let timeList = array.map((item, index) => item < 10 ? `0${item}` : item)
        return timeList
  },
  time() {
    this.setData({
      timer: setInterval(() => {
        this.countDown()
        let time = this.data.time
        time = time - 1
        this.setData({
          time: time
        })
      }, 1000)
    })
  },
  countDown() {
    var that = this;
    // 解构赋值
      let {
        overTime,
        nowTime,
        timer
      } = this.data
      let time
      if (overTime < nowTime) {
        clearInterval(timer)
        this.setData({
          flag: false
        })
        return true
      } else {
      // 只有在第一次赋值
        if (this.data.time == null) {
          let temporary = overTime - nowTime
          this.setData({
            time: temporary
          })
        }
        time = this.data.time
        if (time <= -1) {
          clearInterval(timer)
          this.setData({
            flag: false
          })
          that.onLoad();
          return true
        }
        let day, hour, minute, second, content = '';
        // 计算、天、时、分、秒
        day = Math.floor(time / (60 * 60 * 24))
        hour = Math.floor((time % (60 * 60 * 24)) / (60 * 60)) + day*24
        minute = Math.floor(((time % (60 * 60 * 24)) % (60 * 60)) / 60)
        second = Math.floor(((time % (60 * 60 * 24)) % (60 * 60)) % 60)
        let array = [day, hour, minute, second]
        // 处理数据，如果、天、时、分、秒小于10，则拼接成09这种形式
        let timeList = array.map((item, index) => item < 10 ? `0${item}` : item)
        // 输出，进行字符拼接
        // timeList.forEach((item, index) => {
        //   content += `${item}${this.data.text[index]}`
        // })
        this.setData({
          content: content,
          hours:timeList[1] ,
          minute:timeList[2] ,
          second:timeList[3] 
        })
      }
    },
  toDetail(e){
    wx.navigateTo({
      url:'/pages/selfShop/buyDetail/buyDetail?goods_promotion_type=2&goods_id=' + e.currentTarget.dataset.id
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