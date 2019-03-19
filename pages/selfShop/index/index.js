import { formatTime, conutDown, clearTimeOut } from '../../../utils/common';
import { formatTime2, conutDown2, clearTimeOut2 } from '../../../utils/common2';

var app = getApp();
app.linkflow.sendEvent(
  {
    "event": "UDE_1D8BJPBET",
  })
let goodsList = [
  { actEndTime: '2018-12-30 10:00:00' }
]
var wxTimer = function (initObj) {
  initObj = initObj || {};
  this.beginTime = initObj.beginTime || "00:00:00";	//开始时间
  this.interval = initObj.interval || 0;				//间隔时间
  this.complete = initObj.complete;					//结束任务
  this.intervalFn = initObj.intervalFn;				//间隔任务
  this.name = initObj.name;							//当前计时器在计时器数组对象中的名字

  this.intervarID;									//计时ID
  this.endTime;										//结束时间
  this.endSystemTime;									//结束的系统时间
}
wxTimer.prototype = {
  //开始
  start: function (self) {

    this.endTime = new Date("1970/01/01 " + this.beginTime).getTime();//1970年1月1日的00：00：00的字符串日期

    this.endSystemTime = new Date(Date.now() + this.endTime);
    var that = this;
    //开始倒计时
    var count = 0;//这个count在这里应该是表示s数，js中获得时间是ms，所以下面*1000都换成ms
    function begin() {
      var tmpTime = new Date(that.endTime - 1000 * count++);
      //把2011年1月1日日 00：00：00换成数字型，这样就可以直接1s，1s的减，就变成了倒计时，为了看的更明确，又用new date把字符串换回来了
      var tmpTimeStr = tmpTime.toString().substr(19, 6);//去掉前面的年月日就剩时分秒了

      var wxTimerSecond = (tmpTime.getTime() - new Date("1970/01/01 00:00:00").getTime()) / 1000;
      var wxTimerList = self.data.wxTimerList;
      //更新计时器数组
      wxTimerList = {
        wxTimer: tmpTimeStr,
        wxTimerSecond: wxTimerSecond,
      }
      self.setData({
        wxTimer: tmpTimeStr,
        wxTimerSecond: wxTimerSecond,
        wxTimerList: wxTimerList
      });
      //时间间隔执行函数
      if (0 == (count - 1) % that.interval && that.intervalFn) {
        that.intervalFn();
      }
      //结束执行函数
      if (wxTimerSecond <= 0) {
        if (that.complete) {
          that.complete();
        }
        that.stop();
      }
    }
    begin();
    this.intervarID = setInterval(begin, 1000);
  },
  //结束
  stop: function () {
    clearInterval(this.intervarID);
  },
  //校准
  calibration: function () {
    this.endTime = this.endSystemTime - Date.now();
  }
}
var wxtime = new wxTimer({
  beginTime: "00:10:00",
  complete: function () {
  },
  interval: 2,
  intervalFn: function () {
  }
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rushId: '',//限时抢购id
    spikeId: '',//必拼秒杀id
    newManId: '',//新人专享id
    isauth: true,//是否授权 true:未授权
    ishongbao: false,//是否展示红包
    iscopy: false,//是否展示复制
    iscopySuccess: false,//是否复制成功
    copyclose: false,//复制成功弹窗关闭 true未关闭
    wxTimer: '',
    wxTimerSecond: '',
    wxTimerList: {},
    swiperCurrent: 0,

    indicatorDots: true,

    autoplay: true,

    interval: 3000,

    duration: 800,

    circular: true,

    indicatorCo: "#ffdfdc",

    indicatoraAC: "#ff948a",

    imgUrls: [

    ],
    recommendList: {
      item: []
    },
    // supernatant: [
    //   {
    //     id: 12,
    //     url: '',
    //     name:'jack'
    //   },
    //   {
    //     id: 11,
    //     url: '',
    //     name:'rose'
    //   },
    //   {
    //     id: 13,
    //     url: '',
    //     name:'tome'
    //   },
    // ],
    explosiveGoodsList: {},  // 爆品快抢
    strictSelectionList: [],  // 严选好物
    beginAnimation: '', // 规则弹出层动画
    floatData:[], // 浮层数据
    database: "",  // 显示的单个数据
    floatTimer: '', // 浮层定时器
    newPeopleList: [], // 新人超值包邮
    isHome1SHow: false,
    home2: [],
    recommended_six_block:[], // 新人好礼
    specialList: {},  // 爆破快抢
    remainTime: '', // 爆破快抢倒计时
    clock: formatTime(),
    specialBeginList: {},  // 比拼秒杀
    isSpeialHide: true, // 必拼秒杀隐藏
    isExplosiveHide: true, // 爆破快抢隐藏
    formatTime2: '',  // 比拼秒杀倒计时
    clock2: formatTime2(),
    newPeopleDetailList: {},
    wxNum: 'ciji063360',
    curpage: 1,
    page: 6,
    dataMode: false, //为你推荐模块 data_mode 0为false 1为true
    btnList:[],
    btnCurrentSwiper:0, //顶部btn轮播
    // tabs: ["商品分类", "品牌"],
    tabs: ["商品分类"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    tabs2: ["全部", "女装", "男装", "配饰箱包", "澳洲海淘", "澳洲海淘", "澳洲海淘", "澳洲海淘"],
    // tabs2: ["全部"],
    activeIndex2: 0,
    sliderOffset2: 0,
    sliderLeft2: 0,
    goodsClassList: [], //商品分类数据
    goodsClassList2: [], //商品分类数据备份
    searchClass:'', //搜索分类
  },
  //首页搜索分类
  handleSearch(e){
    this.setData({
      searchClass:e.detail.value
    })
    if( e.detail.value == '' ){
      this.setData({
        goodsClassList: this.data.goodsClassList2
      })
      return;
    }
    var goodsClassList = this.data.goodsClassList2;
    var arr = [
      {
        "gc_id": "",
        "gc_name": "",
        "type_id": "",
        "type_name": "",
        "gc_parent_id": "",
        "gc_image": "",
        "two_subclass": [
          {
            "gc_id": "",
            "gc_name": "",
            "type_id": "",
            "type_name": "",
            "gc_parent_id": "",
            "gc_image": "",
            "three_subclass": [

            ]
          },
        ]
      }
    ]
    for (var i = 0; i < goodsClassList.length; i++) {
      if (goodsClassList[i].two_subclass.length > 0) {
        for (var j = 0; j < goodsClassList[i].two_subclass.length; j++) {
          if (goodsClassList[i].two_subclass[j].three_subclass.length > 0) {
            for (var k = 0; k < goodsClassList[i].two_subclass[j].three_subclass.length; k++) {
              if (goodsClassList[i].two_subclass[j].three_subclass[k].gc_name.indexOf(this.data.searchClass) != -1) {
                arr[0].two_subclass[0].three_subclass.push(goodsClassList[i].two_subclass[j].three_subclass[k])
              }
            }
          }
        }
      }
    }
    if( arr[0].two_subclass[0].three_subclass.length <= 0 ){
      wx.showToast({
        title: '暂无数据',
        icon: 'none',
        duration: 2000
      })
    }
    this.setData({
      goodsClassList: arr
    })
  },
  //商品分类搜索
  toClass(e){
    wx.navigateTo({
      url: "/pages/selfShop/index/searchClassList/searchClassList?id=" + e.currentTarget.dataset.id
    })
  },
  //获取商品分类
  getGoodsClassList(){
    var that = this;
    app.fetch(app.globalData.url + '/mobile/index.php?act=goods_class&op=getGoodsClassList&t=json', {}, 'POST', 'application/json').then(res => {
      if (res.data.code == 200) {
        if( !res.data.data.goods_class_list ){
          wx.showToast({
            title: '暂无商品分类数据',
            icon: 'none',
            duration: 2000
          })
        }else{
          that.setData({
            goodsClassList: res.data.data.goods_class_list,
            goodsClassList2: res.data.data.goods_class_list
          })
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
  tabClick: function (e) {
    this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id
    });
  },
  tabClick2: function (e) {
    this.setData({
        sliderOffset2: e.currentTarget.offsetLeft,
        activeIndex2: e.currentTarget.id
    });
  },
  //侧边栏出现事件
  filter:function(e){ //点击筛选事件
    var animation = wx.createAnimation({//创建动画
      duration: 300,
      timingFunction: 'ease',
      width:300,
      height:800,
      top:0,
      bottom:0,
      left:0,
      backgroundColor:'#fff',
      opcity:0.5
    })

    this.animation = animation

    animation.translateX(100 + 'vh').step() //动画效果向右滑动100vh

    this.setData({
      animationData: animation.export(),
      show:true
    })
  },
  filterHide:function(e){ //点击筛选事件
    var animation = wx.createAnimation({//创建动画
      duration: 300,
      timingFunction: 'ease',
      width:300,
      height:800,
      top:0,
      bottom:0,
      left:0,
      backgroundColor:'#fff',
      opcity:0.5
    })

    this.animation = animation

    animation.translateX(-100 + 'vh').step() //动画效果向右滑动100vh

    this.setData({
      animationData: animation.export(),
      show:false
    })
  },
  btnSwiperChange: function (e) {
    this.setData({
      btnCurrentSwiper: e.detail.current
    })
  },
  btnTo(e){
    var dataset = e.currentTarget.dataset;
    if( dataset.type == 'category' ){
      wx.navigateTo({
        url: "/pages/selfShop/index/searchClassList/searchClassList?id=" + dataset.id
      })
    }else if( dataset.type == 'keyword' ){
      wx.navigateTo({    
        url:"/pages/selfShop/index/searchList/searchList?inputValue=" + dataset.id
      })
    }else if( dataset.type == 'special' ){
      if( dataset.suffix == 'groupbuy' ){
        wx.navigateTo({
          url: "/pages/selfShop/index/flashSales/flashSales?id=" + dataset.id
        })
      }else if( dataset.suffix == 'spike' ){
        wx.navigateTo({
          url: "/pages/selfShop/index/secondsKill/secondsKill?id=" + dataset.id
        })
      }else if( dataset.suffix == 'recruits_exclusive' ){
        wx.navigateTo({
          url: "/pages/selfShop/index/newMan/newMan?id=" + dataset.id
        })
      }
    }else if( dataset.type == 'goods' ){
      wx.navigateTo({    
        url: '/pages/selfShop/buyDetail/buyDetail?goods_id=' + dataset.id
      })
    }else if( dataset.type == 'url' ){
      wx.navigateTo({
        url: "/pages/selfShop/jumpexternal/jumpexternal?gaddressUlr=" + dataset.id
      })
    }

  },
  //新人专享
  toNew(e) {
    console.log()
    wx.navigateTo({
      url: "/pages/selfShop/index/newMan/newMan?id=" + e.currentTarget.dataset.id
    })
  },
  //限时抢购
  toRob(e) {
    wx.navigateTo({
      url: "/pages/selfShop/index/flashSales/flashSales?id=" + e.currentTarget.dataset.id
    })

  },
  //必拼秒杀
  toSpike(e) {
    wx.navigateTo({
      url: "/pages/selfShop/index/secondsKill/secondsKill?id=" + e.currentTarget.dataset.id
    })
  },
  // 复制微信号
  copywx() {
    var that = this;
    wx.setClipboardData({
      data: that.data.wxNum,
      success(res) {
        wx.getClipboardData({
          success(res) {
            that.setData({
              isauth: false,
              ishongbao: false,
              iscopy: false,
              iscopySuccess: true,
            })
            wx.setStorage({
              key: "iscopy",
              data: "1"
            })
            setTimeout(function () {
              that.setData({
                isauth: false,
                ishongbao: false,
                iscopy: false,
                iscopySuccess: false,
                copyclose: false
              })
            }, 5000)
          }
        })
      }
    })
  },
  //领红包
  gethongbao() {
    this.setData({
      isauth: false,
      ishongbao: false,
      iscopy: true,
      iscopySuccess: false,
    })
  },
  // 授权登陆
  getuserinfo(res) {
    var that = this;
    wx.getUserInfo({
      success(res) {
        that.setData({
          isauth: false,
          ishongbao: true,
          iscopy: false,
          iscopySuccess: false,
        })
        wxtime.stop();
        wx.setStorage({
          key: "isauth",
          data: "1"
        })
      }
    })
  },
  toSearch: function () {
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "search/search"
    })
  },

  //轮播图的切换事件
  bindanimationfinish: function (e) {

    this.setData({

      swiperCurrent: e.detail.current

    })

  },

  //点击指示点切换
  chuangEvent: function (e) {
    this.setData({

      swiperCurrent: e.currentTarget.id

    })

  },

  //点击图片触发事件
  swipclick: function (e) {
    // wx.switchTab({

    //   url: this.data.links[this.data.swiperCurrent]

    // })
    // console.log(e)
    // if (e.currentTarget.dataset.type == 'url') {
    //   wx.navigateTo({
    //     url: "/pages/selfShop/jumpexternal/jumpexternal?gaddressUlr=" + e.currentTarget.dataset.dataurl
    //   })
    // } else if (e.currentTarget.dataset.type == 'special') {
    //   wx.navigateTo({
    //     url: "/pages/selfShop/index/newMan/newMan?id=" + e.currentTarget.dataset.dataurl
    //   })
    // } else if (e.currentTarget.dataset.type == 'goods') {
    //   wx.navigateTo({
    //     url: '/pages/selfShop/buyDetail/buyDetail?goods_id=' + e.currentTarget.dataset.dataurl
    //   })
    // }

  },
  toDetail: function (e) {
    wx.navigateTo({
      url: '/pages/selfShop/buyDetail/buyDetail?goods_id=' + e.currentTarget.dataset.id
    })
  },
  toSearchList: function () {
    wx.navigateTo({
      url: '/pages/selfShop/index/searchList/searchList'
    })
  },

  // 规则弹出层
  trigger: function () {
    // console.log(123)
    let that = this;
    let options = {
      duration: 1000,
      timingFunction: 'linear'
    }
    let floatData = wx.getStorageSync('floatData');
    
    that.data.database = floatData.shift();
    // console.log(that.data.database)
    
    wx.setStorageSync("floatData",floatData)


    if (floatData.length == 0) {
      that.getFloatData();
    }

    that.setData({
      database: that.data.database
    })

    // 创建动画的实例
    var lanination = wx.createAnimation(options);

    // 开始
    lanination.opacity(1).step()
    that.setData({
      beginAnimation: lanination.export()
    })

    // 结束
    setTimeout(function () {
      lanination.opacity(0).step()

      that.setData({
        beginAnimation: lanination.export()
      })
    },10000)
  },

  // 拨打电话
  callNumber: function () {
    wx.makePhoneCall({
      phoneNumber: '020-28122324',
      success: function (res) {
        console.log('success', res.data.code)
      },
      fail: function (res) {
        console.log('success', res.data.code)
      }
    })
  },
  // 复制到剪贴板
  copyClipboard: function (e) {
    let data = e.currentTarget.dataset.number;
    // console.log(e)
    wx.setClipboardData({
      data: data,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log('复制到剪贴板', res.data) // data
          }
        })
      }
    })
  },

  // 新人拿货
  jumpNewManual: function (e) {
    // console.log(123)
    console.log(e.currentTarget)
    if (e.currentTarget.dataset.type == 'url') {
      wx.navigateTo({
        url: "/pages/selfShop/jumpexternal/jumpexternal?gaddressUlr=" + e.currentTarget.dataset.dataurl
      })
    } else if (e.currentTarget.dataset.type == 'special') {
      wx.navigateTo({
        url: "/pages/selfShop/index/newMan/newMan?id=" + e.currentTarget.dataset.dataurl
      })
    } else if (e.currentTarget.dataset.type == 'goods') {
      wx.navigateTo({
        url: '/pages/selfShop/buyDetail/buyDetail?goods_id=' + e.currentTarget.dataset.dataurl
      })
    }
  },

  // 爆品快抢跳转
  toExplosiveGoodsDetail: function (e) {
    wx.navigateTo({
      url: '/pages/selfShop/buyDetail/buyDetail?goods_promotion_type=2&goods_id=' + e.currentTarget.dataset.id
    })
  },

  // 比拼秒杀跳转
  toSeckillGoodsDetail: function (e) {
    console.log()
    wx.navigateTo({
      url: "/pages/selfShop/index/newMan/newMan?id=" + e.currentTarget.dataset.id
    })
  },
  // 限时折扣1-3
  discountGoodsDateil1: function () {
    console.log('限时折扣', this.data.newPeopleDetailList)
    let data = this.data.newPeopleDetailList.item;
    wx.navigateTo({
      url: "/pages/selfShop/index/newMan/newMan?id=" + data.rectangle1_data
    })
  },
  discountGoodsDateil2: function () {
    console.log('限时折扣', this.data.newPeopleDetailList)
    let data = this.data.newPeopleDetailList.item;
    wx.navigateTo({
      url: "/pages/selfShop/index/newMan/newMan?id=" + data.rectangle2_data
    })
  },
  discountGoodsDateil3: function () {
    console.log('限时折扣', this.data.newPeopleDetailList)
    let data = this.data.newPeopleDetailList.item;
    wx.navigateTo({
      url: "/pages/selfShop/index/newMan/newMan?id=" + data.square_data
    })
  },

  // 新人超值包邮 --》 1.3版热门板块
  // hotGoSpecial: function(e) {
  //   console.log(e.currentTarget.dataset.id)
  //   wx.navigateTo({
  //     url: "/pages/selfShop/index/newMan/newMan?id=" + e.currentTarget.dataset.id
  //   })
  // },

  // 分类推荐
  toClassifyGoodsDetail: function (e) {
    console.log(e.currentTarget.dataset)
    // wx.navigateTo({
    //   url: '/pages/selfShop/buyDetail/buyDetail?goods_id=' + e.currentTarget.dataset.id
    // })
    wx.navigateTo({
      url: "/pages/selfShop/index/newMan/newMan?id=" + e.currentTarget.dataset.xianshiid
    })
  },

  // 获取首页数据
  getIndexList: function () {
    var that = this;
    var obj = {
      // token: app.globalData.token,
      // v: app.globalData.v,
      // guid: app.globalData.guid,
    }
    app.fetch(app.globalData.url + '/mobile/index.php?act=index&op=index_ver2&t=json', obj, 'POST', 'application/json').then(res => {
      if (res.data.code == 200) {
        console.log(111111, res)
        if (res.data.data != null || res.data.data.length != 0) {
          var data = res.data.data.index_list;
          var home1 = [];
          var recommended_three_block = []
          for (var i = 0; i < data.length; i++) {
            //头部4个按钮组
            if (data[i].special_button) {
              that.setData({
                btnList: data[i].special_button.item
              })
              for (var j = 0; j < data[i].special_button.item.length; j++) {
                //新人专享
                if (data[i].special_button.item[j].data_suffix == 'recruits_exclusive') {
                  that.setData({
                    newManId: data[i].special_button.item[j].data
                  })
                }
                //限时抢购
                if (data[i].special_button.item[j].data_suffix == 'groupbuy') {
                  that.setData({
                    rushId: data[i].special_button.item[j].data
                  })
                  wx.setStorage({
                    key: "rushId",
                    data: data[i].special_button.item[j].data
                  })
                  break;
                  // wx.setStorageSync('rushId', data[i].special_button.item[j].data);
                }
                // else {
                //   wx.removeStorage({
                //     key: 'rushId',
                //     success(res) {
                //       console.log(res.data)
                //     }
                //   })
                //   console.log()
                // }
                //必拼秒杀
                if (data[i].special_button.item[j].data_suffix == 'spike') {
                  that.setData({
                    spikeId: data[i].special_button.item[j].data
                  })
                }
              }
            }
            //轮播图
            if (data[i].adv_list) {
              that.setData({
                imgUrls: data[i].adv_list
              })
            }
            //为你推荐模块
            if (data[i].goods) {
              if (data[i].goods.data_mode == 1) {
                that.goodsForYou();
                that.setData({
                  dataMode: true
                })
              }
              that.setData({
                recommendList: data[i].goods
              })
            }

            // 新人超值包邮
            if (data[i].home1) {
              that.data.newPeopleList.push(data[i].home1);
              home1 = that.data.newPeopleList[0]
              that.setData({
                newPeopleList: that.data.newPeopleList,
                home1: home1,
                isHome1SHow:true
              })
            }
            // 新人超值包邮
            // if (data[i].home2) {
            //   that.setData({
            //     newPeopleDetailList: data[i].home2
            //   })
            // }

            // 新人好礼
            // if (data[i].recommended_three_block) {
            //   recommended_three_block.push(data[i].recommended_three_block)
            //   that.setData({
            //     recommended_three_block:recommended_three_block
            //   })
            //   console.log('新人好礼', that.data.recommended_three_block)
            // }
            if (data[i].recommended_six_block) {
              console.log(123123123123123)
              // recommended_three_block.push(data[i].recommended_three_block)
              console.log(333,data[i].recommended_six_block)
              that.setData({
                recommended_six_block:data[i].recommended_six_block
              })
              console.log('新人好礼', that.data.recommended_six_block)
            }


            // 爆品快抢
            if (data[i].special_staunch) {
              // console.log(11111, data[i].special_staunch.item[0].end_time)
              // 判断数据是否为空
              if (data[i].special_staunch.item.length != 0) {
                //2019.3.11 如果活动时间已到则换到下一场活动
                for( var j=0;j<data[i].special_staunch.item.length;j++ ){
                  var nowTimestamp = Date.parse(new Date())/1000; //现在时间戳1000
                  var goodTimestamp = data[i].special_staunch.item[j].end_time; //活动结束时间戳
                  //活动进行中逻辑
                  if( nowTimestamp - goodTimestamp <= 0 ){
                    let endTime = data[i].special_staunch.item[j].end_time;
                    let nowTime = Date.parse(new Date()) / 1000;

                    that.setData({
                      specialList: data[i].special_staunch.item[j],
                      remainTime: endTime - nowTime,
                      clock: formatTime(endTime - nowTime),
                    })
                    // 调用倒计时
                    clearTimeOut();
                    if (that.data.remainTime) {
                      conutDown(that)
                    }
                    break;
                  }
                }
                // let endTime = data[i].special_staunch.item[0].end_time;
                // let nowTime = Date.parse(new Date()) / 1000;

                // that.setData({
                //   specialList: data[i].special_staunch,
                //   remainTime: endTime - nowTime,
                //   clock: formatTime(endTime - nowTime),
                // })
                // // 调用倒计时
                // clearTimeOut();
                // if (that.data.remainTime) {
                //   conutDown(that)
                // }
              } else {
                that.setData({
                  specialList: data[i].special_staunch,
                  remainTime: 0,
                  clock: formatTime(0),
                  isExplosiveHide: false
                })
                // 调用倒计时
                clearTimeOut();
                if (that.data.remainTime) {
                  conutDown(that)
                }
              }

            } else {
              that.setData({
                isExplosiveHide: false
              })
            }

            // 严选好物
            if (data[i].home3) {
              for (let j = 0; j < data[i].home3.item.length; j++) {
                // console.log('严选好物', data[i].home3.item[j].image)
                data[i].home3.item[j].image = data[i].home3.item[j].image + '!j600';
              }
              // console.log('严选好物',data[i].home3)

              that.setData({
                strictSelectionList: data[i].home3.item
              })
            }

            // 比拼秒杀
            if (data[i].special_begin) {
              // console.log('比拼秒杀', data[i].special_begin.item)
              // 判断比拼秒杀是否为空
              // console.log(12312)
              if (data[i].special_begin.item.length != 0) {
                // 获取第一个商品的结束时间
                let endTime = data[i].special_begin.item[0].end_time;
                let nowTime = Date.parse(new Date()) / 1000;

                for (let j = 0; j < data[i].special_begin.item.length; j++) {
                  // console.log('比拼秒杀', data[i].special_begin.item[j].special_banner_index)
                  data[i].special_begin.item[j].special_banner_index += '!j600';
                }

                that.setData({
                  specialBeginList: data[i].special_begin,
                  remainTime2: endTime - nowTime,
                  clock2: formatTime2(endTime - nowTime),
                  // isSpeialHide: true
                })

                // 调用倒计时
                clearTimeOut2();
                if (that.data.remainTime2) {
                  conutDown2(that)
                }
              } else {
                that.setData({
                  specialBeginList: data[i].special_begin,
                  remainTime2: 0,
                  clock2: formatTime2(0),
                  isSpeialHide: false
                })

                if (that.data.remainTime2) {
                  conutDown2(that)
                }
              }
              // return false;


            }else {
              that.setData({
                isSpeialHide: false
              })
            }
            /* 分类推荐 */
            if (data[i].special_plate) {
              var obj = data[i].special_plate;
              for (let j = 0; j < obj.item.length; j++) {
                // banner 大图
                obj.item[j].special_banner_index += '!j600';

                // 商品小图
                for (let k = 0; k < obj.item[j].goods.length; k++) {
                  obj.item[j].goods[k].goods_image += '!j600';

                }
                // console.log('拼接后',obj.item[j].special_banner_index)
              }
              // console.log('严选好物',obj)
              that.setData({
                specialPlateList: obj
                // specialPlateList:[]
              })
            }

          }
        }
      }
    })
  },

  // 获取浮层数据
  getFloatData:function() {
    var that = this;
    app.fetch(app.globalData.url + '/mobile/index.php?act=floating&op=get_float_data', "POST").then(res => {
      console.log('浮层数据', res)
      if (res.data.code == 200) {
        wx.setStorageSync('floatData',res.data.data.returns)
        // that.setData({
        //   floatData:res.data.data.returns
        // })
      } else if (res.data.code == 400) {
        console.log('浮层error')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var sliderWidth = 140/2; // 需要设置slider的宽度，用于计算中间位置
    
    wx.getSystemInfo({
        success: function(res) {
            console.log((res.windowWidth * 0.8 / that.data.tabs.length - sliderWidth) / 2)
            that.setData({
                sliderLeft: (res.windowWidth * 0.8 / that.data.tabs.length - sliderWidth) / 2,
                sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
            });
        }
    });

    wxtime.start(this);
    that.getGoodsClassList() // 获取分类商品
    that.getIndexList() // 获取首页
    
    // that.getIndexList() // 获取首页
  },
  //如果首页接口 为你推荐模块 data_mode == 1时调用此接口
  goodsForYou() {
    var that = this;
    var obj = {
      curpage: that.data.curpage,
      page: that.data.page
    }
    app.fetch(app.globalData.url + '/mobile/index.php?act=index&op=index_ver2_goods&t=json', obj, 'POST', 'application/json').then(res => {
      if (res.data.code == 200) {
        if (res.data.data.goods_list.length == 0) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 2000
          })
        }
        for (var i = 0; i < res.data.data.goods_list.length; i++) {
          res.data.data.goods_list[i].goods_image_url = res.data.data.goods_list[i].goods_image_url + '!j350h';

          that.data.recommendList.item.push(res.data.data.goods_list[i])
        }
        // console.log('为你推荐', res.data.data.goods_list)
        that.setData({
          recommendList: that.data.recommendList
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.supernatant = this.selectComponent('#supernatant')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    this.getIndexList();

    let floatData = wx.getStorageSync('floatData');
 
    if (floatData.length == 0 || floatData == '') {
      console.log(123)
      this.getFloatData(); // 获取浮层数据
    }
    that.trigger();
    clearInterval(this.data.floatTimer)
    // 获取浮层的虚拟数据，每十秒更换一次
    this.data.floatTimer = setInterval(function () {
      that.trigger();
    }, 13000);
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
    var that = this;
    if (this.data.dataMode) {
      this.setData({
        curpage: that.data.curpage += 1,
      })
      this.goodsForYou();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})