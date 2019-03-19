import { formatTime, conutDown, clearTimeOut } from '../../../utils/common';
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsDetail: [], // 商品详细
        cartList:[], // 购物车列表数据
        goodsTotal:0, // 购物车商品数量
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
        randomNum: '', // 随机销量
        remainTime: '', // 倒计时
        clock: formatTime(),
        isStart: '', // 判断限时抢购或拼团
        nowPt: true,  // 正在拼团显示隐藏
        goToPt: true,  // 去拼团显示隐藏
        maskFlag: true, // 遮罩层
        PTMaskFlag: true,
        collect: '../../../images/detail-img/collect-1@2x.png', // 收藏
        isCollect: false, // 判断是否收藏
        maskFlag: true, // 遮罩层
        goodsSelect: false, // 商品选择框显示隐藏
        buyNumber: 1, // 购买数量，默认1
        ptOrBuy: '', // 发起拼团或直接购买
        goodsTAG: '',  // 判断购买状态
        goodsClassify: [], // 商品分类
        goodsClassifyName: [],
        goodsClassifyValue: [],
        getSelectedValue: '', // 商品分类的name
        valueSign: '', // 商品分类的Value
        isGoodsSelect: true, // 判断用户选择的标识
        selected_arr: [], // 存储用户选择商品的数量
        selectGoodsPrice: '', // 选择完规格后的价格
        activeState: '',  // 活动状态，立即抢购或者即将开始
        goodsId: '', //  存储动态选择商品的id和数量
        goods_id: '', // 上个页面传过来的id
        flag: true,
        text: ['天', '时', '分', '秒'],
        nowTime: '',
        overTime: '',
        hours: '00',
        minute: '00',
        second: '00',
        activeText: '',
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

    // 随机月销量
    randomNum: function (lowerValue, upperValue) {
        this.setData({
            randomNum: Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue)
        })
    },

    /* 查看更多拼团显示 */
    handlerShow: function () {
        this.setData({
            nowPt: false,
            PTMaskFlag: false
        })
    },

    /* 查看更多拼团显示 */
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
                console.log(res)
                if (res.data.code == 200) {
                    console.log(res)
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
                    console.log(res)
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
        console.log(this.data.isCollect)
    },

    // 判断此商品是否在收藏列表
    isRecommend: function (goods_id) {
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
                console.log('收藏', res.data.code)
                const { favorites_list } = res.data.data

                for (var i = 0; i < favorites_list.length; i++) {
                    if (favorites_list[i].goods_id == goods_id) {
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
    // 加入购物车弹框
    handlerAddCart: function () {
        this.setData({
            ptOrBuy: '加入购物车',
            goodsTAG: 6,
            goodsSelect: true,
            maskFlag: false
        })
        // console.log(this.data.goodsTAG)
    },
    // 限时抢购-马上抢
    handlerLoot: function () {
        this.setData({
            goodsSelect: true,
            maskFlag: false
        })

        if (this.data.activeState == '立即抢购') {
            this.setData({
                goodsTAG:1
            })
        } else if (this.data.activeState == '即将开始') {
            this.setData({
                goodsTAG:2
            })
        } else if (this.data.activeState == '活动已结束') {
            this.setData({
                goodsTAG:3
            })
        }
    },
    // 拼团直接购买弹框
    handlerAloneBuy: function () {
        this.setData({
            ptOrBuy: '单独购买',
            goodsTAG: 4,
            goodsSelect: true,
            maskFlag: false
        })
    },

    // 发起拼团
    handlerPt: function () {
        this.setData({
            ptOrBuy: '发起批发',
            goodsTAG: 5,
            goodsSelect: true,
            maskFlag: false
        })
    },

    // 商品选择框隐藏
    handlerGoodsSelectHide: function () {
        this.setData({
            goodsSelect: false,
            maskFlag: true
        })
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

        console.log(arr)
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
            selected_arr: select_arr
        })

        if (this.data.selected_arr.length == this.data.goodsClassify.length) {
            this.getGoodsPrice(sign);
        }


        console.log(e.target.dataset)
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

        // 存储选择完之后的商品ID
        that.setData({
            goodsId: dynamic
        })

        //  参数
        var obj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            goods_id: dynamic
        }
        app.fetch(app.globalData.url + "/mobile/index.php?act=goods&op=goods_detail", obj, "post", 'applicaion/json').then(res => {
            console.log(res)
            if (res.data.code == 200) {
                /* 判断动态获取商品价格的同时是否参与拼团 */
                that.setData({
                    selectGoodsPrice: res.data.data.goods_info.goods_price
                })
            } else if (res.data.code == 400) {

            } else if (res.data.code == 401) {

            }
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

    // 获取购物车商品列表商品数量
    getGoodsList: function () {
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
                    cartList: cart_list,
                    goodsTotal: goodsTotal
                })


            } else if (res.data.code == 400) {
                console.log(res)
            } else {
                console.log(res)
            }

        })
    },

    // 清空购物车
    removeGoods: function () {
        var that = this;
        var obj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client
        }

        app.fetch(app.globalData.url + '/mobile/index.php?act=member_cart&op=cart_empty&t=json', obj, 'post', 'application/json').then(res => {
            if (res.data.code == 200) {
                console.log('清空购物车',res)

                wx.showToast({
                    title: '商品没有啦~',
                    icon: 'none',
                    duration: 2000
                })

                // 刷新页面
                that.getGoodsList();
            } else if (res.data.code == 400) {

            } else if (res.data.code == 401) {

            }
        })
    },

    // 发送请求
    RTS: function (goods_id) {
        var _that = this;
        // console.log(_that)
        var obj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            goods_id: goods_id || 101012
        }

        app.fetch(app.globalData.url + "/mobile/index.php?act=goods&op=goods_detail&t=json", obj, "post", 'applicaion/json').then(res => {
            console.log('商品详情',res.data)
            if (res.data.code == 200) {
                // 判断页面是正常购买还是拼团
                if (res.data.data.goods_info.is_assemble == '1') {
                    _that.setData({
                        isStart: false
                    })
                    console.log('pt')
                } else if (res.data.data.goods_info.is_assemble == '0') {
                    // 获取活动的开始，判断是否已经开始限时抢购活动
                    var startTime = res.data.data.goods_info.start_time // 开始时间
                    var endTime = res.data.data.goods_info.end_time   // 结束时间
                    var nowTime = Math.round(new Date().getTime() / 1000).toString()  // 现在的时间
                    //如果开始时间 减 现在时间 等于负数 证明已经开始 否则未开始
                    if (startTime - nowTime < 0 && endTime - nowTime > 0) {
                        var time = _that.formatTime(endTime - nowTime)
                        _that.setData({
                            goodsTAG: 1,
                            activeState: '立即抢购',
                            ptOrBuy: '立即抢购',
                            activeText: '距离结束',
                            nowTime: nowTime,
                            overTime: endTime,
                            hours: time[1],
                            minute: time[2],
                            second: time[3],
                            time: null
                        })
                        _that.time()
                    } else if (startTime - nowTime > 0 && endTime - nowTime > 0) {
                        var time = _that.formatTime(startTime - nowTime)
                        _that.setData({
                            goodsTAG: 2,
                            activeState: '即将开始',
                            ptOrBuy: '尚未开始',
                            activeText: '距离开始',
                            nowTime: nowTime,
                            overTime: startTime,
                            hours: time[1],
                            minute: time[2],
                            second: time[3],
                            time: null
                        })
                        _that.time()
                    } else {
                        _that.setData({
                            goodsTAG: 3,
                            activeState: '活动已结束',
                            ptOrBuy: '活动已结束',
                            activeText: '活动已结束',
                            hours: '00',
                            minute: '00',
                            second: '00',
                            time: null
                        })
                    }

                    _that.setData({
                        isStart: true
                    })
                }

                var goodsClassifyNames = res.data.data.goods_info.spec_name;
                var goodsClassifyValue = res.data.data.goods_info.spec_value;


                // 合并对象
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

                // 将imgUrl地址字符串转化为数组
                var arr = res.data.data.goods_image.split(',')
                // console.log('字符串转化为数组', arr)
                res.data.data.goods_image = arr;


                // 设置属性
                _that.setData({
                    goodsDetail: res.data.data,
                    goodsClassify: c,
                    goodsClassifyName: goodsClassifyNames,
                    goodsClassifyValue: goodsClassifyValue

                })

                // 轮播图格式转换
                var jsonStr = _that.data.goodsDetail.goods_image_arr;
                _that.shift(jsonStr)

                // 判断此商品是否在收藏列表
                _that.isRecommend(_that.data.goodsDetail.goods_info.goods_id)

            } else if (res.data.code == 400) {
                console.log(res.data.code)
            } else if (res.data.code == 401) {
                console.log(res.data.code)
            }
        })
    },
    // 定时器
    formatTime(time) {
        let day, hour, minute, second, content = '';
        // 计算、天、时、分、秒
        day = Math.floor(time / (60 * 60 * 24))
        hour = Math.floor((time % (60 * 60 * 24)) / (60 * 60)) + day * 24
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
            hour = Math.floor((time % (60 * 60 * 24)) / (60 * 60)) + day * 24
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
                hours: timeList[1],
                minute: timeList[2],
                second: timeList[3]
            })
        }
    },

    // 判断限时抢购已开始或未开始  和  拼团单独购买或发起拼团
    handlerSubmit: function () {
        const that = this;

        if (that.data.goodsTAG == 1 && that.data.activeState == '立即抢购') {
            /* 判断是否选择完全部的商品规格 */
            if (that.data.selected_arr.length == that.data.goodsClassify.length) {

                var cart_id;
                if (that.data.goodsId != '') {

                    cart_id = that.data.goodsId + '|' + that.data.buyNumber;
                } else {
                    cart_id = that.data.goodsDetail.goods_info.goods_id + '|' + that.data.buyNumber;
                }

                wx.navigateTo({
                    url: `../cart/orderConfirm/orderConfirm?cart_id=${cart_id}&ifcart=0`
                })

            } else {
                wx.showToast({
                    title: '请选择完商品规格',
                    icon: 'none',
                    duration: 2000
                })
            }
        } else if (that.data.goodsTAG == 2 && that.data.activeState == '即将开始') {
            wx.showToast({
                title: '即将开始喔~',
                icon: 'none',
                duration: 2000
            })
        } else if (that.data.goodsTAG == 3) {
            console.log(123)

            wx.showToast({
                title: '已经结束啦~',
                icon: 'none',
                duration: 2000
            })
        } else if (that.data.goodsTAG == 4) {
            // 单独购买
            if (that.data.selected_arr.length == that.data.goodsClassify.length) {
                var cart_id;
                if (that.data.goodsId != '') {

                    cart_id = that.data.goodsId + '|' + that.data.buyNumber;
                } else {
                    cart_id = that.data.goodsDetail.goods_info.goods_id + '|' + that.data.buyNumber;
                }
            }
        } else if (that.data.goodsTAG == 5) {
            // 发起拼团
            if (that.data.selected_arr.length == that.data.goodsClassify.length) {
                var cart_id;
                if (that.data.goodsId != '') {

                    cart_id = that.data.goodsId + '|' + that.data.buyNumber;
                } else {
                    cart_id = that.data.goodsDetail.goods_info.goods_id + '|' + that.data.buyNumber;
                }

            }
        } else if (that.data.goodsTAG == 6) {

             /* 判断是否选择完全部的商品规格 */
             if (that.data.selected_arr.length == that.data.goodsClassify.length) {
                // 发送请求
                var obj = {
                    token: app.globalData.token,
                    v: app.globalData.v,
                    guid: app.globalData.guid,
                    client: app.globalData.client,
                    goods_id: that.data.goodsId || that.data.goodsDetail.goods_info.goods_id,
                    quantity: that.data.buyNumber
                }
                app.fetch(app.globalData.url + '/mobile/index.php?act=member_cart&op=cart_add&t=json', obj, "post", "application/json").then(res => {
                    if (res.data.code == 200) {
                        console.log('添加购物车', res)

                        // 调用获取商品列表数量
                        that.getGoodsList();

                        //判断一个商品是够重复添加
                        for (var i = 0; i < that.data.cartList.length; i++) {
                            for (var j = 0; j < that.data.cartList[i].data.length; j++) {
                                if (that.data.cartList[i].data[j].goods_id == that.data.goodsId || that.data.cartList[i].data[j].goods_id == that.data.goodsDetail.goods_info.goods_id) {
                                    console.log(123, '重复添加')
                                    return false;
                                }
                            }
                        }
                        // 将当前添加商品的时间和倒计时存到本地
                        var time = new Date().getTime();

                        wx.setStorage({
                            key: 'cartTime',
                            data: time

                        })

                        // 加入购车成功隐藏商品选择弹窗和重置定时器
                        that.setData({
                            remainTime: 1200,
                            clock: formatTime(1200),
                            goodsSelect: false,
                            maskFlag: true,
                            addCartTime: time
                        })
                        clearTimeOut();
                        conutDown(that)

                    } else if (res.data.code == 400) {
                        console.log('添加购物车', res)
                    } else if (res.data.code == 401) {
                        console.log('添加购物车', res)
                    }
                })
                

            } else {
                wx.showToast({
                    title: '请选择完商品规格',
                    icon: 'none',
                    duration: 2000
                })
            }
            wx.showToast({
                title: '加入购物车~',
                icon: 'none',
                duration: 2000
            })
        }

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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        if (this.data.goods_id != '') {
            this.setData({
                goods_id: this.data.goods_id
            })
        } else {
            this.setData({
                goods_id: options.goods_id
            })
        }
        this.RTS(this.data.goods_id);
        this.randomNum(200, 1000); // 随机销量

        setTimeout(function () {
            that.getGoodsList();
        }, 2000)
        

         // 倒计时
         let newTime = new Date().getTime();  // 记录当前时间
         const obj = wx.getStorageSync('time')  // 获取本地存储
         const cartTime = wx.getStorageSync('cartTime');
 
         // 如果当前时间减去最后加入购物车时间大于或等于设定的差值，在定时器中调用onload清空购物车
         if (cartTime) {
             if ((newTime - cartTime) / 1000 >= 1200) {
                 // 清空购物车
                 that.removeGoods();
             }
         }
 
         // 判断本地存储是否有值
         if (obj) {
             var closeConutDown = obj.conutDown;  // 获取关闭页面前倒计时时间
 
             var oldTime = obj.oldTime  // 获取关闭页面的时间
 
             var sumTime = closeConutDown - Math.ceil((newTime - oldTime) / 1000);  // 关闭页面的倒计时时间 - 当前时间 - 关闭页面时间
 
             if (sumTime <= 0) {
                 sumTime = 0;
 
                 // 重新获取购物车列表
                 that.getGoodsList()
 
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

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        setTimeout(function () {
            
            that.getGoodsList();
        }, 2000)
        

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        if (this.data.goodsTotal != 0) {

            var time = new Date().getTime();

            // 如果时间戳为0的时候归为0
            if (this.data.remainTime <= 0) {
                this.data.remainTime = 0;
                // 清除定时器
                clearTimeOut();
                this.onLoad();
                // 重新获取购物车列表
                // that.getGoodsList()
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

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        if (this.data.goodsTotal != 0) {

            var time = new Date().getTime();

            // 如果时间戳为0的时候归为0
            if (this.data.remainTime <= 0) {
                this.data.remainTime = 0;
                // 清除定时器
                clearTimeOut();
                this.onLoad();
                // 重新获取购物车列表
                // that.getGoodsList()
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