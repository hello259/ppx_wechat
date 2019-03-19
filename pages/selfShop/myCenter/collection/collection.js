var app = getApp();
Page({
    data: {
        imgUrl: '',
        title_disabled: true,//控制修改表头名字
        management_good: false,
        select_all: false,
        middlearr: [],
        items: [
            { name: '1', checked: false },
            { name: '2', checked: false },
            { name: '3', checked: false },
            { name: '4', checked: false },
            { name: '5', checked: false },
            { name: '6', checked: false },
        ],
        proList: [],
        curpage:1, //页码
        page:10 //每页条数
    },
    onLoad(){
        var that = this;
            that.collectionList(); 
    },
// 上拉
    onReachBottom: function () {
        console.log('上拉')
        var that = this;
        var page = that.data.curpage += 1;
        that.setData({
            curpage: page
        })
        that.collectionList();
    },
    //收藏商品列表
    collectionList(type) {
        var that = this;
        var msgobj = {
            // token: app.globalData.token,
            // v: app.globalData.v,
            // guid: app.globalData.guid,
            // client: app.globalData.client,
            curpage: that.data.curpage,
            page: that.data.page,
        }
        app.fetch(app.globalData.url + '/mobile/index.php?act=member_favorites&op=favorites_list&t=json', msgobj, 'POST', 'application/json').then(res => {
            if (res.data.code == 200) {
                if (!res.data.data.favorites_list || res.data.data.favorites_list.length == 0 || res.data.data.favorites_list == null) {
                    wx.showToast({
                        title: '暂无收藏数据',
                        icon: 'none',
                        duration: 2000
                    })
                    if( type == 2 ){
                        that.setData({
                            proList: []
                        })
                    }
                } else {
                    var arrList = that.data.proList; //正常的列表
                    var arrList2 = []; //删除后的列表
                    for (var i = 0; i < res.data.data.favorites_list.length; i++) {
                        res.data.data.favorites_list[i].checked = false
                        arrList.push(res.data.data.favorites_list[i])
                        // arrList2.push(res.data.data.favorites_list[i])
                    }
                    arrList2 = res.data.data.favorites_list
                    if( type == 2 ){
                        that.setData({
                            proList: arrList2
                        })
                    }else{
                        console.log(123)
                        that.setData({
                            proList: arrList
                        })
                    }
                }
            } else {
                wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    // 改变类目的名字
    change_classname: function () {
        let that = this;
        that.setData({
            title_disabled: !that.data.title_disabled,
        });
        //  这里自动获取焦点
    },
    finish_classname: function () {
        let that = this;
        that.setData({
            title_disabled: !that.data.title_disabled,
        })
    },
    // 管理商品
    management: function () {
        let that = this;
        that.setData({
            management_good: true,
        })
    },
    finish_management: function () {
        let that = this;
        that.setData({
            management_good: false,
        })
    },
    // 选择
    select: function (e) {
        var that = this;
        let arr2 = [];
        if (that.data.management_good == false) {
            return;
        } else {
            var arr = that.data.proList;
            var index = e.currentTarget.dataset.id;
            arr[index].checked = !arr[index].checked;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].checked) {
                    arr2.push(arr[i])
                }
            };
            that.setData({
                proList: arr,
                middlearr: arr2
            })
        }
    },
    // 删除
    deleteitem: function () {
        var that = this;
        let arr = that.data.proList;
        let arr2 = [];
        for (let i = 0; i < arr.length; i++) {
            // if (arr[i].checked == false) {
            //     console.log(arr[i])
            //     arr2.push(arr[i]);
            // }
            if( arr[i].checked == true ){
                arr2.push(arr[i].fav_id)
            }
        }
        if( arr2.length == 0 ){
            wx.showToast({
                title: '请选择商品',
                icon: 'none',
                duration: 2000
              })
              return
        }
        var msgobj = {
            token: app.globalData.token,
            v: app.globalData.v,
            guid: app.globalData.guid,
            client: app.globalData.client,
            fav_id: arr2.join(',')
        }
        app.fetch(app.globalData.url + '/mobile/index.php?act=member_favorites&op=favorites_del&t=json', msgobj, 'POST', 'application/json').then(res => {
            if(res.data.code == 200){
                wx.showToast({
                    title: '删除成功',
                    icon: 'none',
                    duration: 2000
                  })
                  that.data.curpage = 1;
                  that.collectionList(2);
            }else{
                wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 2000
                  })
            }
        })
        // that.setData({
        //     proList: arr2,
        //     middlearr: []
        // })
    },
    // 全选
    select_all: function () {
        let that = this;
        that.setData({
            select_all: !that.data.select_all
        })
        if (that.data.select_all) {
            let arr = that.data.proList;
            let arr2 = [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].checked == true) {
                    arr2.push(arr[i]);
                } else {
                    arr[i].checked = true;
                    arr2.push(arr[i]);
                }
            }
            that.setData({
                proList: arr2,
                middlearr: arr2
            })
        }
    },
    // 取消全选
    select_none: function () {
        let that = this;
        that.setData({
            select_all: !that.data.select_all
        })
        let arr = that.data.proList;
        let arr2 = [];
        for (let i = 0; i < arr.length; i++) {
            arr[i].checked = false;
            arr2.push(arr[i]);
        }
        that.setData({
            proList: arr2,
            middlearr: []
        })
    }
})