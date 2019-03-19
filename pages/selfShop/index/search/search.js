var app = getApp();
Page({
  data: {
    pageNum: 1,//页码
    totalPage:'',//总页数
    // hotList:[{name:'产品运营',id:1},{name:'产品运营',id:1},{name:'产品运营',id:1},{name:'产品运营',id:1},{name:'产品运营',id:1},{name:'产品运营',id:1}],
    inputValue: "",
    searchData: wx.getStorageSync("searchData") || [],
    keyWorld:'',
    placeholder:'选择您要批发的商品',
    recommendList: [], //推荐搜索
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
  // 历史搜索
  historySearch(e){
    var keywork = e.target.dataset.keywork;
    wx.redirectTo({    
      url:"/pages/selfShop/index/searchList/searchList?inputValue=" + keywork
    })
  },
// 点击搜索
  searchClear(){
    var that = this;
    if(this.data.searchData.indexOf(this.data.inputValue)== -1 && this.data.inputValue != ''){
      this.data.searchData.push(this.data.inputValue)
    }
    wx.setStorageSync("searchData", this.data.searchData);
    var inputValue = this.data.inputValue;
    this.getInit();
    wx.redirectTo({      //关闭当前页面，跳转到应用内的某个页面（这个跳转有个坑，就是跳转页面后页面会闪烁一下，完全影响了我自己的操作体验，太缺德了。）
      url:"/pages/selfShop/index/searchList/searchList?inputValue=" + inputValue
    })
  },
// 点击搜索??
  searchValueInput(e){
      var value = e.detail.value;
      this.setData({
        inputValue: value,
      });
      // this.handleSearch()
  },
// 点击搜索跳转页面
  handleSearch(){
   // indexOf判断数组里是否存在改元素
    if(this.data.searchData.indexOf(this.data.inputValue)== -1){
      this.data.searchData.push(this.data.inputValue)
    }
    wx.setStorageSync("searchData", this.data.searchData);
    this.getInit();
   // 跳转到搜索列表页
    // wx.switchTab({
    //   url:'./search-list/search-list'
    // })
  },
// 清空历史记录
  handleClear(e){
    wx.removeStorageSync("searchData");
    this.setData({
      searchData : []
    })
    this.getInit();
    },

// 初始化数据
  getInit(){
    var that = this;
    var Data = this.data
    wx.getStorage({
      key: 'searchData',
      success(res) {
        that.setData({
          searchData:res.data
        })
      }
    })
    this.setData({
      // hotList:Data.hotList,
      inputValue: "",
      searchData:Data.searchData
    })
  },
  //获取推荐搜索
  getRecommend(){
    var that = this;
    app.fetch(app.globalData.url + '/mobile/index.php?act=index&op=indexRecommendTerms&t=json', {}, 'POST', 'application/json').then(res => {
      if (res.data.code == 200) {
        if( !res.data.data.recommend_terms ){

        }else{
          that.setData({
            recommendList:res.data.data.recommend_terms
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
  confirm(e){
    console.log(e)
  },
  onLoad: function (options) {
    this.getInit();
    this.getRecommend();
  },
})