
var app = getApp();
let multiArray0 = [];
let multiArray1 = [];
let multiArray2 = [];
Page({
  data: {
    multiArray: [multiArray0, multiArray1, multiArray2], //封装obj
    multiIndex: [0, 0, 0],
    location_id: 1, //默认省份id
    city_id: 36, //默认城市id
    country_id: 0,
    consignee: '',//收货人
    phoneNum: '',//手机号码
    address: '',//详细地址
    ischecked: false,//是否默认
    addressId:'',//地址id
    editCountryId:'',//编辑省
    editLocationId:'',//编辑市
    editCityId:'',//编辑区
    editCityText:'',//省市区文字
    isCheck: '未审核',
    flag: false,
    show: true,
    // 省级 
    provinceName: [], // 省名称
    provinceCode: [], // 省编号
    provinceIndex: '', // 省序号
    // 市级
    cityName: [], // 市名称
    cityCode: [], // 市编号
    cityIndex: '', // 市序号
    // 区级
    countyName: [], // 区名称
    countyCode: [], // 区编号
    countyIndex: '', // 区序号
    // 下标
    pro: 0,
    cit: 0,
    cou: 0,
    // 营业执照url
    picUrl: '',
    isshop: '',//0个人中心进入 1购物进入
    isshopText: ''//0保存 1保存并使用
  },
  //保存收货人
  setConsignee(e) {
    this.setData({
      consignee: e.detail.value
    })
  },
  //保存手机号码
  setPhoneNum(e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  setAddress(e) {
    this.setData({
      address: e.detail.value
    })
  },
  //保存地址
  saveAddress() {
    var that = this;
    if( that.data.addressId != '' ){
      var text = '';
      if( that.data.editCityText == that.data.provinceIndex + ' ' + that.data.cityIndex + ' ' + that.data.countyIndex ){
        text = that.data.editCityText;
        
      }else{
        text = that.data.multiArray[0][that.data.multiIndex[0]].area_name + ' ' + that.data.multiArray[1][that.data.multiIndex[1]].area_name + ' ' + that.data.multiArray[2][that.data.multiIndex[2]].area_name
         
      }
      var citobj = {
        token: app.globalData.token,
        v: app.globalData.v,
        guid: app.globalData.guid,
        client: app.globalData.client,
        true_name: that.data.consignee,//姓名
        mob_phone: that.data.phoneNum,//手机号码
        area_id: that.data.multiIndex[2] == 0? that.data.editCityId : that.data.multiArray[2][that.data.multiIndex[2]].area_id,//地区ID
        city_id: that.data.multiIndex[1] == 0? that.data.editLocationId :   that.data.multiArray[1][that.data.multiIndex[1]].area_id,//城市ID
        area_info: text,//地址地区详情内容（空格隔开的省、市、区）
        address: that.data.address,//地址详情内容
        is_default: that.data.ischecked ? 1 : 0,//是否设置为默认地址（0=否，1=是）
        address_id: that.data.addressId
      }
      var apiUrl = '/mobile/index.php?act=member_address&op=address_edit&t=json';
     
    }else{
      var citobj = {
        token: app.globalData.token,
        v: app.globalData.v,
        guid: app.globalData.guid,
        client: app.globalData.client,
        true_name: that.data.consignee,//姓名
        mob_phone: that.data.phoneNum,//手机号码
        area_id: that.data.multiArray[2][that.data.multiIndex[2]].area_id,//地区ID
        city_id: that.data.multiArray[1][that.data.multiIndex[1]].area_id,//城市ID
        area_info: that.data.multiArray[0][that.data.multiIndex[0]].area_name + ' ' + that.data.multiArray[1][that.data.multiIndex[1]].area_name + ' ' + that.data.multiArray[2][that.data.multiIndex[2]].area_name,//地址地区详情内容（空格隔开的省、市、区）
        address: that.data.address,//地址详情内容
        is_default: that.data.ischecked ? 1 : 0//是否设置为默认地址（0=否，1=是）
      }
      var apiUrl = '/mobile/index.php?act=member_address&op=address_add&t=json';
    }
    
    app.fetch(app.globalData.url + apiUrl, citobj, 'POST', 'application/json').then(res => {
      if (res.data.code == 200) {
        wx.navigateBack();
      } else {
        wx.showToast({
          title: res.data.error,
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  //是否默认
  switchChecked(e) {
    var that = this;
    this.setData({
      ischecked: !that.data.ischecked
    })
  },
  //滑动选择城市
  changecity(e) {
    let that = this;
    var citobj = {
      token: app.globalData.token,
      v: app.globalData.v,
      guid: app.globalData.guid,
      client: app.globalData.client,
      area_id: that.data.multiArray[0][e.detail.value[0]].area_id
    }
    app.fetch(app.globalData.url + '/mobile/index.php?act=member_address&op=area_list&t=json', citobj, 'POST', 'application/json').then(res => {
      let dataArray = res.data.data.area_list;
      that.setData({
        multiArray: [that.data.multiArray[0], dataArray, that.data.multiArray[2]],
        multiIndex: e.detail.value
      })
      var citobj = {
        token: app.globalData.token,
        v: app.globalData.v,
        guid: app.globalData.guid,
        client: app.globalData.client,
        area_id: that.data.multiArray[1][e.detail.value[1]].area_id
      }
      app.fetch(app.globalData.url + '/mobile/index.php?act=member_address&op=area_list&t=json', citobj, 'POST', 'application/json').then(res => {
        let dataArray1 = res.data.data.area_list;
        if( dataArray1.length == 0 || !dataArray1 || dataArray1 == null ){
          dataArray1 = [{area_id:'',area_name:''}]
        }
        that.setData({
          multiArray: [that.data.multiArray[0], that.data.multiArray[1], dataArray1],
          multiIndex: e.detail.value
        })
      })

    })
  },
  //获取省份，后端提供的省份接口地址
  loadProivnce() {
    let that = this;
    var proobj = {
      token: app.globalData.token,
      v: app.globalData.v,
      guid: app.globalData.guid,
      client: app.globalData.client,
      area_id: 0
    }


    app.fetch(app.globalData.url + '/mobile/index.php?act=member_address&op=area_list&t=json', proobj, 'POST', 'application/json').then(res => {
      let dataArray = res.data.data.area_list;
      multiArray0 = dataArray;
      //根据默认省，获取默认市
      that.loadCity(that.data.location_id)
    })
  },
  //获取市级，后端提供的市级接口地址
  loadCity(location_id) {
    let that = this;
    var citobj = {
      token: app.globalData.token,
      v: app.globalData.v,
      guid: app.globalData.guid,
      client: app.globalData.client,
      area_id: location_id
    }
    app.fetch(app.globalData.url + '/mobile/index.php?act=member_address&op=area_list&t=json', citobj, 'POST', 'application/json').then(res => {
      let dataArray = res.data.data.area_list;
      multiArray1 = dataArray;
      //根据默认市获取对应区
      that.loadCountry(that.data.city_id)
    })
  },
  //获取区县
  loadCountry(location_id) {
    let that = this;
    var couobj = {
      token: app.globalData.token,
      v: app.globalData.v,
      guid: app.globalData.guid,
      client: app.globalData.client,
      area_id: location_id
    }
    app.fetch(app.globalData.url + '/mobile/index.php?act=member_address&op=area_list&t=json', couobj, 'POST', 'application/json').then(res => {
      let dataArray = res.data.data.area_list;
      if( dataArray.length == 0 || !dataArray || dataArray == null ){
        dataArray = [{area_id:'',area_name:''}]
      }
      multiArray2 = dataArray;

      let province_id = that.data.location_id; //默认的省份id 
      let city_id = that.data.city_id; //默认的市区id 
      let multiArray0Index = 0,
        multiArray1Index = 0;
      multiArray0.map(function (v, i) {
        //获取省份所在列的位置
        if (v.location_id == province_id) {
          multiArray0Index = i;
        }
      })
      multiArray1.map(function (v, i) {
        //获取市所在列的位置
        if (v.location_id == city_id) {
          multiArray1Index = i;
        }
      })
      //市区对应的第一个区县id
      let select_id = dataArray[0].location_id
      //初始化

      that.setData({
        multiArray2: dataArray,
        multiArray: [multiArray0, multiArray1, multiArray2], //封装obj
        multiIndex: [multiArray0Index, multiArray1Index, 0],
        // country_id: select_id
      })
      if( that.data.addressId != '' ){
        var editbj = {
          token: app.globalData.token,
          v: app.globalData.v,
          guid: app.globalData.guid,
          client: app.globalData.client,
          address_id: that.data.addressId
        }
        app.fetch(app.globalData.url + '/mobile/index.php?act=member_address&op=address_info&t=json', editbj, 'POST', 'application/json').then(res => {
          if (res.data.code == 200) {
            var countryName = res.data.data.address_info.area_info.trim().split(' ')[0];
            for( var i=0;i<that.data.multiArray[0].length;i++ ){
              if( that.data.multiArray[0][i].area_name == countryName ){
                countryName = that.data.multiArray[0][i].area_name
                break;
              }
            }
            that.setData({
              editCountryId:countryName,//编辑省
            editLocationId:res.data.data.address_info.area_id,//编辑市
            editCityId:res.data.data.address_info.city_id,//编辑区
            editCityText:res.data.data.address_info.area_info,//省市区文字
              // location_id:res.data.data.address_info.city_id,
              // city_id:res.data.data.address_info.city_id,
              consignee:res.data.data.address_info.true_name,
              phoneNum:res.data.data.address_info.mob_phone,
              address:res.data.data.address_info.address,
              addressId:res.data.data.address_info.address_id,
              ischecked:res.data.data.address_info.is_default == 1?true:false,
              provinceIndex:res.data.data.address_info.area_info.trim().split(" ")[0],
              cityIndex:res.data.data.address_info.area_info.trim().split(" ")[1],
              countyIndex:res.data.data.address_info.area_info.trim().split(" ")[2] || '',
              flag: true
            })
          } else {
            wx.showToast({
              title: res.data.error,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
      
    })
  },
  // 加载数据
  onLoad: function (option) {
    var that = this;
    //编辑已有地址
    if (option.id) {
      that.setData({
        addressId:option.id
      })
    }
    this.loadProivnce();
    
    //判断从订单进入还是个人中心进入
    if (option.isshop == 0) {
      this.setData({
        isshop: 0,
        isshopText: '保存'
      })
    } else if (option.isshop == 1) {
      this.setData({
        isshop: 1,
        isshopText: '保存并使用'
      })
    }
  },


  // 控制选择区域的显示和隐藏
  showPicker: function () {
    this.setData({
      show: false
    });
  },

  // 取消时，则隐藏选择区域
  cancel: function () {
    this.setData({
      show: true
    });
  },


  // 确定时，把选择的数据返回并设置到地区区域，同时也隐藏选择区域
  sure: function () {
    var that = this;
    this.setData({
      provinceIndex: that.data.multiArray[0][that.data.multiIndex[0]].area_name,
      cityIndex: that.data.multiArray[1][that.data.multiIndex[1]].area_name,
      countyIndex: that.data.multiArray[2][that.data.multiIndex[2]].area_name,
      flag: true
    })
    // 调用取消方法，隐藏选择区域
    this.cancel();
  },

  fail: function (res) {
    console.log(res.errMsg)
  },


})
//改变多列选择

