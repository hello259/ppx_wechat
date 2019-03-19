// pages/selfShop/cart/cart.js
import { formatTime, conutDown, clearTimeOut } from '../../../utils/common';
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cartList: [], // 购物车列表
        recommend: [], //  为你推荐列表
        goodsNumber: '', // 购物车商品购买的数量
        aloneSelelct: true,
        selectAllStatus: true,
        totalPrice: '', // 商品总价
        goodsTotal: 0,  //  购物车商品的数量
        remainTime: '', // 倒计时
        clock: formatTime(),
        cartID: '', // 订单确认购物车id
        rushId:''
    },

    // 设置标题为：标题1
    setBiaoTi1: function () {
        wx.setNavigationBarTitle({
            title: '标题1',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this;
        // 获取购物车列表数据
        this.getCartList();
        this.getsumTotal();
        this.deleteTime();
        this.recommendTo();
        // 获取本地存储的抢购id
        wx.getStorage({
            key: 'rushId',
            success: function(res) {
              // 异步接口在success回调才能拿到返回值
                var rushId = res.data
                that.setData({
                    rushId:rushId
                })
            },
            fail: function() {
              console.log('读取key1发生错误')
            }
           
          })
        
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
        // 更新价格
        this.getCartList();
        this.getsumTotal();
        this.deleteTime();
        this.recommendTo();
    },

    /* 获取购物车列表 */
    getCartList: function () {
        let that = this;
        let goodsTotal = 0;

        // 获取本地存储，是否有未被选中的数据
        const unselected = wx.getStorageSync('unselected')  // 获取本地存储

        // 发送请求
        let obj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client
        }

        app.fetch(app.globalData.url + '/mobile/index.php?act=member_cart&op=cart_list&t=json', obj, "post", 'application/json').then(res => {
            // console.log(res)

            /*  需要添加的状态 */
            let select = {
                selected: true
            }
            let storeSelect = {
                storeSelectAll: true
            }
            // 储存购物车ID
            var str = '';
            if (res.data.code == 200) {
                const { cart_list } = res.data.data;
                console.log(123, cart_list)

                // 遍历对象
                for (let i = 0; i < cart_list.length; i++) {

                    // 给店铺添加选中按钮
                    cart_list[i] = Object.assign(cart_list[i], storeSelect)
                    // 商品总数量

                    for (let j = 0; j < cart_list[i].data.length; j++) {
                        // 合并对象
                        cart_list[i].data[j] = Object.assign(cart_list[i].data[j], select)

                        // 匹配退出页面未被选中的商品
                        for (let k = 0; k < unselected.length; k++) {
                            if (cart_list[i].data[j].goods_id == unselected[k]) {
                                // 店铺和商品选中状态都设置为false
                                cart_list[i].storeSelectAll = false;
                                cart_list[i].data[j].selected = false;
                                that.data.selectAllStatus = false;
                            }
                        }


                        // 判断是否被选中，存储购物车id和数量
                        if (cart_list[i].data[j].selected) {
                            str += cart_list[i].data[j].cart_id + '|' + cart_list[i].data[j].goods_num + ',';
                            goodsTotal++;
                        }
                    }
                }
                console.log(11111111, cart_list)
                console.log('存储购物车id和数量', str)
                // 重新赋值
                that.setData({
                    cartList: cart_list,
                    selectAllStatus: that.data.selectAllStatus,
                    goodsTotal: goodsTotal,
                    cartID: str,
                })
                // 更新价格
                this.getsumTotal();

                // 如果购物车为空则清楚本地存储
                if (cart_list.length == 0) {
                    // 清除本地存储
                    wx.removeStorage({
                        key: 'time',
                        success(res) {
                            console.log('清除成功', res.data)
                        }
                    })
                }

            } else if (res.data.code == 400) {
                console.log(res)
            } else {
                console.log(res)
            }
        })
    },

    /* 为你推荐 */
    recommendTo: function () {
        let that = this;
        console.log(213)

        // 发送请求
        let obj = {
            // token: app.globalData.token,
            // v: app.globalData.v,
            // guid: app.globalData.guid,
            // client: app.globalData.client
        }

        app.fetch(app.globalData.url + '/mobile/index.php?act=member_cart&op=get_guesslike&t=json', obj, 'post', 'application/json').then(res => {
            console.log('为你推荐', res)
            if (res.data.code == 200) {
                // console.log(12313)
                for (var i = 0; i < res.data.data.goods_list.length; i++) {
                    res.data.data.goods_list[i].goods_image_url = res.data.data.goods_list[i].goods_image_url + '!j350h';
                }
                that.setData({
                    recommend: res.data.data.goodslist
                })
                // console.log(that.data.recommend)
                // console.log(res.data.data.goodslist)
            } else if (res.data.code == 400) {
                console.log('为你推荐', res)
            } else if (res.data.code == 401) {
                console.log('为你推荐', res)
            }
        })
    },

    /* 店铺全选按钮 */
    handlerStoraSelect: function (e) {
        const that = this;
        const storeIndex = e.currentTarget.dataset.storeindex; // 店铺索引
        let cartList = that.data.cartList;
        let goodsTotal = 0;
        let cartID = '';

        // 店铺全选按钮切换
        cartList[storeIndex].storeSelectAll = !cartList[storeIndex].storeSelectAll;

        // 子按钮跟随店铺全选按钮
        cartList[storeIndex].data.forEach(v => {
            v.selected = cartList[storeIndex].storeSelectAll

            // 存储被选中商品的数据
            if (v.selected) {
                cartID += v.cart_id + '|' + v.goods_num + ',';
            }
        });

        // 遍历店铺按钮，是否选中，来改变全选的状态
        for (let i = 0; i < cartList.length; i++) {
            if (!cartList[i].storeSelectAll) {
                that.data.selectAllStatus = false
                break;
            } else {
                that.data.selectAllStatus = true
            }

            // 储存选中的商品数量
            for (let j = 0; j < cartList[i].data.length; j++) {
                if (cartList[i].data[j].selected) {
                    goodsTotal++;
                } else {
                    goodsTotal--;
                }
            }
        }

        console.log('数量', goodsTotal)
        console.log('被选中的商品id', cartID)
        that.setData({
            cartList: cartList,
            cartID: cartID,
            selectAllStatus: that.data.selectAllStatus,
            goodsTotal: goodsTotal
        })


        // 更新价格
        that.getsumTotal();
        console.log('店铺全选1', that.data.cartID)
    },

    /* 商品单选按钮 */
    handlerGoodsSelect: function (e) {
        // 获取自定义值
        const that = this;
        const index = e.currentTarget.dataset.index; // 商品索引
        const storeIndex = e.currentTarget.dataset.storeindex; // 店铺索引
        let cartList = that.data.cartList

        // 状态切换
        cartList[storeIndex].data[index].selected = !cartList[storeIndex].data[index].selected

        // 储存商量数量的长度
        let goodsLength = cartList[storeIndex].data.length;
        let lenIndex = 0;  // 用来判断该店铺商品是否全部被选中
        var cartID = '';
        // 判断是否选中同时
        cartList[storeIndex].data.forEach(v => {
            // v.selected && lenIndex++
            // 判断是否被选中，存储购物车id和数量
            if (v.selected) {
                cartID += v.cart_id + '|' + v.goods_num + ',';
                lenIndex++;
            }
        });

        // 判断商品是否全部被选中
        for (var i = 0; i < cartList[storeIndex].data.length; i++) {
            if (!cartList[storeIndex].data[i].selected) {
                that.data.selectAllStatus = false
                break;
            } else {
                that.data.selectAllStatus = true
            }
        }

        // // 判断单选按钮是否全部选择
        if (lenIndex != goodsLength) {
            cartList[storeIndex].storeSelectAll = false
        } else {
            cartList[storeIndex].storeSelectAll = true
        }


        that.setData({
            cartList: cartList,
            selectAllStatus: that.data.selectAllStatus,
            cartID: cartID
        })

        console.log('此商品被选中', that.data.cartID)
        // 更新价格
        this.getsumTotal();
        this.goodsTotal();
    },

    /* 全选按钮 */
    selectAll: function () {
        let cartList = this.data.cartList;

        // 状态切换
        this.data.selectAllStatus = !this.data.selectAllStatus;
        var cartID = '';
        // 店铺按钮状态跟随切换
        for (var i = 0; i < cartList.length; i++) {
            // 店铺跟随选中
            cartList[i].storeSelectAll = this.data.selectAllStatus;

            cartList[i].data.forEach(v => {
                // 商品跟随选中
                v.selected = cartList[i].storeSelectAll;

                // 判断是否被选中，存储购物车id和数量
                if (cartList[i].storeSelectAll) {
                    cartID += v.cart_id + '|' + v.goods_num + ','
                }
            });
        }
        console.log('所有全选', cartList)
        console.log('被选中的商品id', cartID)

        // 更新数据
        this.setData({
            cartList: cartList,
            selectAllStatus: this.data.selectAllStatus,
            cartID: cartID

        })

        // 更新价格和商品总数
        this.getsumTotal();
        this.goodsTotal();
    },

    /* 商品数量增加 */
    addGoodsNum: function (e) {
        const that = this;
        const index = e.currentTarget.dataset.index; // 商品索引
        const storeIndex = e.currentTarget.dataset.storeindex; // 店铺索引
        const cart_id = e.currentTarget.dataset.cartid  // 购物车编号

        let cartList = that.data.cartList;
        let goodsNumber = cartList[storeIndex].data[index].goods_num;

        goodsNumber++;

        cartList[storeIndex].data[index].goods_num = goodsNumber;

        // cartList[storeIndex].data[index].goods_num++;
        // 发送请求更新商品数量
        var obj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            cart_id: cart_id,
            quantity: goodsNumber
        }

        app.fetch(app.globalData.url + '/mobile/index.php?act=member_cart&op=cart_edit_quantity&t=json', obj, 'post', 'application/json').then(res => {
            if (res.data.code == 200) {
                console.log(res)

                // 重新获取购物车id和商品数量
                that.getCartID();

            } else if (res.data.code == 400) {

            } else if (res.data.code == 401) {

            }
        })

        that.setData({
            cartList
        })
        // console.log(that.data.cartList)

        // 更新价格
        this.getsumTotal()

    },

    /* 商品数量减少 */
    minusGoodsNum: function (e) {
        const that = this;
        const index = e.currentTarget.dataset.index; // 商品索引
        const storeIndex = e.currentTarget.dataset.storeindex; // 店铺索引
        const cart_id = e.currentTarget.dataset.cartid  // 购物车编号

        let cartList = that.data.cartList;
        let goodsNumber = cartList[storeIndex].data[index].goods_num;


        if (goodsNumber <= 1) {
            return false;
        }
        goodsNumber--;
        cartList[storeIndex].data[index].goods_num = goodsNumber;

        // 发送请求更新商品数量
        var obj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            cart_id: cart_id,
            quantity: goodsNumber
        }

        app.fetch(app.globalData.url + '/mobile/index.php?act=member_cart&op=cart_edit_quantity&t=json', obj, 'post', 'application/json').then(res => {
            if (res.data.code == 200) {
                console.log(res)

                // 重新获取购物车id和商品数量
                that.getCartID();
            } else if (res.data.code == 400) {

            } else if (res.data.code == 401) {

            }
        })

        that.setData({
            cartList
        })

        // 更新价格
        this.getsumTotal()

    },

    /* 商品价格合计 */
    getsumTotal: function () {

        const that = this;
        let cartList = that.data.cartList;
        let num = 0;

        for (var i = 0; i < cartList.length; i++) {
            // console.log(cartList[i])
            cartList[i].data.forEach(v => {
                if (v.selected) {
                    num += v.goods_price * v.goods_num
                }

            })
        }

        // 更新数据
        that.setData({
            totalPrice: num
        })
    },

    /* 商品数量合计 */
    goodsTotal: function () {
        let cartList = this.data.cartList;
        let goodsTotal = 0;
        for (var i = 0; i < cartList.length; i++) {
            for (let j = 0; j < cartList[i].data.length; j++) {
                if (cartList[i].data[j].selected) {
                    goodsTotal++;
                }
            }
        }

        // 更新数据
        this.setData({
            goodsTotal: goodsTotal
        })
    },

    /* 清空购物车  */
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
                that.onLoad();
                console.log(that)
                wx.showToast({
                    title: '商品没有啦~',
                    icon: 'none',
                    duration: 2000
                })


                // 刷新页面
                that.getCartList();
            } else if (res.data.code == 400) {

            } else if (res.data.code == 401) {

            }
        })
    },

    /* 页面倒计时删除时间 */
    deleteTime: function () {
        var that = this;
        // 获取本地存储的值
        const countRecord = wx.getStorageSync('time');
        const cartTime = wx.getStorageSync('cartTime');  // 记录商品添加到购物车的时间
        const cartCloseTime = wx.getStorageSync('cartCloseTime');  // 记录离开购物车的时间

        if (countRecord) {
            var closeConutDown = countRecord.conutDown;  // 获取关闭页面前倒计时时间
            var nowTime = new Date().getTime();  // 获取当前时间

            var res = Math.ceil((nowTime - cartTime) / 1000); // 当前时间 - 历史时间差值

            if (res >= 1200) {
                // 清空购物车
                that.removeGoods()
                // 清除本地存储
                wx.removeStorage({
                    key: 'time',
                    success(res) {
                        console.log('清除成功', res.data)
                    }
                })
            } else {
                that.setData({
                    remainTime: 1200 - res,
                    clock: formatTime(1200 - res)
                })

                clearTimeOut();
                conutDown(that)

            }


            // // 更新数据，获取上个页面传过来的时间戳进行倒计时
            // this.setData({
            //     remainTime: parseInt(closeConutDown)
            // })

            // // 调用倒计时
            // clearTimeOut();
            // if (this.data.remainTime) {
            //     conutDown(this)
            // }
        }
    },

    /* 删除商品 */
    deleteGoods: function (e) {
        console.log(e)
        var that = this;
        const cart_id = e.currentTarget.dataset.cartid  // 购物车编号

        var obj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            cart_id: cart_id
        }

        app.fetch(app.globalData.url + '/mobile/index.php?act=member_cart&op=cart_del&t=json', obj, 'post', 'application/json').then(res => {
            if (res.data.code == 200) {
                wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                })

                // 重新渲染页面
                this.getCartList();
            } else if (res.data.code == 400) {
                wx.showToast({
                    title: '删除失败',
                    icon: 'none',
                    duration: 2000
                })

            }
        })
    },

    /* 获取购物车id和商品数量 */
    getCartID: function () {
        let that = this;
        let cartList = that.data.cartList;

        var cartID = '';
        for (var i = 0; i < cartList.length; i++) {
            cartList[i].data.forEach(v => {
                // 判断是否被选中，存储购物车id和数量
                if (cartList[i].storeSelectAll) {
                    cartID += v.cart_id + '|' + v.goods_num + ','
                }
            });
        }

        that.setData({
            cartID: cartID
        })
        console.log('购物车id和数量更新', that.data.cartID)
    },

    /* 去结算 */
    settleAccounts: function () {
        // console.log(this.data.cartID)
        if (this.data.cartList.length != 0) {
            wx.navigateTo({
                url: `orderConfirm/orderConfirm?cart_id=${this.data.cartID}&ifcart=1`
            })
        } else {
            wx.showToast({
                title: '您还没有添加商品',
                icon: 'none',
                duration: 2000
            })
        }

    },

    /* 去详情页 */
    toDetail: function (e) {
        console.log(e)
        wx.navigateTo({
            // url: `orderConfirm/orderConfirm?cart_id=${e.currentTarget.dataset.id}&ifcart=1`
            url: `../buyDetail/buyDetail?goods_id=${e.currentTarget.dataset.id}&ifcart=1`
        })
    },

    /* 逛逛抢购 */
    toRushPage() {
        
        console.log(this.data.rushId)
        if (this.data.rushId) {
            wx.navigateTo({
                url: "/pages/selfShop/index/flashSales/flashSales?id=" + this.data.rushId
                // url: "pages/selfShop/index/index" 
              })
        } else {
            wx.switchTab({
                url: "/pages/selfShop/index/index" 
            }) 
        }
        
    },

/* 跳转收藏列表 */
    toCollectList() {
        wx.navigateTo({
            url: "/pages/selfShop/myCenter/collection/collection"
            // url: "pages/selfShop/index/index" 
          })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        // var that = this;
        // var time = new Date().getTime();

        // // 如果时间戳为0的时候归为0
        // if (that.data.remainTime <= 0) {
        //     // 清除定时器
        //     clearTimeOut();
        //     // that.onLoad();
        //     // 重新获取购物车列表
        //     // that.getGoodsList()
        // }
        // wx.setStorage({
        //     key: 'cartCloseTime',
        //     data: {
        //         conutDown: that.data.remainTime
        //     }
        // })
        let cartList = this.data.cartList;
        let unselected = [];
        // 页面隐藏的时，记录未被选择按钮的商品id
        for (var i = 0; i < cartList.length; i++) {
            for (var j = 0; j < cartList[i].data.length; j++) {
                // console.log('状态',cartList[i].data[j].selected)
                if (!cartList[i].data[j].selected) {
                    unselected.push(cartList[i].data[j].goods_id)
                }
            }
        }
        wx.setStorage({
            key: 'unselected',
            data: unselected
        })
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