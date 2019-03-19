var app = getApp();
Page({
    data: {
        flag2: 5,
        files: [] ,//图片,
        allMSg:[], // files图片数组  flag2五星状态  goodsId商品id   comment评价
        goodsList:[],
        orderId:'',
        activeIndex:0
    },
    //发布
    pushCommentBtn() {
        var that = this;
        wx.showLoading({
            title: '发布中...',
            icon: 'loading',
        });
        var allNum = 0;
        var requestNum = 0;
        var store = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            order_id: that.data.orderId,
            store_desccredit:5,
            store_servicecredit:5,
            store_deliverycredit:5
        }
        for( var q=0;q<that.data.allMSg.length;q++ ){
            if( that.data.allMSg[q].files.length == 0 ){
                allNum += 1
            }else{
                allNum += 1
                if( that.data.allMSg[q].files.length > 1 ){
                    for( var w=1;w<that.data.allMSg[q].files.length;w++ ){
                        allNum += 1
                    }
                }
            }
        }
        for(var i=0;i<that.data.allMSg.length;i++){
            if( that.data.allMSg[i].files.length == 0 ){
                var msgobj = {
                    token: app.globalData.token,
                    v: app.globalData.v,
                    guid: app.globalData.guid,
                    client: app.globalData.client,
                    order_id: that.data.orderId,
                    goods_id: that.data.allMSg[i].goodsId,
                    score: that.data.allMSg[i].flag2,
                    comment: that.data.allMSg[i].comment,
                    anony:0
                }
                app.fetch(app.globalData.url + '/mobile/index.php?act=member_evaluate&op=addEvaluate', msgobj, 'POST').then(res => {
                    console.log(res)
                    requestNum += 1;
                    wx.showLoading({
                        title: '发布中...',
                        icon: 'loading',
                    });
                })
                //店铺评价
                app.fetch(app.globalData.url + '/mobile/index.php?act=member_evaluate&op=addServiceEvaluate&t=json', store, 'POST', "application/json").then(res => {
                    console.log(res)
                    wx.showLoading({
                        title: '发布中...',
                        icon: 'loading',
                    });
                })
            }else{
                wx.showLoading({
                    title: '发布中...',
                    icon: 'loading',
                });
                //店铺评价
                app.fetch(app.globalData.url + '/mobile/index.php?act=member_evaluate&op=addServiceEvaluate&t=json', store, 'POST', "application/json").then(res => {
                    console.log(res)
                    wx.showLoading({
                        title: '发布中...',
                        icon: 'loading',
                    });
                })
                wx.showLoading({
                    title: '发布中...',
                    icon: 'loading',
                });
                that.uploadPushFile(i).then(function([res,a]){
                    wx.showLoading({
                        title: '发布中...',
                        icon: 'loading',
                    });
                    requestNum += 1
                    var geval = {
                        token: app.globalData.token,
                        v: app.globalData.v,
                        guid: app.globalData.guid,
                        client: app.globalData.client,
                        geval_id: JSON.parse(res.data).data.geval_id
                    }
                    if( that.data.allMSg[a].files.length > 1 ){
                        for( var j=1;j<that.data.allMSg[a].files.length;j++ ){
                            wx.uploadFile({
                                url: app.globalData.url + '/mobile/index.php?act=member_evaluate&op=addEvaluateImage', // 仅为示例，非真实的接口地址
                                filePath: that.data.allMSg[a].files[j],
                                name: 'evaluate_pic1',
                                formData: geval,
                                success(res) {
                                    requestNum += 1;
                                    console.log(res)
                                    // do something
                                },
                                fail(res) {
                                    console.log(res)
                                }
                            })
                        }
                    }
                })
            }
        }
        //所有请求完毕后返回上一页
        var timer = setInterval(function(){
            wx.showLoading({
                title: '发布中...',
                icon: 'loading',
            });
            if( allNum == requestNum ){
                clearInterval(timer)
                wx.hideLoading();
                wx.showToast({
                    title: '发布成功',
                    icon: 'none',
                    duration: 1500
                });
                wx.switchTab({
                    url: '/pages/selfShop/myCenter/order/order'
                  })
                // var pages = getCurrentPages(); // 获取页面栈
                // var currPage = pages[pages.length - 1]; // 当前页面
                // var prevPage = pages[pages.length - 2]; // 上一个页面
                // prevPage.setData({
                //     activeIndexBack:that.data.activeIndex
                // })
                // wx.navigateBack({
                //     delta: 1
                // })
            }
        },1000)
    },
    //promise 循环上传图片
    uploadPushFile: function(a){
        var that = this;
        wx.showLoading({
            title: '发布中...',
            icon: 'loading',
        });
        return new Promise(function(resolve, reject){
            var msgobj = {
                token: app.globalData.token,
                v: app.globalData.v,
                guid: app.globalData.guid,
                client: app.globalData.client,
                anony:0,
                order_id: that.data.orderId,
                goods_id: that.data.allMSg[a].goodsId,
                score: that.data.allMSg[a].flag2,
                comment: that.data.allMSg[a].comment,
            }
            wx.uploadFile({
                url: app.globalData.url + '/mobile/index.php?act=member_evaluate&op=addEvaluate', // 仅为示例，非真实的接口地址
                filePath: that.data.allMSg[a].files[0],
                name: 'evaluate_pic1',
                formData: msgobj,
                success(res) {
                    wx.showLoading({
                        title: '发布中...',
                        icon: 'loading',
                    });
                    resolve([res,a]);
                },
                fail(res) {
                    reject('error');
                }
            })
        })
      },
    //设置评论
    setText(e) {
        var that = this;
        this.data.allMSg[ e.currentTarget.dataset.textindex ].comment = e.detail.value;
        this.setData({
            allMSg: that.data.allMSg
        })
        console.log(this.data.allMSg)
    },
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.data.allMSg[ e.currentTarget.dataset.num ].files.push(res.tempFilePaths[0])
                that.setData({
                    // files: that.data.files.concat(res.tempFilePaths)
                    allMSg:that.data.allMSg
                });
            }
        })
    },
    previewImage: function (e) {
        var that= this;
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: that.data.allMSg[ e.currentTarget.dataset.imgindex ].files // 需要预览的图片http链接列表
        })
    },
    changeColor11: function (e) {
        var that = this;
        that.data.allMSg[ e.currentTarget.dataset.starindex ].flag2 = 1;
        that.setData({
            allMSg: that.data.allMSg
        });
    },
    changeColor12: function (e) {
        var that = this;
        that.data.allMSg[ e.currentTarget.dataset.starindex ].flag2 = 2;
        that.setData({
            allMSg: that.data.allMSg
        });
    },
    changeColor13: function (e) {
        var that = this;
        that.data.allMSg[ e.currentTarget.dataset.starindex ].flag2 = 3;
        that.setData({
            allMSg: that.data.allMSg
        });
    },
    changeColor14: function (e) {
        var that = this;
        that.data.allMSg[ e.currentTarget.dataset.starindex ].flag2 = 4;
        that.setData({
            allMSg: that.data.allMSg
        });
    },
    changeColor15: function (e) {
        var that = this;
        that.data.allMSg[ e.currentTarget.dataset.starindex ].flag2 = 5;
        that.setData({
            allMSg: that.data.allMSg
        });
    },
    onLoad: function (option) {
        console.log(option)
        this.setData({
            orderId: option.orderId,
            activeIndex: option.activeIndex
        })
        var that = this;
        var msgobj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            order_id: option.orderId
        }
        app.fetch(app.globalData.url + '/mobile/index.php?act=member_order&op=order_orderid_detail&t=json', msgobj, 'POST', 'application/json').then(res => {
            if (res.data.code == 200) {
                that.setData({
                    goodsList:res.data.data.goods_list
                })
                var obj = []
                for(var i=0;i<that.data.goodsList.length;i++){
                    obj.push({
                        files:[],
                        flag2:5,
                        goodsId:that.data.goodsList[i].goods_id,
                        comment:''
                    })
                }
               that.setData({
                    allMSg:obj
                })
                console.log(that.data.allMSg)
            } else {
                wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 1500
                });
            }
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
})