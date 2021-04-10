/** 
 * 1.页面加载时候
 *    1.从缓存当中获取购物车的数据，渲染到页面中（这些数据的check属性为true）
 *  2.微信支付
 *    1.哪些人哪些账号可以实现微信支付
 *       1.需要选择企业账号
 *        2.在开发者中加入白名单*/
import { getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx.js";
Page({
  data:{
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //1.获取缓存当中的收获地址
    const address=wx.getStorageSync('address');
    //1.获取缓存当中的数据
    let cart=wx.getStorageSync('cart')||[];
    //过滤后的购物车数组
    cart=cart.filter(v=>v.checked);
    this.setData({address});
      //1.总价格 总数量
  let totalPrice=0;
  let totalNum=0;
  cart.forEach(v=>{
      totalPrice+=v.num*v.goods_price;
      totalNum+=v.num;
  })
  this.setData({
    cart,
    totalPrice,
    totalNum,
    address
  });
 },
 handlePay(){
  wx.showToast({
    title: '抱歉,暂时不支持支付功能~',
    icon:"none",
    mask: true
  })
}
})