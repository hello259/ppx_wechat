// pages/selfShop/cart/orderConfirm/orderConfirm.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsList: [],  // 商品列表
        addressList: [], // 用户地址列表
        orderGoodsList: [], // 订单页面跳转过来的数据
        options: '',
        cartID: '', // 购物车id
        ifcart: '', // 是否为购物车
        leaveWord: '', // 买家留言
        pay_sn: '', // 支付编号
        isChange:false, // 判断地址是否更换
        order_id: '',
        type: '',  // 跳转页面的状态
        isSelectBox: true, //优惠券选择框状态
        couponIndex: "", // 储存优惠券索引
        isCouponSelect: false,  // 选择的优惠券显示
        isNonuseCoupon: false,  // 储存暂不使用优惠的状态
        isShow: true, // textarea  输入框显示或隐藏
        isCouponStatus: false,
        isMask: true,  // 遮罩层
        couponList: [],  // 优惠券列表
        voucherPrice: 0,  // 储存选中的优惠券金额
        goodsTotal: ''  // 商品总价
        // 订单Id
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
        console.log(options)
        var that = this;
        if (options) {
            that.setData({
                options: options,
                cartID: options.cart_id,
                ifcart: options.ifcart,
                pay_sn: options.pay_sn,
                order_id: options.order_id,
                type: options.type
            })
        } else {
            that.setData({
                options: that.data.options,
                cartID: that.data.cart_id,
                ifcart: that.data.ifcart,
                pay_sn: that.data.pay_sn,
                order_id: that.data.order_id,
                type: that.data.type
            })
        }
        setTimeout(function () {
        }, 3000)
        that.getGoodsList(options);
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
        // var pages = getCurrentPages();
        // var currPage = pages[pages.length - 1];
        console.log(this.data.addressList.isChangeAddress)
        if (this.data.addressList.isChangeAddress) {
            // console.log(this.data.addressList.isChangeAddress)
            console.log(123123123123,this.data.addressList.city_id)
            console.log(123123123123,this.data.addressList)
            // 更新地址后重新获取列表   地址id不对就更换其他id
            this.getGoodsList(this.data.options, this.data.addressList.city_id)
        }
        // console.log('lin',that.data.options)
        // console.log('lin',this.data.cart_id)
        // console.log('lin', that.data.ifcart)
        // console.log('lin',this.data.order_id)
    },

    /* 获取购物车商品列表数据 */
    getGoodsList: function (options, cityId) {
        console.log('type',options.type)
        let that = this;
        if (options.type == 1) {
            // 由待支付订单页面跳转而来

            let obj = {
                token: app.globalData.token,
                v: app.globalData.v,
                guid: app.globalData.guid,
                client: app.globalData.client,
                order_id: options.order_id,
                city_id: cityId
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
                        city_id: orderGoodsList.address.city_id
                    }

                    // 存储赋值
                    if (this.data.addressList.isChangeAddress) {
                        that.setData({
                            orderGoodsList: orderGoodsList
                        })
                    } else {
                        that.setData({
                            orderGoodsList: orderGoodsList,
                            addressList: addressList
                        })
                    }

                } else if (res.data.code == 400) {
                    console.log('由待支付订单页面跳转而来', res.data.code)
                } else if (res.data.code == 401) {
                    console.log('由待支付订单页面跳转而来', res.data.code)
                }
            })
        } else {
            console.log('直接购买')
            // 购物车、直接购买第一步:选择收获地址和配置方式
            let obj = {
                token: app.globalData.token,
                v: app.globalData.v,
                guid: app.globalData.guid,
                client: app.globalData.client,
                cart_id: options.cart_id,
                ifcart: options.ifcart,
                city_id: cityId
                // city_id: '289'
                // cart_id: "141171|1",
                // ifcart: "0"
            }

            app.fetch(app.globalData.url + '/mobile/index.php?act=member_buy&op=buy_step1&t=json', obj, 'post', 'application/json').then(res => {
                if (res.data.code == 200) {
                    console.log('正常流程', res)
                    var { data } = res.data
                    var addressList = res.data.data.address_info
                    console.log('最开始',addressList)
                    var goodsTotal = 0;
                    // 转换时间戳
                    for (var i = 0; i < data.store_cart_list.length; i++) {
                        let couponList = data.store_cart_list[i];

                        // 为每个店铺添加储存优惠券数据的参数
                        couponList.checkedCoupon = {
                            voucher_t_id: '',
                            voucherPrice: '',
                            voucherLimit: ''
                        };
                        goodsTotal = data.store_cart_list.store_goods_total;
                        // 计算总价

                        for (var j = 0; j < couponList.store_voucher_list.length; j++) {
                            var startTime = couponList.store_voucher_list[j].voucher_start_time;
                            var endTime = couponList.store_voucher_list[j].voucher_end_time;
                            couponList.store_voucher_list[j].voucher_start_time = this.timestamp(startTime);
                            couponList.store_voucher_list[j].voucher_end_time = this.timestamp(endTime);
                            couponList.store_voucher_list[j] = Object.assign(couponList.store_voucher_list[j], { voucher_selected: false })
                        }
                    }
                    // 存储赋值
                    if (this.data.addressList.isChangeAddress) {
                        that.setData({
                            goodsList: data,
                            goodsTotal: goodsTotal
                        })
                    } else {
                        that.setData({
                            goodsList: data,
                            addressList: addressList,
                            goodsTotal: goodsTotal
                        })
                    }
                    
                    console.log('商品列表', that.data.goodsList)
                } else if (res.data.code == 400) {
                    console.log(res)
                } else if (res.data.code == 401) {
                    console.log(res)
                }
            })
        }
    },

    /* 获取用户地址 */
    changeAddressData: function (address_id, mob_phone, true_name, area_info, address, city_id) {
        if (address_id && mob_phone && true_name && area_info && address && city_id) {

            this.setData({
                address_id: address_id,
                mob_phone: mob_phone,
                true_name: true_name,
                area_info: area_info,
                address: address,
                city_id: city_id
            })
        }
        // this.getGoodsList(this.data.options,this.data.city_id)
    },

    /* 选择地址 */
    selectAddress: function () {
        if (this.data.type == 1) {
            console.log('不能更换地址')
        } else {
            wx.navigateTo({
                // url: 'pages/selfShop/myCenter/address/addressManShop/addressManShop'
                url: '../../myCenter/address/addressManShop/addressManShop'
            })
        }
    },

    /* 商品选择 */
    handerGoodsNumber: function (e) {
        let that = this;
        let type = e.currentTarget.dataset.type;  // 相加减状态
        let storeIndex = e.currentTarget.dataset.storeindex;  // 店铺索引
        let goodsIndex = e.currentTarget.dataset.goodsindex;  // 商品索引
        let goodsList = that.data.goodsList;  // 商品列表
        let cartId = e.currentTarget.dataset.cartid;  // 购物车id
        let goodsId = e.currentTarget.dataset.goodsid; // 商品id
        let goodsNumber = e.currentTarget.dataset.num;  // 所点击商品的数量

        /**
         * 1 判断相加还是相减
         * 2 判断是直接购买还是从购物车购买
         * 3 根据不同的ifcart状态传入不同的参数
         */

        // 增加减数量
        if (type == 'subtract') {
            if (goodsNumber <= 1) {
                console.log(22222)
                goodsNumber = 1;
            } else {
                goodsNumber--;

                // 调用更新数量函数
                that.updataGoodsListPrams(goodsList, goodsId, cartId, goodsNumber)

            }

            // goodsList.store_cart_list[storeIndex].goods_list[goodsIndex].goods_num = num;
            // that.setData({
            //     goodsList:goodsList
            // })
        } else if (type == 'add') {
            goodsNumber++;

            // 调用更新数量函数
            that.updataGoodsListPrams(goodsList, goodsId, cartId, goodsNumber)
            console.log('add', goodsNumber)
        }
    },

    /* 更新数量加减后的商品列表参数拼接 */
    updataGoodsListPrams: function (goodsList, goodsId, cartId, goodsNumber) {
        let that = this;
        // 拼接购物车id和数量
        // 判断是直接购买还是从购物车购买
        if (that.data.ifcart == 0) {
            let cartID = "";

            // 拼接购物车id和数量
            for (let i = 0; i < goodsList.store_cart_list.length; i++) {
                for (let k = 0; k < goodsList.store_cart_list[i].goods_list.length; k++) {
                    let data = goodsList.store_cart_list[i].goods_list[k];
                    if (data.goods_id == goodsId) {
                        data.goods_num = goodsNumber;
                        console.log("直接购买")
                    }

                    cartID += data.goods_id + "|" + data.goods_num + ",";
                }
            }

            // 改变cartId的值
            that.setData({
                cartID: cartID
            })


            // 调用重新请求接口函数
            that.updateGoodsList(that.data.options, cartID)
        } else if (that.data.ifcart == 1) {
            let cartID = "";

            // 更新购物车数量
            let obj = {
                cart_id: cartId,
                quantity: goodsNumber
            }

            app.fetch(app.globalData.url + '/mobile/index.php?act=member_cart&op=cart_edit_quantity&t=json', obj, 'post', 'application/json').then(res => {
                if (res.data.code == 200) {
                    console.log("更新购物车数量", res)

                    // 拼接购物车id和数量
                    for (let i = 0; i < goodsList.store_cart_list.length; i++) {
                        for (let k = 0; k < goodsList.store_cart_list[i].goods_list.length; k++) {
                            let data = goodsList.store_cart_list[i].goods_list[k];
                            if (data.goods_id == goodsId) {
                                data.goods_num = goodsNumber;
                                console.log("购物车购买")
                            }

                            cartID += data.cart_id + "|" + data.goods_num + ",";
                        }
                    }

                    // 改变cartId的值
                    that.setData({
                        cartID: cartID
                    })

                    // 调用重新请求接口函数
                    that.updateGoodsList(that.data.options, cartID)
                } else if (res.data.code == 400) {

                } else if (res.data.code == 401) {

                }
            })


        }
    },

    /* 输入更新商品数量 */
    inputGoodsNumber: function (e) {
        console.log(e)
        let that = this;
        let goodsList = that.data.goodsList;  // 商品列表
        let cartId = e.currentTarget.dataset.cartid;  // 购物车id
        let goodsId = e.currentTarget.dataset.goodsid; // 商品id
        let goodsNumber = e.detail.value;  // 所点击商品的数量

        that.updataGoodsListPrams(goodsList, goodsId, cartId, goodsNumber)
    },

    // 重新获取商品列表
    updateGoodsList: function (options, cartId) {
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
                        city_id: orderGoodsList.address.city_id
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
                cart_id: cartId,
                ifcart: that.data.ifcart
                // cart_id: "141171|1",
                // ifcart: "0"
            }

            app.fetch(app.globalData.url + '/mobile/index.php?act=member_buy&op=buy_step1&t=json', obj, 'post', 'application/json').then(res => {
                if (res.data.code == 200) {
                    console.log('正常流程', res)
                    var { data } = res.data
                    var addressList = res.data.data.address_info
                    var goodsTotal = 0;
                    // 转换时间戳
                    for (var i = 0; i < data.store_cart_list.length; i++) {
                        let couponList = data.store_cart_list[i];

                        // 为每个店铺添加储存优惠券数据的参数
                        couponList.checkedCoupon = {
                            voucher_t_id: '',
                            voucherPrice: '',
                            voucherLimit: ''
                        };
                        goodsTotal = data.store_cart_list.store_goods_total;
                        // 计算总价

                        for (var j = 0; j < couponList.store_voucher_list.length; j++) {
                            var startTime = couponList.store_voucher_list[j].voucher_start_time;
                            var endTime = couponList.store_voucher_list[j].voucher_end_time;
                            couponList.store_voucher_list[j].voucher_start_time = this.timestamp(startTime);
                            couponList.store_voucher_list[j].voucher_end_time = this.timestamp(endTime);
                            couponList.store_voucher_list[j] = Object.assign(couponList.store_voucher_list[j], { voucher_selected: false })
                        }
                    }
                    // 存储赋值
                    that.setData({
                        goodsList: data,
                        addressList: addressList,
                        goodsTotal: goodsTotal
                    })
                    console.log('商品列表', that.data.goodsList)
                } else if (res.data.code == 400) {
                    console.log(res)
                } else if (res.data.code == 401) {
                    console.log(res)
                }
            })
        }
    },

    // 更换地址后重新获取列表数据
    anewGetGoodsList: function (options, cartId) {

    },
    /* 获取用户留言 */
    getLeaveWord: function (e) {
        this.setData({
            leaveWord: e.detail.value
        })
    },

    /* 立即支付 */
    payNow: function () {
        // 判断进来的页面
        console.log('pay', this.data.pay_sn)

        let that = this;
        let data = that.data.goodsList;
        console.log(data)
        var voucher = '';


        // 正常购买
        if (that.data.pay_sn == undefined && that.data.order_id == undefined) {
            // 获取优惠券信息
            for (var i = 0; i < data.store_cart_list.length; i++) {
                let data_i = data.store_cart_list[i];
                voucher += data_i.checkedCoupon.voucher_t_id + "|" + data_i.store_id + "|" + data_i.checkedCoupon.voucherPrice + ",";

                if (data_i.checkedCoupon.voucher_t_id == '' && data_i.checkedCoupon.voucherPrice == '') {
                    voucher = '';
                }
            }
            voucher = voucher.substr(0, voucher.length - 1)

            let obj = {
                token: app.globalData.token,
                v: app.globalData.v,
                guid: app.globalData.guid,
                client: app.globalData.client,
                cart_id: that.data.cartID,
                ifcart: that.data.ifcart,
                address_id: that.data.addressList.address_id,
                vat_hash: data.vat_hash,
                offpay_hash: data.offpay_hash,
                offpay_hash_batch: data.offpay_hash_batch,
                pay_name: 'online',
                invoice_id: 0,
                voucher: voucher,
                // voucher: '145|1|3',
                pay_message: that.data.leaveWord,
                pd_pay: '',
                rcb_pay: '',
                password: '',
                fcode: ''
            }
            console.log(2, obj.voucher)
            // 购物车、直接购买第二步:保存订单入库，产生订单号，开始选择支付方式
            app.fetch(app.globalData.url + '/mobile/index.php?act=member_buy&op=buy_step2&t=json', obj, "post", 'application/json').then(res => {
                if (res.data.code == 200) {
                    var pay_sn = res.data.data.pay_sn;  // 支付编号
                    var order_id = res.data.data.order_id  // 订单ID
                    console.log('订单编号',that.data.pay_sn)
                    // 发起微信小程序支付第一步
                    let obj1 = {
                        token: app.globalData.token,
                        v: app.globalData.v,
                        guid: app.globalData.guid,
                        client: app.globalData.client,
                        pay_sn: pay_sn
                    }
                    
                    console.log('优惠券金额', that.data.voucherPrice)
                    app.fetch(app.globalData.url + '/mobile/index.php?act=programpay&op=index&t=json', obj1, 'post', 'application/json').then(res => {
                        if (res.data.code == 200) {

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
                                            pay_sn: pay_sn
                                        }

                                        app.fetch(app.globalData.url + '/mobile/index.php?act=programpay&op=getPayResult&t=json', obj2, 'post', 'application/json').then(res => {
                                            console.log('检查支付结果', res)
                                            if (res.data.data.pay_state == 1) {
                                                console.log('支付成功')

                                                // 跳转页面
                                                wx.redirectTo({
                                                    // url: `orderConfirm/orderConfirm?cart_id=${e.currentTarget.dataset.id}&ifcart=1`
                                                    url: `paymentSuccess/paymentSuccess?order_id=${order_id}&ifcart=1`
                                                })

                                            } else if (res.data.data.pay_state == 0) {
                                                console.log('还未支付')
                                            }
                                        })
                                    }
                                },
                                fail(res) {
                                    console.log('微信小程序支付123', res)
                                    wx.showToast({
                                        title: "已取消支付",
                                        icon: 'none',
                                        duration: 2000
                                    })

                                    // wx.redirectTo({
                                    //     // url:'/pages/selfShop/cart/orderConfirm/orderConfirm?pay_sn=' + e.currentTarget.dataset.orderkey + '&order_id=' + e.currentTarget.dataset.orderid + "&cart_id=" + str + '&ifcart=0'
                                    //     url:'/pages/selfShop/cart/orderConfirm/orderConfirm?pay_sn=' + pay_sn + '&order_id=' + order_id + "&type=1"
                                    //   })
                                    wx.navigateBack({
                                    })
                                }
                            })



                        } else if (res.data.code == 400) {

                        } else if (res.data.code == 401) {

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
                            wx.showToast({
                                title: "已取消支付",
                                icon: 'none',
                                duration: 2000
                            })
                            wx.navigateBack({
                            })

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
        console.log(e)
    },
    /* 打开优惠券选择框 */
    openCouponSelect: function (e) {
        console.log(e.currentTarget)
        var goodsList = this.data.goodsList.store_cart_list;
        var storeId = e.currentTarget.dataset.storeid;

        this.setData({
            isSelectBox: false,
            isMask: false,
            isShow: false
        })

        // 判断先前优惠券列表是否为空,为空则储存数据的优惠券列表，不为空就使用之前选择的列表
        if (this.data.couponList == '') {
            for (var i = 0; i < goodsList.length; i++) {
                if (storeId == goodsList[i].store_id) {
                    this.setData({
                        couponList: goodsList[i].store_voucher_list
                    })
                }
            }
        }
        console.log(this.data.couponList)
    },

    // 时间戳格式转换
    timestamp: function (time) {
        var date = new Date(time * 1000);
        var year = date.getFullYear();
        var mounth = date.getMonth() + 1;
        var day = date.getDate();
        return time = year + '年' + mounth + '月' + day + '日';
    },

    /* 关闭优惠券选择框 */
    closeCouponSelect: function () {
        this.setData({
            isSelectBox: true,
            isMask: true,
            isShow: true
        })

    },

    /* 优惠券的选择状态 */
    couponSelectStatus: function (e) {
        console.log(e.currentTarget)
        let storeId = e.currentTarget.dataset.storeid;
        let voucher_t_id = e.currentTarget.dataset.vouchertid;
        let voucherPrice = e.currentTarget.dataset.voucherprice;
        let voucherLimit = e.currentTarget.dataset.voucherlimit;
        let arr = this.data.goodsList;
        console.log(2222222222222, e)
        // 将选中的优惠券数据添加到对象
        var checkedCoupon = {
            voucher_t_id: voucher_t_id,
            voucherPrice: voucherPrice,
            voucherLimit: voucherLimit
        }
        for (var i = 0; i < arr.store_cart_list.length; i++) {

            if (storeId == arr.store_cart_list[i].store_id) {
                // 排他法
                for (var j = 0; j < arr.store_cart_list[i].store_voucher_list.length; j++) {
                    arr.store_cart_list[i].store_voucher_list[j].voucher_selected = false;

                    if (voucher_t_id == arr.store_cart_list[i].store_voucher_list[j].voucher_t_id) {
                        arr.store_cart_list[i].store_voucher_list[j].voucher_selected = true;
                    }
                }
                arr.store_cart_list[i].checkedCoupon = checkedCoupon;

            }
            var goodsTotal = arr.store_cart_list[i].store_goods_total - arr.store_cart_list[i].checkedCoupon.voucherPrice

        }
        goodsTotal = Math.ceil(goodsTotal * 100).toFixed(2) / 100
        console.log('单选', arr)
        this.setData({
            goodsList: arr,
            isCouponStatus: true,
            isNonuseCoupon: false,
            goodsTotal: goodsTotal,
            voucherPrice: voucherPrice
        })

    },

    /*  暂不使用优惠 */
    nonuseCoupon: function (e) {
        let storeId = e.currentTarget.dataset.storeid;
        let arr = this.data.goodsList;
        for (var i = 0; i < arr.store_cart_list.length; i++) {
            if (storeId == arr.store_cart_list[i].store_id) {
                // 排他法
                for (var j = 0; j < arr.store_cart_list[i].store_voucher_list.length; j++) {
                    arr.store_cart_list[i].store_voucher_list[j].voucher_selected = false;
                }
                // var goodsTotal = arr.store_cart_list[i].store_goods_total
                var goodsTotal = arr.store_cart_list[i].store_goods_total;

                // 不适用优惠数据为空
                arr.store_cart_list[i].checkedCoupon = {
                    voucher_t_id: '',
                    voucherPrice: '',
                    voucherLimit: '',
                };
            }

        }
        this.data.isNonuseCoupon = true;
        this.setData({
            goodsList: arr,
            isNonuseCoupon: this.data.isNonuseCoupon,
            isCouponStatus: false,
            goodsTotal: goodsTotal,
            voucherPrice: 0
        })
        console.log(arr)
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