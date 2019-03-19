var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },//滚动条位置
    placeholder:'搜索你喜欢的商品',
    isbottom:false,//是否到底部
    isstock: '',//是否有货
    salesTop:'',//销量倒序
    salesBottom:'',//销量正序
    newTop:'',//浏览量倒序
    newBottom:'',//浏览量正序
    priceTop:'',//价格倒序
    priceBottom:'',//价格正序
    searchValue:'',//查询的关键字
    curpage:1,//页数，默认：1
    page:20,//每页显示多少条商品
    bid:'',//品牌ID
    storeid:'',//商家id
    goodsstorage:'',//是否只展示有货的商品（goods_storage=1只展示有货商品）
    key:'',//排序字段（1=按销量排序，2=按浏览量排序，3=按价格排序），默认是自营商品后发布排前
    order:'',//倒序或正序（0=倒序，1=是正序），默认0，此字段配合key字段使用
    areaid:'',//区域ID
    gift:'',//是否有赠品（0=所有，1=有赠品）
    type:'',//是否自营商品（0=所有，1=自营）
    searchList: []//搜索结果
  },
  onFocus: function (e) {
    console.log(1)
    this.setData({
      placeholder: " "
    })
  },
  onBlur: function (e) {
    this.setData({
      placeholder: "选择您要批发的商品"
    })
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
  scrollbottom:function(e){
    var that = this;
    this.data.curpage += 1;
    var obj = {
      token: app.globalData.token,
      v: app.globalData.v,
      guid: app.globalData.guid,
      keyword: that.data.searchValue,
      page:that.data.page,
      curpage:that.data.curpage,
      bid:that.data.bid,
      storeid:that.data.storeid,
      goodsstorage:that.data.goodsstorage,
      key:that.data.key,
      order:that.data.order,
      areaid:that.data.areaid,
      gift:that.data.gift,
      type:that.data.type
    }
    this.searchfn(obj);
  },
  // 筛选
  screen:function(e){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.goTopFun();
    var that = this;
    //销量
    if(e.target.dataset.type == 'sales'){
      if(this.data.salesTop == ''){
        this.setData({
          key: 1,
          order: 1,
          salesTop: 'active',
          salesBottom: '',
          newTop: '',
          newBottom: '',
          priceTop: '',
          priceBottom: '',
          curpage:1,
          isbottom:false
        })
        var obj = {
          token: app.globalData.token,
          v: app.globalData.v,
          guid: app.globalData.guid,
          keyword: that.data.searchValue,
          curpage:1,
          page:20,
          bid:that.data.bid,
          storeid:that.data.storeid,
          goodsstorage:that.data.goodsstorage,
          key:that.data.key,
          order:that.data.order,
          areaid:that.data.areaid,
          gift:that.data.gift,
          type:that.data.type
        }
        this.searchfn(obj);
      }else{
        this.setData({
          key: 1,
          order: 0,
          salesTop: '',
          salesBottom: 'active',
          newTop: '',
          newBottom: '',
          priceTop: '',
          priceBottom: '',
          curpage:1,
          isbottom:false
        })
        var obj = {
          token: app.globalData.token,
          v: app.globalData.v,
          guid: app.globalData.guid,
          keyword: that.data.searchValue,
          curpage:1,
          page:20,
          bid:that.data.bid,
          storeid:that.data.storeid,
          goodsstorage:that.data.goodsstorage,
          key:that.data.key,
          order:that.data.order,
          areaid:that.data.areaid,
          gift:that.data.gift,
          type:that.data.type
        }
        this.searchfn(obj);
      }
    }
    //新品
    if(e.target.dataset.type == 'new'){
      if(this.data.newTop == ''){
        this.setData({
          key: 2,
          order: 1,
          newTop: 'active',
          newBottom: '',
          salesTop: '',
          salesBottom: '',
          priceTop: '',
          priceBottom: '',
          curpage:1,
          isbottom:false
        })
        var obj = {
          token: app.globalData.token,
          v: app.globalData.v,
          guid: app.globalData.guid,
          keyword: that.data.searchValue,
          curpage:1,
          page:20,
          bid:that.data.bid,
          storeid:that.data.storeid,
          goodsstorage:that.data.goodsstorage,
          key:that.data.key,
          order:that.data.order,
          areaid:that.data.areaid,
          gift:that.data.gift,
          type:that.data.type
        }
        this.searchfn(obj);
      }else{
        this.setData({
          key: 2,
          order: 0,
          newTop: '',
          newBottom: 'active',
          salesTop: '',
          salesBottom: '',
          priceTop: '',
          priceBottom: '',
          curpage:1,
          isbottom:false
        })
        var obj = {
          token: app.globalData.token,
          v: app.globalData.v,
          guid: app.globalData.guid,
          keyword: that.data.searchValue,
          curpage:1,
          page:20,
          bid:that.data.bid,
          storeid:that.data.storeid,
          goodsstorage:that.data.goodsstorage,
          key:that.data.key,
          order:that.data.order,
          areaid:that.data.areaid,
          gift:that.data.gift,
          type:that.data.type
        }
        this.searchfn(obj);
      }
    }
    //价格
    if(e.target.dataset.type == 'price'){
      if(this.data.priceTop == ''){
        this.setData({
          key: 3,
          order: 1,
          priceTop: 'active',
          priceBottom: '',
          salesTop: '',
          salesBottom: '',
          newTop: '',
          newBottom: '',
          curpage:1,
          isbottom:false
        })
        var obj = {
          token: app.globalData.token,
          v: app.globalData.v,
          guid: app.globalData.guid,
          keyword: that.data.searchValue,
          curpage:1,
          page:20,
          bid:that.data.bid,
          storeid:that.data.storeid,
          goodsstorage:that.data.goodsstorage,
          key:that.data.key,
          order:that.data.order,
          areaid:that.data.areaid,
          gift:that.data.gift,
          type:that.data.type
        }
        this.searchfn(obj);
      }else{
        this.setData({
          key: 3,
          order: 0,
          priceTop: '',
          priceBottom: 'active',
          salesTop: '',
          salesBottom: '',
          newTop: '',
          newBottom: '',
          curpage:1,
          isbottom:false
        })
        var obj = {
          token: app.globalData.token,
          v: app.globalData.v,
          guid: app.globalData.guid,
          keyword: that.data.searchValue,
          curpage:1,
          page:20,
          bid:that.data.bid,
          storeid:that.data.storeid,
          goodsstorage:that.data.goodsstorage,
          key:that.data.key,
          order:that.data.order,
          areaid:that.data.areaid,
          gift:that.data.gift,
          type:that.data.type
        }
        this.searchfn(obj);
      }
    }
    //显示有货
    if(e.target.dataset.type == 'stock'){
      if(this.data.isstock == ''){
        this.setData({
          isstock: 'isstock',
          goodsstorage: 1,
          curpage:1,
          isbottom:false
        })
        var obj = {
          token: app.globalData.token,
          v: app.globalData.v,
          guid: app.globalData.guid,
          keyword: that.data.searchValue,
          curpage:1,
          page:20,
          bid:that.data.bid,
          storeid:that.data.storeid,
          goodsstorage:that.data.goodsstorage,
          key:that.data.key,
          order:that.data.order,
          areaid:that.data.areaid,
          gift:that.data.gift,
          type:that.data.type
        }
        this.searchfn(obj);
      }else{
        this.setData({
          isstock: '',
          goodsstorage: '',
          curpage:1,
          isbottom:false
        })
        var obj = {
          token: app.globalData.token,
          v: app.globalData.v,
          guid: app.globalData.guid,
          keyword: that.data.searchValue,
          curpage:1,
          page:20,
          bid:that.data.bid,
          storeid:that.data.storeid,
          goodsstorage:that.data.goodsstorage,
          key:that.data.key,
          order:that.data.order,
          areaid:that.data.areaid,
          gift:that.data.gift,
          type:that.data.type
        }
        this.searchfn(obj);
      }
    }
  },
  // 搜索
  handleSearch(e){
    var that = this;
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.setData({
      key: '',
      order: '',
      salesTop: '',
      salesBottom: '',
      newTop: '',
      newBottom: '',
      priceTop: '',
      priceBottom: '',
      curpage:1,
      page:20,
      isbottom:false
    })
    that.setData({
      searchValue:e.detail.value
    })
    var obj = {
      token: app.globalData.token,
      v: app.globalData.v,
      guid: app.globalData.guid,
      keyword: that.data.searchValue,
      page:that.data.page,
      curpage:that.data.curpage,
      bid:that.data.bid,
      storeid:that.data.storeid,
      goodsstorage:that.data.goodsstorage,
      key:'',
      order:that.data.order,
      areaid:that.data.areaid,
      gift:that.data.gift,
      type:that.data.type
    }
    this.searchfn(obj);
  },
  onFocus: function (e) {
    this.setData({
      placeholder: " "
    })
  },
  onBlur: function (e) {
    this.setData({
      placeholder: "搜索你喜欢的商品"
    })
  },
  searchClear(){
    // this.setData({
    //   inputValue:''
    // })
    // this.getInit();
    wx.navigateTo({      //关闭当前页面，跳转到应用内的某个页面（这个跳转有个坑，就是跳转页面后页面会闪烁一下，完全影响了我自己的操作体验，太缺德了。）
      url:"/pages/selfShop/index/search/search"
    })
  },
  toDetail:function(e){
    wx.navigateTo({
      url: '/pages/selfShop/buyDetail/buyDetail?goods_id=' + e.currentTarget.dataset.id
    })
  },
  searchfn:function(obj){
    var that = this;
    app.fetch(app.globalData.url+'/mobile/index.php?act=goods&op=goods_list', obj, 'get', 'application/json').then(res => {
      if (res.data.code == 200) {
        if (res.data.data != null || res.data.data.length != 0) {
          var resList = res.data.data.goods_list;
          if( resList.length == 0 ){
            if( that.data.isbottom == false ){
              wx.showToast({
                title: '暂无商品',
                icon: "none",
                duration: 2000,
                success() {
                }
              })
            }
            that.data.isbottom = true;
          }
          if( that.data.curpage>1 ){
            for(var i=0;i<resList.length;i++){
              that.data.searchList.push(resList[i])
            }
            this.setData({
              searchList:that.data.searchList
            })
          }else{
            this.setData({
              searchList:resList
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if( options.inputValue ){
      this.setData({
        searchValue:options.inputValue
      })
    }
    var that = this;
    var obj = {
      // token: app.globalData.token,
      // v: app.globalData.v,
      // guid: app.globalData.guid,
      keyword: that.data.searchValue,
      page:that.data.page,
      curpage:that.data.curpage,
      bid:that.data.bid,
      storeid:that.data.storeid,
      goodsstorage:that.data.goodsstorage,
      key:that.data.key,
      order:that.data.order,
      areaid:that.data.areaid,
      gift:that.data.gift,
      type:that.data.type
    }
    this.searchfn(obj);
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
    var that = this;
    if( that.data.isbottom ){
      return
    }
    this.data.curpage += 1;
    var obj = {
      token: app.globalData.token,
      v: app.globalData.v,
      guid: app.globalData.guid,
      keyword: that.data.searchValue,
      page:that.data.page,
      curpage:that.data.curpage,
      bid:that.data.bid,
      storeid:that.data.storeid,
      goodsstorage:that.data.goodsstorage,
      key:that.data.key,
      order:that.data.order,
      areaid:that.data.areaid,
      gift:that.data.gift,
      type:that.data.type
    }
    this.searchfn(obj);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})