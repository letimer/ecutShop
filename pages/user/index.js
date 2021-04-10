

 Page({

   /**
    * 页面的初始数据
    */
   data: {
     //被收藏的商品数量
     collectNum:0,
     userinfo:{},
     imageUrl:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.17qq.com%2Fimg_biaoqing%2F61307321.jpeg&refer=http%3A%2F%2Fwww.17qq.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620284854&t=62ece2007b7c1815c12e6b60debc392b"
   },
  /**
    * 获取用户信息
    * @param {*} e 
    */
   onShow(){
     const userinfo=wx.getStorageSync('userinfo');
     const collect=wx.getStorageSync('collect')||[];
     this.setData({
       userinfo,
       collectNum:collect.length
      //  avatarUrl:avatarUrl
      });
   },
   handleRefund(){
  //    wx.showToast({
  //      title: '暂不支持该功能~',
  //      mask: true
  //    });
    }
 })
