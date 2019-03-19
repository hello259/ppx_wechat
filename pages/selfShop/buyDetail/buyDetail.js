// pages/tourDiy/tourDiy.js
import { formatTime, conutDown, clearTimeOut } from '../../../utils/common';
import { formatTime2, conutDown2, clearTimeOut2 } from '../../../utils/common2';

var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsDetail: [], // 商品详细
        cartList: [], // 购物车列表
        assembleList: [], // 拼团列表
        assembleDetail: [], // 拼团详情
        imgUrls: [],
        indicatorDots: true, // 面板指示点s
        autoplay: true, // 自动轮播
        interval: 3000, // 自动切换时间间隔
        duration: 1000, // 滑动动画时长
        current: 1, // 获取轮播图索引
        randomNum: '', // 随机销量
        remainTime: '', // 倒计时
        clock: formatTime(),
        remainTime2: 600, // 倒计时
        clock2: formatTime2(600),
        addCartTime: '', // 添加商品到购物车的时间
        goodsState: '',  // 判断是正常购买还是拼团 
        collect: '../../../images/detail-img/collect-1@2x.png', // 收藏
        isCollect: false, // 判断是否收藏
        maskFlag: true, // 遮罩层
        PTMaskFlag: true,
        nowPt: true, // 正在拼团显示隐藏
        goToPt: true, // 去拼团显示隐藏,
        orderId: '',  // 拼团id
        goodsSelect: false, // 商品选择框显示隐藏
        buyNumber: 1, // 购买数量，默认1
        ptOrBuy: '', // 加入购物车或直接购买
        goodsTAG: '',  // 判断购买状态
        activeState: '立即抢购',  // 购买方式
        goodsTotal: 0, // 购物车提示数量
        goodsClassify: [], // 商品分类
        goodsClassifyName: [],
        goodsClassifyValue: [],
        getSelectedValue: '', // 商品分类的name
        valueSign: '', // 商品分类的Value
        isGoodsSelect: true, // 判断用户选择的标识
        selected_arr: [], // 存储用户选择商品的数量是否满足所有的选项
        selectGoodsPrice: '', // 选择完规格后的价格
        goodsId: '', // 储存选中的商品id
        promotionType: '', // 储存上个页面传过来的活动类别
        optionsGoodsId: '',  // 储存上个页面传过来的id
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

    /* 去拼团详情显示 */
    goToShow: function (e) {
        // let that = this;
        // this.setData({
        //     goToPt: false,
        //     PTMaskFlag: false
        // })
        // let obj = {
        //     order_id : e.currentTarget.dataset.orderid
        // }

        // app.fetch(app.globalData.url + '/mobile/index.php?act=goods_assemble&op=assemble_info', obj, 'post').then(res => {
        //     let { data } = res.data;
        //     console.log(22222, res)
        //     if (res.data.code == 200) {
        //         for (var i in data.buyer_list) {
        //             if (data.buyer_list[i].buyer_id == data.buyer_id) {
        //                 data.buyer_list.splice(i,1)
        //             }
        //         }
        //         console.log('切割后',data)
        //         that.setData({
        //             assembleDetail:data
        //         })
        //     } else if (res.data.code == 400) {
        //         console.log('拼团详情',res.data.code)
        //     } else if (res.data.code == 401) {
        //         console.log('拼团详情',res.data.code)
        //     }
        // })

    },

    /* 去拼团关闭 */
    goToClose: function () {
        this.setData({
            goToPt: true,
            PTMaskFlag: true
        })
    },

    // 阻止底层滑动
    stopPageScroll: function () {
        return;
    },

    // 随机月销量
    randomNum: function (lowerValue, upperValue) {
        this.setData({
            randomNum: Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue)
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

    // 立即购买弹框
    handlerBuy: function () {
        this.setData({
            ptOrBuy: '立即购买',
            goodsTAG: 1,
            goodsSelect: true,
            maskFlag: false
        })
        // console.log(this.data.goodsTAG)
    },

    // 加入购物车弹框
    handlerAddCart: function () {
        this.setData({
            ptOrBuy: '加入购物车',
            goodsTAG: 2,
            goodsSelect: true,
            maskFlag: false
        })
        // console.log(this.data.goodsTAG)
    },

    // 拼团直接购买弹框
    handlerAloneBuy: function () {
        this.setData({
            ptOrBuy: '单独购买',
            goodsTAG: 3,
            goodsSelect: true,
            maskFlag: false,
            selectGoodsPrice: this.data.goodsDetail.goods_info.promotion_price
            // selectGoodsPrice: this.data.goodsDetail.goods_info.goods_price
        })
    },

    // 发起拼团
    handlerPt: function () {
        this.setData({
            ptOrBuy: '发起批发',
            goodsTAG: 4,
            goodsSelect: true,
            maskFlag: false,
            selectGoodsPrice: this.data.goodsDetail.goods_info.goods_assemble_price
        })
        console.log(this.data.goodsTAG)
    },

    // 限时抢购-马上抢
    handlerLoot: function () {
        this.setData({
            goodsSelect: true,
            maskFlag: false
        })
        console.log(123123)
        if (this.data.activeState == '立即抢购') {
            this.setData({
                ptOrBuy: '立即抢购',
                goodsTAG: 5,
            })
        } else if (this.data.activeState == '即将开始') {
            this.setData({
                ptOrBuy: '即将开始',
                goodsTAG: 6,
            })
        } else if (this.data.activeState == '活动已结束') {
            this.setData({
                ptOrBuy: '活动已结束',
                goodsTAG: 7,
            })
        }
        console.log(this.data.goodsTAG)
    },

    // 必拼秒杀
    handlerSeckill: function () {
        this.setData({
            goodsSelect: true,
            maskFlag: false
        })
        console.log(123123)
        if (this.data.activeState == '马上抢') {
            this.setData({
                ptOrBuy: '马上抢',
                goodsTAG: 8,
            })
        } else if (this.data.activeState == '秒杀未开始') {
            this.setData({
                ptOrBuy: '秒杀未开始',
                goodsTAG: 9,
            })
        } else if (this.data.activeState == '秒杀已结束') {
            this.setData({
                ptOrBuy: '秒杀已结束',
                goodsTAG: 10,
            })
        }
        console.log(this.data.goodsTAG)
    },

    // 获取拼团列表
    getAssembleList: function () {
        var that = this;
        var obj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            goods_id: that.data.goodsDetail.goods_info.goods_id,
            curpage: 1,
            page: 2
        }
        app.fetch(app.globalData.url + '/mobile/index.php?act=goods_assemble&op=assemble_list&t=json', obj, "post", "application/json").then(res => {
            console.log('拼团列表', res)
            if (res.data.code == 200) {
                let { data } = res.data
                for (var v in data.list) {
                    var time = new Date(data.list[v].create_time / 1000);
                    var date = new Date(time);
                    var hours = date.getHours();
                    var minute = date.getMinutes();
                    time = hours + '时' + minute + '分';
                    data.list[v].create_time = time;
                }
                that.setData({
                    assembleList: data
                })
            }
        })
    },

    // 获取拼团详情
    getAssembleDetail: function (e) {
        let that = this;
        this.setData({
            goToPt: false,
            PTMaskFlag: false,
            orderId: e.currentTarget.dataset.orderid
        })
        let obj = {
            order_id: e.currentTarget.dataset.orderid
        }

        app.fetch(app.globalData.url + '/mobile/index.php?act=goods_assemble&op=assemble_info', obj, 'post').then(res => {
            let { data } = res.data;
            if (res.data.code == 200) {
                for (var i in data.buyer_list) {
                    if (data.buyer_list[i].buyer_id == data.buyer_id) {
                        data.buyer_list.splice(i, 1)
                    }
                }
                console.log('切割后', data)
                that.setData({
                    assembleDetail: data,
                    remainTime2: data.surplus_time,
                    clock2: formatTime2(data.surplus_time)
                })

                // 调用定时器
                clearTimeOut2();
                if (that.data.remainTime2) {
                    conutDown2(that)
                }
            } else if (res.data.code == 400) {
                console.log('拼团详情', res.data.code)
            } else if (res.data.code == 401) {
                console.log('拼团详情', res.data.code)
            }
        })
    },

    // 发起拼团-参与拼团
    handlerAssemble: function (e) {
        console.log(e.currentTarget)
        var that = this;
        that.setData({
            goodsSelect: true,
            maskFlag: false,
            goToPt: true,
            PTMaskFlag: true,
            nowPt: true,
            ptOrBuy: '参与拼团',
            goodsTAG: 11,
            selectGoodsPrice: that.data.goodsDetail.goods_info.goods_assemble_price,
            orderId: e.currentTarget.dataset.orderid
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
        var that = this;

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

            // 获取选中并且为true的下标和匹配的值
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

        // 切割字符串
        sign = sign.slice(0, sign.length - 1)

        // 动态获取商品价格  获取各个商品对应的组合标识
        var priceList = that.data.goodsDetail.spec_list;
        var dynamicGoodsId; // 动态商品iD
        // console.log(dynamic)
        // console.log(sign)
        for (var o in priceList) {
            if (o.indexOf(sign) != -1) {
                dynamicGoodsId = priceList[o]
            }
        }

        console.log('动态商品iD', dynamicGoodsId)
        // 判断是够全部选择完商品的选项
        var select_arr = new Array();

        for (var i = 0; i < this.data.goodsClassify.length; i++) {

            for (var j in this.data.goodsClassify[i].values) {

                if (this.data.goodsClassify[i].values[j].b == true) {

                    select_arr.push(this.data.goodsClassify[i].values[j].b)
                }
            }
        }
        // console.log('selected_arr',select_arr)
        // 更新数据
        this.setData({
            goodsClassify: this.data.goodsClassify,
            getSelectedValue: str,
            valueSign: sign,
            selected_arr: select_arr,
            goods_id: dynamicGoodsId
        })

        /* 判断是否选择完全部的商品规格 */
        // console.log(this.data.valueSign)
        if (this.data.selected_arr.length == this.data.goodsClassify.length) {
            this.getGoodsPrice(dynamicGoodsId); // 重新获取选中价格
            this.RTS(dynamicGoodsId);
        }


    },

    // 动态获取商品价格
    getGoodsPrice: function (dynamicGoodsId) {
        var that = this;

        // 动态获取商品价格  获取各个商品对应的组合标识
        // var priceList = that.data.goodsDetail.spec_list;
        // var dynamic;

        // for (var o in priceList) {
        //     if (o.indexOf(sign) != -1) {
        //         dynamic = priceList[o]
        //     }
        // }

        // 存储选择完之后的商品ID
        that.setData({
            goodsId: dynamicGoodsId
        })

        //  参数
        var obj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            goods_id: dynamicGoodsId
        }
        app.fetch(app.globalData.url + "/mobile/index.php?act=goods&op=goods_detail&t=json", obj, "post", "application/json").then(res => {

            if (res.data.code == 200) {
                console.log('动态获取商品价格', res);
                if (that.data.goodsTAG == 4 || that.data.goodsTAG == 11) {  // 如果是拼团，则展示拼团的价格
                    that.setData({
                        selectGoodsPrice: res.data.data.goods_info.goods_assemble_price
                    })
                } else {
                    that.setData({
                        // selectGoodsPrice: res.data.data.goods_info.goods_price
                        selectGoodsPrice: res.data.data.goods_info.goods_price
                    })
                }
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
        console.log(this.data.buyNumber)
    },

    // 商品增加
    handlerGoodsAdd: function () {
        var num = this.data.buyNumber;

        num++;

        // 将数值与状态写回  
        this.setData({
            buyNumber: num
        });

        console.log(this.data.buyNumber)
    },

    // 添加购物车或直接购买或单独购买或发起拼团
    goodsAddCart: function () {
        var that = this;
        that.setData({
            goodsSelect: false,
            maskFlag: true
        })
        if (that.data.goodsTAG == 1) {  //直接购买
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

        } else if (that.data.goodsTAG == 2) {  // 添加购物车
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
                // console.log('goods_id',that.data.goodsId)
                // console.log('goods_id', that.data.goodsDetail.goods_info.goods_id)
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
                        console.log(that.data.addCartTime)
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
        } else if (that.data.goodsTAG == 3) {  // 拼团单独购买
            // 单独购买
            if (that.data.selected_arr.length == that.data.goodsClassify.length) {
                console.log('拼团单独购买')
                var cart_id;
                if (that.data.goodsId != '') {

                    cart_id = that.data.goodsId + '|' + that.data.buyNumber;
                } else {
                    cart_id = that.data.goodsDetail.goods_info.goods_id + '|' + that.data.buyNumber;
                }
                wx.navigateTo({
                    url: `../cart/orderConfirm/orderConfirm?cart_id=${cart_id}&ifcart=0`
                })
            }
        } else if (that.data.goodsTAG == 4) {  // 拼团-发起拼团
            // 发起拼团
            if (that.data.selected_arr.length == that.data.goodsClassify.length) {
                console.log('拼团-发起拼团')

                var assemble_params = {
                    order_id: 0,
                    goods_id: that.data.goodsId || that.data.goodsDetail.goods_info.goods_id,
                    goods_num: that.data.buyNumber
                }
                assemble_params = JSON.stringify(assemble_params)
                wx.navigateTo({
                    url: `../cart/orderAssemble/orderAssemble?assemble_params=${assemble_params}`
                })
            }
        } else if (that.data.goodsTAG == 5) {  // 限时抢购
            //  限时抢购
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
        } else if (that.data.goodsTAG == 6) {
            wx.showToast({
                title: '即将开始喔~',
                icon: 'none',
                duration: 2000
            })
        } else if (that.data.goodsTAG == 7) {
            wx.showToast({
                title: '已经结束啦~',
                icon: 'none',
                duration: 2000
            })
        } else if (that.data.goodsTAG == 8) {  //  限时秒杀

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
        } else if (that.data.goodsTAG == 9) {
            wx.showToast({
                title: '即将开始喔~',
                icon: 'none',
                duration: 2000
            })
        } else if (that.data.goodsTAG == 10) {
            wx.showToast({
                title: '已经结束啦~',
                icon: 'none',
                duration: 2000
            })
        } else if (that.data.goodsTAG == 11) {  // 参与拼团
            // 发起拼团
            if (that.data.selected_arr.length == that.data.goodsClassify.length) {
                console.log('拼团-参与拼团')

                var assemble_params = {
                    order_id: that.data.orderId,
                    goods_id: that.data.goodsId || that.data.goodsDetail.goods_info.goods_id,
                    goods_num: that.data.buyNumber
                }
                assemble_params = JSON.stringify(assemble_params)
                wx.navigateTo({
                    url: `../cart/orderAssemble/orderAssemble?assemble_params=${assemble_params}`
                })
            }
        }
    },

    // 获取商品详情
    RTS: function (goods_id, promotionType) {
        var _that = this;
        // console.log(_that) 101079
        var obj = {
            token: app.globalData.token,
            client: app.globalData.client,
            v: app.globalData.v,
            guid: app.globalData.guid,
            // goods_id: 1237611 || goods_id
            goods_id: goods_id
        }

        app.fetch(app.globalData.url + "/mobile/index.php?act=goods&op=goods_detail&t=json", obj, "post", "application/json").then(res => {
            console.log('商品详情', res)
            if (res.data.code == 200) {

                // 判断页面是限时抢购还是拼团
                if (res.data.data.goods_info.is_assemble == '1') {
                    _that.setData({
                        goodsState: 2
                    })
                    console.log('拼团', 123123123123)
                } else if (res.data.data.goods_info.is_assemble == '0' && _that.data.promotionType == undefined) {
                    _that.setData({
                        goodsState: 1
                    })
                    console.log('正常购买', 123123123123)
                    console.log(_that.data.goodsState)
                } else if (_that.data.promotionType == '2') {
                    // 获取活动的开始，判断是否已经开始限时抢购活动
                    var startTime = res.data.data.goods_info.start_time // 开始时间
                    var endTime = res.data.data.goods_info.end_time   // 结束时间
                    var nowTime = Math.round(new Date().getTime() / 1000).toString()  // 现在的时间
                    console.log(1, res.data)
                    console.log(2, nowTime)
                    //如果开始时间 减 现在时间 等于负数 证明已经开始 否则未开始
                    if (startTime - nowTime < 0 && endTime - nowTime > 0) {
                        var time = _that.formatTime(endTime - nowTime)
                        _that.setData({
                            goodsTAG: 5,
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
                            goodsTAG: 6,
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
                            goodsTAG: 7,
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
                        goodsState: 4
                    })
                } else if (_that.data.promotionType == '1') {
                    // 获取活动的开始，判断是否已经开始限时秒杀
                    var startTime = res.data.data.goods_info.start_time // 开始时间
                    var endTime = res.data.data.goods_info.end_time   // 结束时间
                    var nowTime = Math.round(new Date().getTime() / 1000).toString()  // 现在的时间
                    //如果开始时间 减 现在时间 等于负数 证明已经开始 否则未开始
                    if (startTime - nowTime < 0 && endTime - nowTime > 0) {
                        var time = _that.formatTime(endTime - nowTime)
                        _that.setData({
                            goodsTAG: 8,
                            activeState: '马上抢',
                            ptOrBuy: '马上抢',
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
                            goodsTAG: 9,
                            activeState: '秒杀未开始',
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
                        // } else if (endTime - nowTime < 0) {
                    } else {
                        _that.setData({
                            goodsTAG: 10,
                            activeState: '秒杀已结束',
                            ptOrBuy: '秒杀已结束',
                            activeText: '活动已结束',
                            hours: '00',
                            minute: '00',
                            second: '00',
                            time: null
                        })
                    }

                    _that.setData({
                        goodsState: 3
                    })
                    console.log(_that.data.goodsState)
                }


                var goodsClassifyNames = res.data.data.goods_info.spec_name;
                var goodsClassifyValue = res.data.data.goods_info.spec_value;


                // 合并对象
                var regroup = [];
                for (let i in goodsClassifyNames) {

                    for (let j in goodsClassifyValue[i]) {
                        goodsClassifyValue[i][j] = {
                            a: goodsClassifyValue[i][j],
                            b: false
                        }
                    }

                    regroup.push({
                        names: goodsClassifyNames[i],
                        values: goodsClassifyValue[i]
                    })

                }

                // 设置默认选中
                var goods_spec = res.data.data.goods_info.goods_spec;
                var getSelectedValue = '';
                for (let k in goods_spec) {
                    getSelectedValue += `"` + goods_spec[k] + `"`;
                    for (let i in regroup) {
                        // console.log('regroup', regroup[i].values)
                        for (let l in regroup[i].values) {
                            // console.log(regroup[i].values[l])

                            // console.log('goods_spec', goods_spec[k])
                            if (regroup[i].values[l].a == goods_spec[k]) {
                                regroup[i].values[l].b = true
                            }
                        }
                    }

                }
                // console.log('regroup-befor',regroup)
                // 将字符串转化为数组
                var arr = res.data.data.goods_image.split(',')
                // console.log('字符串转化为数组', arr)
                res.data.data.goods_image = arr;

                // 设置属性
                _that.setData({
                    goodsDetail: res.data.data,
                    goodsClassify: regroup,
                    goodsClassifyName: goodsClassifyNames,
                    goodsClassifyValue: goodsClassifyValue,
                    getSelectedValue: getSelectedValue
                })

                _that.getAssembleList();  // 获取拼团列表
                // 轮播图格式转换
                var jsonStr = _that.data.goodsDetail.goods_image;

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

    // 轮播图转换格式
    shift: function (arr) {
        // var arr = [];
        // for (var i in obj) {
        //     obj[i] = obj[i].replace(" ", "");
        //     if (typeof obj[i] != 'object') {
        //         obj[i] = obj[i].replace(/\ufeff/g, ""); //重点
        //         var jj = JSON.parse(obj[i]);
        //         // console.log(jj)
        //     }
        //     arr.push(jj)
        // }
        let obj = {};
        for (var i in arr) {
            obj[i] = arr[i] + '!j750';
        }
        console.log('轮播图', obj)
        this.setData({
            imgUrls: obj
        })
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
                console.log('清空购物车', res)

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

    // 判断此商品是否在收藏列表
    isRecommend: function (goods_id) {
        const that = this;
        var obj = {
            //     token: app.globalData.token,
            //     v: app.globalData.v,
            //     guid: app.globalData.guid,
            //     client: app.globalData.client,
            //     curpage: 1,
            //     page: 6
        }

        app.fetch(app.globalData.url + '/mobile/index.php?act=member_favorites&op=favorites_list&t=json', obj, 'post', 'application/json').then(res => {
            //     if (res.data.code == 200) {
            //         // console.log('收藏', res)
            //         const { favorites_list } = res.data.data

            //         for (var i = 0; i < favorites_list.length; i++) {
            //             if (favorites_list[i].goods_id == goods_id) {
            //                 that.setData({
            //                     isCollect: true,
            //                     collect: '../../../images/detail-img/collect@2x.png',
            //                 })
            //             }
            //         }
            //     } else if (res.data.code == 400) {
            //         console.log('收藏', res.data.code)
            //         wx.showToast({
            //             title: res.data.error,
            //             icon: 'none',
            //             duration: 2000
            //         })
            //     } else if (res.data.code == 401) {
            //         console.log('收藏', res.data.code)
            //         wx.showToast({
            //             title: res.data.error,
            //             icon: 'none',
            //             duration: 2000
            //         })
            //     }
        })

        var obj2 = {
            goods_id: goods_id || that.data.optionsGoodsId,
            token: app.globalData.token,
        }

        app.fetch(app.globalData.url + '/mobile/index.php?act=goods_detail_others&op=index&t=json ', obj2, 'post', 'application/json').then(res => {
            if (res.data.code == 200) {
                let { data } = res.data;
                if (data.is_favorites == '1') {
                    that.setData({
                        isCollect: true,
                        collect: '../../../images/detail-img/collect@2x.png',
                    })
                } else if (data.is_favorites == '0') {
                    that.setData({
                        isCollect: false,
                        collect: '../../../images/detail-img/collect-1@2x.png',
                    })
                }
            } else if (res.data.code == 400) {
                console.log('收藏', res)
            } else if (res.data.code == 401) {
                console.log('收藏', res)
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


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        if (that.data.optionsGoodsId == '') {
            that.setData({
                optionsGoodsId: options.goods_id,
                promotionType: options.goods_promotion_type
            })
        } else {
            that.setData({
                optionsGoodsId: that.data.goods_id,
                promotionType: that.data.promotionType,
            })
        }

        that.RTS(that.data.optionsGoodsId, that.data.promotionType);

        that.getGoodsList();  // 获取商品列表


        that.randomNum(200, 1000);
        // 判断此商品是否在收藏列表
        that.isRecommend();

        // 调用倒计时
        clearTimeOut2();
        if (that.data.remainTime2) {
            conutDown2(that)
        }

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

        // 购物车有数量时才获取本地存储时间处理倒计时
        // if (that.data.goodsTotal != 0) { }

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
        // 获取商品列表数量
        // this.getGoodsList();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;

        // 获取商品列表数量
        that.getGoodsList();

        // 判断此商品是否在收藏列表
        that.isRecommend();

        // 倒计时
        let newTime = new Date().getTime();  // 记录当前时间

        // 购物车有数量时才获取本地存储时间处理倒计时
        // if (that.data.goodsTotal != 0) {}

        const obj = wx.getStorageSync('time')  // 获取本地存储

        // 判断本地存储是否有值
        if (obj) {
            var closeConutDown = obj.conutDown;  // 获取关闭页面前倒计时时间

            var oldTime = obj.oldTime  // 获取关闭页面的时间

            var sumTime = closeConutDown - Math.ceil((newTime - oldTime) / 1000);  // 关闭页面的倒计时时间 - 当前时间 - 关闭页面时间

            if (sumTime <= 0) {
                sumTime = 0;

                // 重新获取购物车列表
                that.getGoodsList()

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
                // this.getGoodsList()
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
    onPullDownRefresh: function () { },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})