// pages/selfShop/sharePage/shareGroup/shareGroup.js
var app = getApp();
import { formatTime, conutDown, clearTimeOut } from '../../../../utils/common';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        remainTime: 0, // 倒计时
        isRuleClose: true, // 拼团规则显示隐藏
        maskFlag: true, // 遮罩层
        order_id:'', //拼团id
        goods_id:'', //商品id
        buyer_avatar:'', //团主头像
        img: '', //商品图片
        title: '', //商品标题
        ptprice: '', //拼团价格
        people: '', //需要成团总人数
        nowpeople:'', //剩余拼团人数
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            order_id: options.order_id,
            goods_id: options.goods_id
        })
        var that = this;
        // this.handlerOpenSuccess();
        var obj = {
            order_id: that.data.order_id
        }
        console.log('obj',obj)
        app.fetch(app.globalData.url + '/mobile/index.php?act=goods_assemble&op=assemble_info&t=json', obj, 'POST', 'application/json').then(res => {
            console.log(res)
            if (res.data.code == 200) {
                
                that.setData({
                    remainTime: res.data.data.surplus_time,
                    buyer_avatar: res.data.data.buyer_avatar,
                    people: res.data.data.goods_assemble_number,
                    nowpeople: res.data.data.goods_assemble_surplus_number
                })
                that.formatTime(res.data.data.surplus_time)
                that.conutDown();
            } else {
                wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
        var obj2 = {
            goods_id: that.data.goods_id
        }
        console.log('obj2',obj2)
        app.fetch(app.globalData.url + '/mobile/index.php?act=goods&op=goods_detail&t=json', obj2, 'POST', 'application/json').then(res => {
            console.log(res)
            if (res.data.code == 200) {

                that.setData({
                    img:res.data.data.goods_image,
                    title:res.data.data.share_title,
                    ptprice: res.data.data.goods_info.goods_assemble_price,

                })
            } else {
                wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    formatTime(time) {
        let seconds = 0;
        let minutes = 0;
        let hours = 0;
        let day = 0;
    
        if (time) {
            seconds = time;
    
            if (seconds > 59) {
                minutes = Math.floor(seconds / 60);
                seconds = seconds % 60;
                if (minutes > 59) {
                    hours = Math.floor(minutes / 60);
                    minutes = minutes % 60;
    
                    if (hours > 23) {
                        day = Math.floor(hours / 24);
                        hours = hours % 60;
                    }
                }
            }
        }
    
        let ds = day > 0 ? day : `${day}天`;
        let hs = hours > 9 ? hours : `0${hours}`;
        let ms = minutes > 9 ? minutes : `0${minutes}`;
        let ss = seconds > 9 ? seconds : `0${seconds}`;
        let obj = {};
        obj.hours = hs;
        obj.minutes = ms;
        obj.seconds = ss;
        obj.days = ds;
        // return ds > 0 ? `${ds} ${hs}: ${ms}: ${ss}` : `${hs}: ${ms}: ${ss}`
    
        // return ds > 0 ? `${hs}: ${ms}: ${ss}` : `${hs}: ${ms}: ${ss}`;
        return obj;
    },
    conutDown() {
        var that = this;
        let seconds = that.data.remainTime;
        
        if (seconds === 0) {
            that.setData({
                remaimTime: 0,
                clock: that.formatTime(0)
            })
            
            return;
        }
    
        
        setTimeout(function() {
            that.setData({
                remainTime: seconds - 1,
                clock: that.formatTime(seconds - 1)
            });
            that.conutDown()
        }, 1000)
    },
    toPay(){
        var that = this;
        var assemble_params = JSON.stringify({
            order_id: that.data.order_id,
            goods_id: that.data.goods_id,
            goods_num: 1,
            isPt:1
        })
        wx.redirectTo({
            url: '/pages/selfShop/cart/orderAssemble/orderAssemble?assemble_params=' + assemble_params
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        clearTimeOut();

        if (this.data.remainTime) {
            conutDown(this)
        }
    },

    /* 点击打开规则弹出层 */
    handlerOpenRule: function() {
        this.setData({
            maskFlag: false,
            isRuleClose: false
        })
    },
    /* 点击关闭规则弹出层 */
    handlerCloseRule: function() {
        this.setData({
            maskFlag: true,
            isRuleClose: true
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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

    }
})