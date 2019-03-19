var app = getApp();
Page({
  data: {
    tabs: ["全部", "待付款", "待发货", "待收货", "已完成"],
    activeIndex: 0,//顶部导航激活项
    sliderOffset: 0,
    sliderLeft: 0,
    curpage: 1,//页码
    page: 10, //每页数量,
    allOrder: [], //所有订单,
    isshow:false,
    orderId:'', //确认收货订单id
    img:'' //确认收货第一张商品图片
  },

  onLoad: function (option) {
    var type = app.globalData.orderList;
    var that = this;
    console.log(type)
    if( type == 'undefined' || type == null || type == '' || type == 0 ){
      that.searchAllOrder('', 1, );
    }else if( type == 1 ){
      that.setData({
        activeIndex: 1
      })
      that.searchAllOrder(10, 1);
    }else if( type == 2 ){
      that.setData({
        activeIndex: 2
      })
      that.searchAllOrder(20, 1);
    }else if( type == 3 ){
      that.setData({
        activeIndex: 3
      })
      that.searchAllOrder(30, 1);
    }else if( type == 4 ){
      that.setData({
        activeIndex: 4
      })
      that.searchAllOrder(40, 1);
    }else{
      that.searchAllOrder('', 1);
    }
    wx.getSystemInfo({
      success: function (res) {
        var sliderWidth = 78 / 2;
        // console.log((res.windowWidth / that.data.tabs.length - sliderWidth) / 2)
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    
  },
  onShow(){
    var that = this;
    if( this.data.activeIndexBack ){
      this.setData({
        allOrder:[],
        curpage:1,
        activeIndex:that.data.activeIndexBack
      })
      if( that.data.activeIndex == 1 ){
        that.searchAllOrder(10, 1);
      }else if( that.data.activeIndex == 2 ){
        that.searchAllOrder(20, 1);
      }else if( that.data.activeIndex == 3 ){
        that.searchAllOrder(30, 1);
      }else if( that.data.activeIndex == 4 ){
        that.searchAllOrder(40, 1);
      }else if( that.data.activeIndex == 0 ){ 
        that.searchAllOrder('', 1);
      }
      wx.getSystemInfo({
        success: function (res) {
          var sliderWidth = 78 / 2;
          // console.log((res.windowWidth / that.data.tabs.length - sliderWidth) / 2)
          that.setData({
            sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
            sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
          });
        }
      });
    }else{
      this.setData({
        allOrder:[],
        curpage:1
      })


      var type = app.globalData.orderList;
      if (type == 'undefined' || type == null || type == '' || type == 0 ) {
        that.setData({
          activeIndex: 0
        })
        that.searchAllOrder('', 1);
      } else if (type == 1) {
        that.setData({
          activeIndex: 1
        })
        that.searchAllOrder(10, 1);
      } else if (type == 2) {
        that.setData({
          activeIndex: 2
        })
        that.searchAllOrder(20, 1);
      } else if (type == 3) {
        that.setData({
          activeIndex: 3
        })
        that.searchAllOrder(30, 1);
      } else if (type == 4) {
        that.setData({
          activeIndex: 4
        })
        that.searchAllOrder(40, 1);
      } else {
        that.setData({
          activeIndex: 0
        })
        that.searchAllOrder('', 1);
      }

      wx.getSystemInfo({
        success: function (res) {
          var sliderWidth = 78 / 2;
          // console.log((res.windowWidth / that.data.tabs.length - sliderWidth) / 2)
          that.setData({
            sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
            sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
          });
        }
      });


      // console.log(this.data.allOrder)
      // if( that.data.activeIndex == 1 ){
      //   that.searchAllOrder(10, 1);
      // }else if( that.data.activeIndex == 2 ){
      //   that.searchAllOrder(20, 1);
      // }else if( that.data.activeIndex == 3 ){
      //   that.searchAllOrder(30, 1);
      // }else if( that.data.activeIndex == 4 ){
      //   that.searchAllOrder(40, 1);
      // }else if( that.data.activeIndex == 0 ){ 
      //   that.searchAllOrder('', 1);
      // }
    }
    
    // this.onLoad();
  },
  formatPrice(price){
    return Math.ceil(price * 100).toFixed(2) / 100
  },
  //去订单详情
  toOrderDetail(e){
    wx.navigateTo({
      url:'/pages/selfShop/myCenter/orderConfirm/orderConfirm?orderId=' + e.currentTarget.dataset.orderid + '&index=' + this.data.activeIndex
    })
  },
  //查物流
  toExpress(e){
    wx.navigateTo({
      url: '/pages/selfShop/myCenter/express/express?orderId=' + e.currentTarget.dataset.orderid
    })
  },
  //去支付页
  toPayPage(e){
    // var list = this.data.allOrder[ e.currentTarget.dataset.orderitem ].order_list[0].extend_order_goods;
    // var str = '';
    // for(var i=0;i<list.length;i++){
    //   list[i].goods_id
    //   list[i].goods_num
    //   str += list[i].goods_id + '|' + list[i].goods_num + ','
    // }
    // str = str.substr(0,str.length-1);
    wx.navigateTo({
      // url:'/pages/selfShop/cart/orderConfirm/orderConfirm?pay_sn=' + e.currentTarget.dataset.orderkey + '&order_id=' + e.currentTarget.dataset.orderid + "&cart_id=" + str + '&ifcart=0'
      url:'/pages/selfShop/cart/orderConfirm/orderConfirm?pay_sn=' + e.currentTarget.dataset.orderkey + '&order_id=' + e.currentTarget.dataset.orderid + "&type=1"
    })
  },
  // 去评价
  toComment(e){
    wx.navigateTo({
      url: '/pages/selfShop/myCenter/pushComment/pushComment?orderId=' + e.currentTarget.dataset.orderid + '&activeIndex=' + this.data.activeIndex
    })
  },
  //取消确认收货弹窗
  goodsCancelBtn(){
    this.setData({
      isshow:false
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
        this.setData({
          allOrder:[],
          curpage:1,
          isshow:false
        })
        if( that.data.activeIndex == 1 ){
          that.searchAllOrder(10, 1);
        }else if( that.data.activeIndex == 2 ){
          that.searchAllOrder(20, 1);
        }else if( that.data.activeIndex == 3 ){
          that.searchAllOrder(30, 1);
        }else if( that.data.activeIndex == 4 ){
          that.searchAllOrder(40, 1);
        }else if( that.data.activeIndex == 0 ){ 
          that.searchAllOrder('', 1);
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
  //确认收货
  takeGoods(e){
    var that = this;
    this.setData({
      isshow:true,
      orderId: e.currentTarget.dataset.orderid,
      img: e.currentTarget.dataset.img
    })
  },
  //所有状态订单查询
  searchAllOrder(state, pageNum) {
    var that = this;
    var msgobj = {
      token: app.globalData.token,
      v: app.globalData.v,
      guid: app.globalData.guid,
      client: app.globalData.client,
      order_state: state,
      evaluation_state: '',
      curpage: pageNum,
      page: that.data.page
    }
    app.fetch(app.globalData.url + '/mobile/index.php?act=member_order&op=order_list&t=json', msgobj, 'POST', 'application/json').then(res => {
      if (res.data.code == 200) {
        console.log(that.data.allOrder)
        var reslist = res.data.data.order_group_list;
        if( !reslist || reslist.length == 0 || reslist == null ){
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if( that.data.curpage == 1 ){
          that.setData({
            allOrder: []
          })
        }
        //判断有哪些按钮
        for (var i = 0; i < reslist.length; i++) {
          if (reslist[i].order_list[0].order_state == 0) { //0已取消 无按钮
            reslist[i].order_list.push({ noBtn: true });
          } else if (reslist[i].order_list[0].order_state == 10) { //10未付款 立刻支付
            reslist[i].order_list.push({ payBtn: true });
          } else if (reslist[i].order_list[0].order_state == 20) { //20已付款 取消订单 
            reslist[i].order_list.push({ cancelOrderBtn: true});
          } else if (reslist[i].order_list[0].order_state == 30) { //30已发货 查看物流 确定收货
            reslist[i].order_list.push({ checkExpressBtn: true, makeGoods: true });
          } else if (reslist[i].order_list[0].order_state == 40 && reslist[i].order_list[0].evaluation_state == 0) { //40已收货 0未评价 查看物流 去评价
            reslist[i].order_list.push({ checkExpressBtn: true, evaluate: true });
          } else if (reslist[i].order_list[0].order_state == 40 && reslist[i].order_list[0].evaluation_state == 1) { //40已收货 1已评价 查看物流
            reslist[i].order_list.push({ checkExpressBtn: true });
          } else if (reslist[i].order_list[0].order_state == 40 && reslist[i].order_list[0].evaluation_state == 2) { //40已收货 2已过期未评价 查看物流
            reslist[i].order_list.push({ checkExpressBtn: true });
          }
          that.data.allOrder.push(reslist[i])
        }
        that.setData({
          allOrder: that.data.allOrder
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
  tabClick: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    var that = this;
    app.globalData.orderList = e.currentTarget.id
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      allOrder:[],
      curpage:1
    });
    if (e.currentTarget.id == 0) {
      that.searchAllOrder(0, 1)
    } else if (e.currentTarget.id == 1) {
      that.searchAllOrder(10, 1)
    } else if (e.currentTarget.id == 2) {
      that.searchAllOrder(20, 1)
    } else if (e.currentTarget.id == 3) {
      that.searchAllOrder(30, 1)
    } else if (e.currentTarget.id == 4) {
      that.searchAllOrder(40, 1)
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    that.setData({
      curpage:that.data.curpage += 1
    })
    if (that.data.activeIndex == 0) {
      that.searchAllOrder(0, that.data.curpage)
    } else if (that.data.activeIndex == 1) {
      that.searchAllOrder(10, that.data.curpage)
    } else if (that.data.activeIndex == 2) {
      that.searchAllOrder(20, that.data.curpage)
    } else if (that.data.activeIndex == 3) {
      that.searchAllOrder(30, that.data.curpage)
    } else if (that.data.activeIndex == 4) {
      that.searchAllOrder(40, that.data.curpage)
    }
  },
})