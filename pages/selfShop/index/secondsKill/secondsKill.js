var app = getApp();
Page({
  data: {
    tabs: ["正在疯抢", "明日预告"],
    activeIndex: 0,//顶部导航激活项
    sliderOffset: 0,
    sliderLeft: 0,
    resList: [], //数据列表
    flag: true,
    time: null,
    timer: null,
    text: ['天', '时', '分', '秒'],
    nowTime: '',
    overTime: '',
    hours:'00' ,
    minute:'00' ,
    second:'00',
    reshours: '00',
    resminute: '00'
  },
  //去详情
  toDetail(e){
    wx.navigateTo({
      url: '/pages/selfShop/buyDetail/buyDetail?goods_promotion_type=1&goods_id=' + e.currentTarget.dataset.id
    })
  },
  onLoad: function (option) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var sliderWidth = 104 / 2;
        // console.log((res.windowWidth / that.data.tabs.length - sliderWidth) / 2)
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.getList();
  },
  getList(){
    var that = this;
    var msgobj = {
      token: app.globalData.token,
      v: app.globalData.v,
      guid: app.globalData.guid,
      client: app.globalData.client,
      mode: that.data.activeIndex
    }
    app.fetch(app.globalData.url + '/mobile/index.php?act=xianshi&op=day_info&t=json', msgobj, 'POST', 'application/json').then(res => {
      if ( res.data.code == 200 ){
        //开始时间(已转换 天时分秒)
        var startTime = that.formatTime(res.data.data.start_time)
        //当前系统时间
        var realTime = Math.round(new Date().getTime() / 1000).toString();
        //返回小时数
        var reshours = startTime[1] - startTime[0] * 24
        //剩余时间
        var surplusTime = that.formatTime(res.data.data.end_time - realTime )
        that.setData({
          resList: res.data.data,
          reshours: startTime[1]-startTime[0]*24,
          resminute: startTime[2],
          nowTime:realTime,
          overTime:res.data.data.end_time,
        })
        if( that.data.activeIndex == 0 ){
          if( res.data.data.end_time - realTime < 0 ){
            that.setData({
              nowTime:realTime,
            overTime:res.data.data.end_time,
              hours:'00' ,
              minute:'00' ,
              second:'00',
            })
          }else{
            that.setData({
              nowTime:realTime,
            overTime:res.data.data.end_time,
              hours:surplusTime[1] ,
              minute:surplusTime[2] ,
              second:surplusTime[3],
            })
            that.time();
          }
        }
        
        
        
      }else{
        wx.showToast({
          title: res.data.error,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  onShow() {
    console.log(this.data.resList.xianshi_goods_info)
  },
  //切换tab
  tabClick: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    var that = this;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      resList:[]
    });
    that.getList();
    clearInterval(that.data.timer)
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
  },
})