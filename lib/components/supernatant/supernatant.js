Component({
   options: {
      multipleslots: true
   },
   properties: {
      imgUrl: {
         type: String,
         value:''
      },
      userInfo: {
         type:String,
         value:'hello'
      },
      goodsId: {
         type: String,
         value:''
      }
      
   },
   
   data: {
      isShow: false,
      hint: '这是自定义组件'
   },
   methods: {
      clickTap(e) {
         console.log(this.data.userInfo)
         console.log('goodsId', this.data.goodsId)
         console.log(this.data.imgUrl)
         //　自定义的时间名称
         this.triggerEvent('clickMe')
         
      },
      jumpGoodsDetail() {
         // console.log(123123)
         // this.triggerEvent('goDetail')
         this.setData({
            userInfo: 'clickme'
         })
      }
   }
})