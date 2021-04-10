  /**
   * 1.获取用户的收货地址
      *   1.绑定点击事件
      *   2.调用小程序内置api 获取用户的收货地址
        * 2.获取用户对小程序所授予获取地址的权限状态 scope
        *      1.假设用户点击获取收获地址的提示框 确定（scope值为true）authSetting scope.address
        *      2.假设用户点击获取收货地址的提示框 取消（scope 值为 false）
        *      3.将地址存入到缓存当中方便当前应用和其它应用查看
   * 2.页面加载完毕
      * 0.onload show
      * 1.获取本地存储中的地址数据
      * 2.把数据设置给data中的一个变量
   * 3.onshow
      * 0.回到了商品详情页面 在第一次添加商品的时候 手动添加了属性
      *    1.num
      *    2.checked
      * 1.获取缓存中的购物车数组
      * 2.把购物车数据填充到data当中
     4.全选的实现
        1.onshow, 获取到缓存当中的购物车数组
        2.根据购物车中的商品数据 所有的商品都被选中  checked=true  全选就被选中
        3.空数组调用了every的方法，返回值为true,所以会出现购物车为空但是也是全选的情况
     5.总价格和总数量
         1.都需要商品被选中 我们才拿它来计算
         2.获取购物车数组
         3.遍历
         4.判断商品是否被选中
         5.总价格+=商品的单价*商品的数量
         6.总数量+=商品的数量
      6.商品选中
         1.绑定change事件
         2.获取到被修改的商品对象
         3.商品对象的选中状态 取反
         4.重新填充回data和缓存当中
         5.重新计算全选，总价格 总数量等
      7.全选和反选
        1.全选复选框绑定事件change
        2.获取data中的全选变量 allckecked
        3.直接取反 allChecked=!allChecked
        4.遍历购物车数组，让里面的购物车商品选中状态跟随allChecked改变而改变
        5.把购物车数组和allChecked重新设置回data 把购物车重新设置回缓存中
      8.商品数量的编辑
        1.“+”，“-”按钮，绑定同一个点击事件 区分的关键 自定义属性
          1."+"  "+1"
          2."-"  "-1"
        2.传递被点击的商品id goods_id
        3.获取data中的购物车数组 来获取需要被修改的商品对象
        4.当购物车数量为1且用户继续操作数量减一时，弹窗是否要删除
          1.确定——直接删除
          2.取消——什么都不做
        4.直接修改商品对象的数量 num
        5.把cart数组 重新设置回缓存和data当中
      9.点击结算
        1.有没有收货地址信息
        2.判断用户有没有选购商品
        3.结果以上的验证 跳转到支付页面
   */
import { getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx.js";
Page({
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //1.获取缓存当中的收获地址
    const address=wx.getStorageSync('address');
    //1.获取缓存当中的数据
    const cart=wx.getStorageSync('cart')||[];
    // //1.计算全选
    // //every数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true,那么every方法返回值为true
    // //只要有一个回调函数返回了false,那么不再循环执行，直接返回false
    this.setData({address});
    this.setCart(cart);
  },
  //点击 收货地址
async handleChooseAddress(){
 try {
    //1.获取权限状态
    const res1=await getSetting();
    const scopeAddress=res1.authSetting["scope.address"];
    //2判断权限状态
    if(scopeAddress===false){
      //3诱导用户打开授权页面
      await openSetting();
    }
    let address=await chooseAddress();
    address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;

    //4存入到缓存当中
    wx.setStorageSync('address', address);
 } catch (error) {
   console.log(error);
 }
 },
 //商品的选中
 handleItemChange(e){
   //1.获取被修改的商品id
   const goods_id=e.currentTarget.dataset.id;
  //  console.log(goods_id);
  //2，获取购物车数组
  let {cart}=this.data;
  //3.找到被修改的商品对象
  let index=cart.findIndex(v=>v.goods_id===goods_id);
  //4.选中状态取反
  cart[index].checked=!cart[index].checked;
   this.setCart(cart);
 },
 //设置购物车状态的同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
 setCart(cart){
  let allChecked=true;
  //1.总价格 总数量
  let totalPrice=0;
  let totalNum=0;
  cart.forEach(v=>{
    if(v.checked){
      totalPrice+=v.num*v.goods_price;
      totalNum+=v.num;
    }else{
      allChecked=false;
    }
  })
  //判断数组是否为空
  allChecked=cart.length!=0?allChecked:false;
  this.setData({
    cart,
    totalPrice,
    totalNum,
    allChecked
  });
  wx.setStorageSync('cart', cart);
 },
 //商品全选功能
 handleItemAllCheck(){
   //1.获取data中的数据
   let {cart,allChecked}=this.data;
   //2.修改值
   allChecked=!allChecked;
   //3.循环修改cart数组中的商品选中状态
   cart.forEach(v=>v.checked=allChecked);
   //4.把修改后的值填回data或者缓存当中
   this.setCart(cart);
 },
 //商品数量编辑功能
 async handleItemNumEdit(e){
   //1.获取传递过来的参数
   const {operation,id}=e.currentTarget.dataset;
   //2.获取购物车数组
   let {cart}=this.data;
   //3.找到需要修改的商品的索引
   const index=cart.findIndex(v=>v.goods_id===id);
   //4.判断是否要执行删除
   if(cart[index].num===1&&operation===-1){
     //弹窗提示
    const res=await showModal({content:"你是否要删除这个宝贝"});
    if(res.confirm){
      cart.splice(index,1);
      this.setCart(cart);
    }
   }else{
    //4.进行修改数据
    cart[index].num+=operation;
    //5.设置回缓存和data当中
    this.setCart(cart);
   }
 },
 //点击结算功能
 async hanndlePay(){
   //1.判断收货地址
   const {address,totalNum}=this.data;
   if(!address.userName){
   await showToast({title:"您还没有选择收货地址"});
   return;
   }
   //2.判断用户有没有选购商品
   if(totalNum===0){
     await showToast({title:"您还没有选购商品"});
     return ;
   }
   //3.跳转到支付页面
   wx.navigateTo({
     url: '/pages/pay/index',
   })
 }
})