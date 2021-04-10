//0引入用来发送请求的方法
import { request } from '../../request/index.js';
Page({
  data: {
    swiperList:[],
    //导航数组
    catesList:[],
    //楼层数据
    floorList:[]
  },
  onLoad: function (options) {
      //  //发送异步请求
      //  var reqTash=wx.request({
      //    url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
      //          https://api-hmugo-web.itheima.net/api/public/v1/categories
      //    success:(result)=>{
      //      this.setData({
      //        swiperList:result.data.message
      //      })
      //    }
      //  });
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
    // request({url:"/home/swiperdata"})
    //   .then(result=>{
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    // })
  },
  //获取轮播图数据方法
  getSwiperList(){
    request({url:"/home/swiperdata"})
      .then(result=>{
        this.setData({
          swiperList:result
        })
    })
  },
   //获取分类导航数据方法
   getCateList(){
    request({url:"/home/catitems"})
      .then(result=>{
        this.setData({
          catesList:result
        })
    })
  },
  //获取楼层数据方法
  getFloorList(){
    request({url:"/home/floordata"})
      .then(result=>{
        this.setData({
          floorList:result
        })
    })
  },
  onReady: function () {
    //,https://api-hmugo-web.itheima.net/api/public/v1/home/floordata
  }

})