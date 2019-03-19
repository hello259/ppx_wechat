// pages/tourDiy/tourDiy.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsDetail: [], // 商品详细
        imgUrls: [
            // '../../../images/detail-img/fengjing.jpg',
            // '../../../images/detail-img/fengjing.jpg',
            // '../../../images/detail-img/fengjing.jpg',
            // '../../../images/detail-img/fengjing.jpg',
            // '../../../images/detail-img/fengjing.jpg',
            // '../../../images/detail-img/fengjing.jpg',
            // '../../../images/detail-img/fengjing.jpg'
        ],
        indicatorDots: true, // 面板指示点s
        autoplay: true, // 自动轮播
        interval: 3000, // 自动切换时间间隔
        duration: 1000, // 滑动动画时长
        current: 1, // 获取轮播图索引
        w: [],
        randonNum: '' // 月销量随机数
    },

    /* 获取轮播图当前是索引 */
    swiperChange: function(e) {
        // console.log(e)
        let than = this;
        than.setData({
            current: e.detail.current + 1
        })
    },
    bindanimationfinish: function(e) {

        this.setData({

            current: e.detail.current

        })

    },

    // 发送请求
    RTS: function(id) {
        var _that = this;
        console.log(_that)
        var obj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            // goods_id: 100997
            goods_id: id
        }

        app.fetch(app.globalData.url + "/mobile/index.php?act=goods&op=goods_detail&t=json", obj, "post",'application/json').then(res => {
            console.log(res.data)
            if (res.data.code == 200) {
                _that.setData({
                    goodsDetail: res.data.data
                })
                var jsonStr = _that.data.goodsDetail.goods_image_arr;
                _that.shift(jsonStr)

                console.log(_that.data.imgUrls)

            } else if (res.data.code == 400) {
                console.log(res.data.code)
            } else if (res.data.code == 401) {
                console.log(res.data.code)
            }
        })
    },

    // 轮播图转换格式
    shift: function(obj) {
        var arr = [];
        for (var i in obj) {
            obj[i] = obj[i].replace(" ", "");
            if (typeof obj[i] != 'object') {
                obj[i] = obj[i].replace(/\ufeff/g, ""); //重点
                var jj = JSON.parse(obj[i]);
                // console.log(jj)
            }
            arr.push(jj)
        }
        // console.log(arr)
        this.setData({
            imgUrls: arr
        })
    },

    // 随机月销量
    randomNum: function(lowerValue, upperValue) {
        this.setData({
            randomNum: Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(query) {
        console.log(query)
            // this.swiperChange(options)
        this.RTS(query.goods_id);
        console.log(12313)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        console.log(222222)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // this.setData({
        //     goodsColorIndex: 99999,
        //     goodsSizeIndex: 99999
        // })
        console.log(33333)
        this.randomNum(200, 1000)
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