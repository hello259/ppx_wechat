// pages/tourDiy/tourDiy.js
var app = getApp();
import { formatTime, conutDown, clearTimeOut } from '../../../utils/common';
import { formatTime2, conutDown2, clearTimeOut2 } from '../../../utils/common2';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsDetail: [], // 商品详细
        imgUrls: [],  // 轮播图
        indicatorDots: false, // 面板指示点s
        autoplay: true, // 自动轮播
        interval: 3000, // 自动切换时间间隔
        duration: 1000, // 滑动动画时长
        remainTime: 0, // 倒计时1
        clock: formatTime(0),
        remainTime2: 600, // 倒计时2
        clock2: formatTime2(600),
        current: 1, // 获取轮播图索引
        nowDone: 3, // 拼成数量
        pastDone: 200, //  已拼成数量
        ptInfo: [], // 拼团信息
        people: 4, // 当前拼团人数
        collect: '../../../images/detail-img/collect-1@2x.png', // 收藏
        cart: '../../../images/detail-img/cart-1@2x.png', // 购物车
        isCollect: false, // 判断是否收藏
        isCart: false, // 判断用户购物车的点击
        goodsMaskFlag: true, // 遮罩层
        PTMaskFlag: true,
        nowPt: true, // 正在拼团显示隐藏
        goToPt: true, // 去拼团显示隐藏
        goodsSelect: false, // 商品选择框显示隐藏
        buyNumber: 1, // 购买数量，默认1
        ptOrBuy: '', // 发起拼团或直接购买
        goodsTAG: '', // 商品购买或拼团标识符
        goodsClassify: [], // 商品分类
        goodsClassifyName: [],
        goodsClassifyValue: [],
        getSelectedValue: '', // 商品分类的name
        valueSign: '', // 商品分类的Value
        isGoodsSelect: true, // 判断用户选择的标识
        selected_arr: [], // 存储用户选择商品的数量
        selectGoodsPrice: '', // 选择完规格后的价格
        goodsTotal: 0, // 购物车商品数量
        ptImgList: [
            '../../../images/detail-img/fengjing.jpg',
            '../../../images/detail-img/fengjing.jpg',
            '../../../images/detail-img/fengjing.jpg',
            '../../../images/detail-img/fengjing.jpg',
            '../../../images/detail-img/fengjing.jpg',
            '../../../images/detail-img/fengjing.jpg',
            '../../../images/detail-img/fengjing.jpg',
            '../../../images/detail-img/fengjing.jpg',
            '../../../images/detail-img/fengjing.jpg',
            '../../../images/detail-img/fengjing.jpg',
            '../../../images/detail-img/fengjing.jpg'
        ]  // 假数据

    },

    /* 获取轮播图当前是索引 */
    swiperChange: function (e) {
        // console.log(e)
        let than = this;
        than.setData({
            current: e.detail.current + 1
        })
    },

    // 防止图片抖动
    bindanimationfinish: function (e) {
        this.setData({
            current: e.detail.current
        })
    },

    /* 正在拼团显示 */
    handlerShow: function () {
        this.setData({
            nowPt: false,
            PTMaskFlag: false
        })
    },

    /* 正在拼团关闭 */
    handlerClose: function () {
        this.setData({
            nowPt: true,
            PTMaskFlag: true
        })
    },

    /* 去拼团显示 */
    goToShow: function () {
        this.setData({
            goToPt: false,
            PTMaskFlag: false
        })
    },

    /* 去拼团关闭 */
    goToClose: function () {
        this.setData({
            goToPt: true,
            PTMaskFlag: true
        })
    },
    /* 点击收藏 */
    // handlerCollect: function () {
    //     this.isCollect = !this.isCollect;
    //     if (this.isCollect) {
    //         this.setData({
    //             collect: '../../../images/detail-img/collect@2x.png'
    //         })
    //     } else {
    //         this.setData({
    //             collect: '../../../images/detail-img/collect-1@2x.png'
    //         })
    //     }
    // },

    /* 点击购物车跳转*/

    handlerCart: function () {
        let that = this;
        that.setData({
            cart: '../../../images/detail-img/cart@2x.png'
        })

        setTimeout(function () {
            that.setData({
                cart: '../../../images/detail-img/cart-1@2x.png'
            })
        }, 1000)
    },

    // 直接购买
    handlerBuy: function () {
        this.setData({
            ptOrBuy: '直接购买',
            goodsTAG: 1,
            goodsSelect: true,
            goodsMaskFlag: false
        })
        // console.log(this.data.goodsTAG)
    },

    // 发起拼团
    handlerPt: function () {
        this.setData({
            ptOrBuy: '发起批发',
            goodsTAG: 2,
            goodsSelect: true,
            goodsMaskFlag: false
        })
        console.log(this.data.goodsTAG)
    },

    // 商品选择框隐藏
    handlerGoodsSelectHide: function () {
        this.setData({
            goodsSelect: false,
            goodsMaskFlag: true
        })
    },

    // 商品减少
    handlerGoodsSubtract: function () {
        var num = this.data.buyNumber;
        // 如果大于1时，才可以减  
        if (num > 1) {
            num--;
        }

        // 将数值与状态写回  
        this.setData({
            buyNumber: num
        });
    },

    // 商品增加
    handlerGoodsAdd: function () {
        var num = this.data.buyNumber;

        num++;

        // 将数值与状态写回  
        this.setData({
            buyNumber: num
        });
    },
    // 商品分类选择
    handlerGoodsSelect: function (e) {
        // var lin = that.data.goodsClassify
        // console.log('变化前：', that.data.goodsClassify)

        // 利用商品索引所谓每个点击的切换
        var select = e.target.dataset.index

        // 拼接选择的商品规格
        var str = ''

        // 拼接商品规格的下标
        var sign = '';

        var arr = []
        // 循环商品分类的value,改变状态，获取每个的下标和对应的值
        for (var i = 0; i < this.data.goodsClassify.length; i++) {

            if (this.data.goodsClassify[i].values[select]) {

                // 排他
                for (var j in this.data.goodsClassify[i].values) {
                    this.data.goodsClassify[i].values[j].b = false
                }

                // 自己为true，其他为false
                this.data.goodsClassify[i].values[select].b = !this.data.goodsClassify[i].values[select].b

                // console.log(e.target.dataset.index, this.data.goodsClassify[i].values[select].b)
            }

            // 获取选中并且为true的下标和值
            for (var j in this.data.goodsClassify[i].values) {
                // console.log(this.data.goodsClassify.length)
                if (this.data.goodsClassify[i].values[j].b) {
                    // console.log(this.data.goodsClassify[i].values[j].b)
                    arr.push(this.data.goodsClassify[i].values[j].a)
                    // 下标
                    sign += j + "|";

                    // 值
                    str += `"` + this.data.goodsClassify[i].values[j].a + `"`;
                }
            }
        }

        // console.log(arr)
        // 切割字符串
        sign = sign.slice(0, sign.length - 1)
        // console.log(sign)

        // 赋值
        this.setData({
            goodsClassify: this.data.goodsClassify,
            getSelectedValue: str,
            valueSign: sign
        })


        var select_arr = new Array();

        for (var i = 0; i < this.data.goodsClassify.length; i++) {

            for (var j in this.data.goodsClassify[i].values) {

                if (this.data.goodsClassify[i].values[j].b == true) {

                    select_arr.push(this.data.goodsClassify[i].values[j].b)
                }
            }
        }

        this.setData({
            goodsClassify: this.data.goodsClassify,
            getSelectedValue: str,
            valueSign: sign,
            selected_arr: select_arr
        })
        if (this.data.selected_arr.length == this.data.goodsClassify.length) {
            // console.log(123123)
            this.getGoodsPrice(this.data.valueSign);
        }


        // console.log(e.target.dataset)
    },

    // 动态获取商品价格
    getGoodsPrice: function (sign) {
        var that = this;

        // 动态获取商品价格  获取各个商品对应的组合标识
        var priceList = that.data.goodsDetail.spec_list;
        var dynamic = ''
        for (var o in priceList) {
            if (o.indexOf(sign) != -1) {
                dynamic = priceList[o]
            }
        }

        //  参数
        var obj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            goods_id: dynamic
        }
        app.fetch(app.globalData.url + "/mobile/index.php?act=goods&op=goods_detail&t=json", obj, "post", "application/json").then(res => {
            console.log(res)
            if (res.data.code == 200) {
                that.setData({
                    selectGoodsPrice: res.data.data.goods_info.goods_price
                })
            } else if (res.data.code == 400) {

            } else if (res.data.code == 401) {

            }
        })

    },

    // 获取购物车数量
    getGoodsListNum: function () {
        let that = this;
        let goodsTotal = 0;
        // 发送请求
        let obj = {
            token: app.globalData.token,
            client: app.globalData.client,
            v: app.globalData.v,
            guid: app.globalData.guid
        }

        app.fetch(app.globalData.url + '/mobile/index.php?act=member_cart&op=cart_list&t=json', obj, "post", "application/json").then(res => {

            /*  需要添加的状态 */

            if (res.data.code == 200) {
                let { cart_list } = res.data.data;
                // console.log('获取商品数量', res)
                // console.log('cart_list',cart_list)
                // 遍历对象
                for (let i = 0; i < cart_list.length; i++) {
                    goodsTotal += cart_list[i].data.length

                }

                // 重新赋值
                that.setData({
                    goodsTotal: goodsTotal
                })

                console.log('gouwuche', goodsTotal)

            } else if (res.data.code == 400) {
                console.log(res)
            } else {
                console.log(res)
            }

        })
    },

    // 商品提交
    goodsSubmit: function () {

    },

    // 发送请求
    RTS: function () {
        var _that = this;

        var obj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            goods_id: 101078
        }

        app.fetch(app.globalData.url + "/mobile/index.php?act=goods&op=goods_detail&t=json", obj, "post", 'application/json').then(res => {
            // console.log(res.data);
            if (res.data.code == 200) {
                var goodsClassifyNames = res.data.data.goods_info.spec_name;
                var goodsClassifyValue = res.data.data.goods_info.spec_value;


                var c = [];
                for (var i in goodsClassifyNames) {

                    // console.log(goodsClassifyValue[i])

                    for (var j in goodsClassifyValue[i]) {
                        goodsClassifyValue[i][j] = {
                            a: goodsClassifyValue[i][j],
                            b: false
                        }
                    }

                    c.push({
                        names: goodsClassifyNames[i],
                        values: goodsClassifyValue[i]
                    })

                }


                _that.setData({
                    goodsDetail: res.data.data,
                    goodsClassify: c,
                    goodsClassifyName: goodsClassifyNames,
                    goodsClassifyValue: goodsClassifyValue
                })

                var jsonStr = _that.data.goodsDetail.goods_image_arr;
                _that.shift(jsonStr)

                // console.log(_that.data.imgUrls)

            } else if (res.data.code == 400) {
                console.log(res.data.code)
            } else if (res.data.code == 401) {
                console.log(res.data.code)
            }
        })
    },

    // 轮播图转换格式
    shift: function (obj) {
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

    // 存储页面隐藏时的时间戳和倒计时时间
    handlerTimeStamp: function () {
        if (this.data.goodsTotal != 0) {

            var time = new Date().getTime();

            // 如果时间戳为0的时候归为0
            if (this.data.remainTime <= 0) {
                this.data.remainTime = 0;
                // 清除定时器
                clearTimeOut();

                // 重新获取购物车列表
                this.onLoad();
                this.getGoodsListNum()
            }
            wx.setStorage({
                key: 'time',
                data: {
                    conutDown: this.data.remainTime,
                    oldTime: time
                }
            })
        }
    },

    // 判断此商品是否在收藏列表
    isRecommend: function () {
        const that = this;
        var obj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            curpage: 1,
            page: 6
        }

        app.fetch(app.globalData.url + '/mobile/index.php?act=member_favorites&op=favorites_list&t=json', obj, 'post', 'application/json').then(res => {
            if (res.data.code == 200) {
                // console.log(res)
                const { favorites_list } = res.data.data

                for (var i = 0; i < favorites_list.length; i++) {
                    if (favorites_list[i].goods_id == that.data.goodsDetail.goods_info.goods_id) {
                        that.setData({
                            isCollect: true,
                            collect: '../../../images/detail-img/collect@2x.png',
                        })
                    }
                }
            } else if (res.data.code == 400) {
                console.log('收藏', res.data.code)
                wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 2000
                })
            } else if (res.data.code == 401) {
                console.log('收藏', res.data.code)
                wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },

    /* 点击收藏 */
    handlerCollect: function () {
        this.data.isCollect = !this.data.isCollect;
        if (this.data.isCollect) {
            this.setData({
                collect: '../../../images/detail-img/collect@2x.png',
                isCollect: this.data.isCollect
            })

            // 发送请求
            //  参数
            var obj = {
                token: app.globalData.token,
                v: app.globalData.v,
                guid: app.globalData.guid,
                client: app.globalData.client,
                goods_id: this.data.goodsDetail.goods_info.goods_id
            }

            app.fetch(app.globalData.url + '/mobile/index.php?act=member_favorites&op=favorites_add&t=json', obj, 'post', 'application/json').then(res => {
                // console.log(res)
                if (res.data.code == 200) {
                    // console.log(res)
                    wx.showToast({
                        title: '收藏成功',
                        icon: 'success',
                        duration: 2000
                    })
                } else if (res.data.code == 400) {
                    console.log('收藏', res.data.code)
                    wx.showToast({
                        title: res.data.error,
                        icon: 'none',
                        duration: 2000
                    })
                } else if (res.data.code == 401) {
                    console.log('收藏', res.data.code)
                    wx.showToast({
                        title: res.data.error,
                        icon: 'none',
                        duration: 2000
                    })
                }
            })

        } else {

            // 取消收藏
            this.setData({
                collect: '../../../images/detail-img/collect-1@2x.png',
                isCollect: this.data.isCollect
            })

            // 发送请求
            //  参数
            var obj = {
                token: app.globalData.token,
                v: app.globalData.v,
                guid: app.globalData.guid,
                client: app.globalData.client,
                fav_id: this.data.goodsDetail.goods_info.goods_id
            }

            app.fetch(app.globalData.url + '/mobile/index.php?act=member_favorites&op=favorites_del&t=json', obj, 'post', 'application/json').then(res => {
                if (res.data.code == 200) {
                    // console.log(res)
                    wx.showToast({
                        title: '取消收藏',
                        icon: 'success',
                        duration: 2000
                    })
                } else if (res.data.code == 400) {
                    console.log('收藏', res.data.code)
                    wx.showToast({
                        title: res.data.error,
                        icon: 'none',
                        duration: 2000
                    })
                } else if (res.data.code == 401) {
                    console.log('收藏', res.data.code)
                    wx.showToast({
                        title: res.data.error,
                        icon: 'none',
                        duration: 2000
                    })
                }
            })

        }

        this.setData({
            isCollect: this.data.isCollect
        })
        // console.log(this.data.isCollect)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this;
        // this.swiperChange(options)



        that.RTS();
        setTimeout(function () {

            that.getGoodsListNum();  // 获取购物车数量

            // 倒计时2
            clearTimeOut2();
            if (that.data.remainTime2) {
                conutDown2(that)
            }

        }, 2000)
        that.isRecommend(); // 获取商品是否被收藏




        const obj = wx.getStorageSync('time')  // 获取本地存储
        // 倒计时1
        let newTime = new Date().getTime();  // 记录当前时间
        // 判断本地存储是否有值
        if (obj) {
            var closeConutDown = obj.conutDown;  // 获取关闭页面前倒计时时间

            var oldTime = obj.oldTime  // 获取关闭页面的时间

            var sumTime = closeConutDown - Math.ceil((newTime - oldTime) / 1000);  // 关闭页面的倒计时时间 - 当前时间 - 关闭页面时间
            // console.log(sumTime)
            if (sumTime <= 0) {
                sumTime = 0;

                // 重新获取购物车列表
                that.getGoodsListNum()

                // 清除定时器
                clearTimeOut();

                return false;
            }

            // 跟新数据
            that.setData({
                remainTime: parseInt(sumTime),
                clock: formatTime(sumTime)
            })

            // 调用倒计时
            clearTimeOut();
            if (that.data.remainTime) {
                conutDown(that)
            }
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        const that = this;
        setTimeout(function () {

            that.getGoodsListNum();  // 获取购物车数量
        }, 2000)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const that = this;
        setTimeout(function () {

            that.getGoodsListNum();  // 获取购物车数量
        }, 2000)
        that.isRecommend(); // 获取商品是否被收藏
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        // 记录时间戳
        this.handlerTimeStamp();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        // 记录时间戳
        this.handlerTimeStamp();
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