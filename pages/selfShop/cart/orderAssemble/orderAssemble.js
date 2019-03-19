
// pages/selfShop/cart/orderConfirm/orderConfirm.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        slelectCoupon: false, //优惠券选择状态
        goodsList: [],  // 商品列表
        addressList: [], // 用户地址列表
        assembleParams: {}, //  options携带的参数
        orderGoodsList: [], // 订单页面跳转过来的数据
        cartID: '', // 购物车id
        ifcart: '', // 是否为购物车
        leaveWord: '', // 买家留言
        pay_sn: '', // 支付编号
        order_id: '' // 订单Id
        // city_id: '',
        // mob_phone: '',
        // true_name: '',
        // area_info: '',
        // address:''

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var assemble_params = JSON.parse(options.assemble_params)
        console.log(JSON.parse(options.assemble_params))

        if (options) {
            this.setData({
                assembleParams: assemble_params,
                order_id: options.order_id,
                pay_sn: options.pay_sn,
                // order_id: options.order_id
            })
        } else {
            this.setData({
                assembleParams: that.data.assemble_params,
                order_id: that.data.order_id,
                pay_sn: that.data.pay_sn,
                // order_id: options.order_id
            }) 
        }

       

        this.getGoodsList(assemble_params);
        //   console.log(this.data.assembleParams)
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
        var that = this;
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];

        if (this.data.addressList.isChangeAddress) {
            console.log(123123123123,this.data.addressList)
            // 更新地址后重新获取列表   地址id不对就更换其他id
            this.getGoodsList(this.data.assembleParams)
        }
        console.log('lin',this.data.addressList)
    },

    /* 获取购物车商品列表数据 */
    getGoodsList: function (options) {
        let that = this;
        if (options.type == 1) {
            // 由待支付订单页面跳转而来

            let obj = {
                token: app.globalData.token,
                v: app.globalData.v,
                guid: app.globalData.guid,
                client: app.globalData.client,
                order_id: options.order_id
            }

            app.fetch(app.globalData.url + '/mobile/index.php?act=member_order&op=order_orderid_detail&t=json', obj, 'post', 'application/json').then(res => {
                console.log('由待支付订单页面跳转而来', res)
                if (res.data.code == 200) {
                    var orderGoodsList = res.data.data
                    var addressList = {
                        true_name: orderGoodsList.address.name,
                        mob_phone: orderGoodsList.address.mob_phone,
                        area_info: orderGoodsList.address.area,
                        address: orderGoodsList.address.street,
                    }

                    // 存储赋值
                    that.setData({
                        orderGoodsList: orderGoodsList,
                        addressList: addressList
                    })

                } else if (res.data.code == 400) {
                    console.log('由待支付订单页面跳转而来', res.data.code)
                } else if (res.data.code == 401) {
                    console.log('由待支付订单页面跳转而来', res.data.code)
                }
            })
        } else {

            // 购物车、直接购买第一步:选择收获地址和配置方式
            let obj = {
                token: app.globalData.token,
                v: app.globalData.v,
                guid: app.globalData.guid,
                client: app.globalData.client,
                order_id: options.order_id,
                goods_id: options.goods_id,
                // goods_id: 106529,
                goods_num: options.goods_num
            }

            app.fetch(app.globalData.url + '/mobile/index.php?act=goods_assemble&op=launch&t=json', obj, 'post', 'application/json').then(res => {
                console.log('正常流程', res)
                if (res.data.code == 200) {
                    var { data } = res.data
                    var addressList = res.data.data.address_info

                    // 存储赋值
                    that.setData({
                        goodsList: data,
                        addressList: addressList
                    })
                } else if (res.data.code == 400) {
                    console.log(res)
                } else if (res.data.code == 401) {
                    console.log(res)
                }
            })
        }
    },

    /* 获取用户地址 */
    changeAddressData: function (city_id, mob_phone, true_name, area_info, address) {
        if (city_id && mob_phone && true_name && area_info && address) {

            this.setData({
                address_id: address_id,
                mob_phone: mob_phone,
                true_name: true_name,
                area_info: area_info,
                address: address
            })
        }
    },

    /* 选择地址 */
    selectAddress: function () {
        wx.navigateTo({
            // url: 'pages/selfShop/myCenter/address/addressManShop/addressManShop'
            url: '../../myCenter/address/addressManShop/addressManShop'
        })
    },

    /* 获取用户留言 */
    getLeaveWord: function (e) {
        console.log(e)
        this.setData({
            leaveWord: e.detail.value
        })
    },

    /* 立即支付 */
    payNow: function () {
        // 判断进来的页面
        console.log('pay', this.data.pay_sn)

        let that = this;

        if (this.data.pay_sn == undefined && this.data.order_id == undefined) {
            console.log('拼团id', that.data.assembleParams.order_id)
            let obj = {
                token: app.globalData.token,
                v: app.globalData.v,
                guid: app.globalData.guid,
                client: app.globalData.client,
                address_id: that.data.addressList.address_id,
                order_id: that.data.assembleParams.order_id,
                goods_id: that.data.assembleParams.goods_id,
                goods_num: that.data.assembleParams.goods_num,
                // goods_num: 3,
                // order_id: 0,
                // goods_id: 106529,
                // goods_num: 1,
                pay_message: that.data.leaveWord
            }

            // 购物车、直接购买第二步:保存订单入库，产生订单号，开始选择支付方式
            app.fetch(app.globalData.url + '/mobile/index.php?act=goods_assemble&op=confirm_launch&t=json', obj, "post", 'application/json').then(res => {
                if (res.data.code == 200) {
                    console.log('确认订单', res);
                    var pay_sn = res.data.data.pay_sn;  // 支付编号
                    var order_id = res.data.data.order_id  // 订单ID
                    // 发起微信小程序支付第一步
                    let obj1 = {
                        pay_sn: pay_sn
                    }
                    console.log('支付编号', pay_sn)
                    app.fetch(app.globalData.url + '/mobile/index.php?act=goods_assemble&op=programpay_launch&t=json', obj1, 'post', 'application/json').then(res => {
                        if (res.data.code == 200) {
                            console.log('支付拼团123123', res)
                            // 调用微信API进行支付第二步
                            var payObj = res.data.data
                            console.log(payObj)
                            // return false;
                            wx.requestPayment({
                                timeStamp: payObj.timeStamp,
                                nonceStr: payObj.nonceStr,
                                package: payObj.package,
                                signType: payObj.signType,
                                paySign: payObj.paySign,
                                success(res) {
                                    console.log('微信小程序支付', res)

                                    // 支付后查询支付结果第三步
                                    for (var i = 0; i < 10; i++) {
                                        let obj2 = {
                                            token: app.globalData.token,
                                            v: app.globalData.v,
                                            guid: app.globalData.guid,
                                            client: app.globalData.client,
                                            pay_sn: pay_sn
                                        }

                                        app.fetch(app.globalData.url + '/mobile/index.php?act=goods_assemble&op=check_programpay_launch_result&t=json', obj2, 'post', 'application/json').then(res => {
                                            console.log('检查支付结果', res)
                                            if (res.data.data.pay_state == 1) {
                                                console.log('支付成功')
                                                if (that.data.assembleParams.isPt== 1) {
                                                    
                                                    // // 跳转页面
                                                    wx.redirectTo({
                                                        url: `/pages/selfShop/sharePage/sharePage?order_id=${that.data.assembleParams.order_id}&goods_id=${that.data.goodsList.goods_info.goods_id}`
                                                    })
                                                } else {
                                                    wx.redirectTo({
                                                        url: `/pages/selfShop/sharePage/sharePage?order_id=${order_id}&goods_id=${that.data.goodsList.goods_info.goods_id}`
                                                    })
                                                }

                                            } else if (res.data.data.pay_state == 0) {
                                                console.log('还未支付')
                                            }
                                        })
                                    }
                                },
                                fail(res) {
                                    console.log('微信小程序支付123', res)
                                }
                            })
                        } else if (res.data.code == 400) {
                            console.log(res.data.code)
                        } else if (res.data.code == 401) {
                            console.log(res.data.code)
                        }
                    })

                } else if (res.data.code == 400) {
                    console.log('立即支付', res.data.code)
                } else if (res.data.code == 401) {
                    console.log('立即支付', res.data.code)
                }
            })
        } else {
            // 发起微信小程序支付第一步
            let obj1 = {
                token: app.globalData.token,
                v: app.globalData.v,
                guid: app.globalData.guid,
                client: app.globalData.client,
                pay_sn: that.data.pay_sn
            }

            app.fetch(app.globalData.url + '/mobile/index.php?act=programpay&op=index&t=json', obj1, 'post', 'application/json').then(res => {
                if (res.data.code == 200) {
                    console.log('第一步',res)
                    // 调用微信API进行支付第二步
                    var payObj = res.data.data
                    wx.requestPayment({
                        timeStamp: payObj.timeStamp,
                        nonceStr: payObj.nonceStr,
                        package: payObj.package,
                        signType: payObj.signType,
                        paySign: payObj.paySign,
                        success(res) {
                            console.log('微信小程序支付', res)

                            // 支付后查询支付结果第三步
                            for (var i = 0; i < 10; i++) {
                                let obj2 = {
                                    token: app.globalData.token,
                                    v: app.globalData.v,
                                    guid: app.globalData.guid,
                                    client: app.globalData.client,
                                    pay_sn: that.data.pay_sn
                                }

                                app.fetch(app.globalData.url + '/mobile/index.php?act=programpay&op=getPayResult&t=json', obj2, 'post', 'application/json').then(res => {
                                    console.log('检查支付结果', res)
                                    if (res.data.data.pay_state == 1) {
                                        console.log('支付成功')

                                        // 跳转页面
                                        wx.redirectTo({
                                            // url: `orderConfirm/orderConfirm?cart_id=${e.currentTarget.dataset.id}&ifcart=1`
                                            url: `paymentSuccess/paymentSuccess?order_id=${that.data.order_id}&ifcart=1`
                                        })

                                    } else if (res.data.data.pay_state == 0) {
                                        console.log('还未支付')
                                    }
                                })
                            }
                        },
                        fail(res) {
                            console.log('微信小程序支付123', res)
                        }
                    })



                } else if (res.data.code == 400) {

                } else if (res.data.code == 401) {

                }
            })
        }
    },

    /* test */
    click: function (e) {
        // // 跳转页面
        wx.redirectTo({
            // url: `orderConfirm/orderConfirm?cart_id=${e.currentTarget.dataset.id}&ifcart=1`
            // url: `/pages/selfShop/sharePage/shareGroup/shareGroup/?order_id=${this.data.order_id}&goods_id=${this.data.goodsList.goods_info.goods_id}`
            url: `/pages/selfShop/sharePage/sharePage?order_id=${this.data.assembleParams.order_id}&goods_id=${this.data.goodsList.goods_info.goods_id}`
        })
    },
    /* 优惠券状态改变 */
    couponSelect: function (options) {
        this.data.slelectCoupon = !this.data.slelectCoupon
        this.setData({
            slelectCoupon: this.data.slelectCoupon
        })
        console.log(this.data.slelectCoupon)
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