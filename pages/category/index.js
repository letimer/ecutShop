import { request } from '../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧的商品数据
    rightContent:[],
    //被点击的左侧菜单
    currentIndex:0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop:0
  },
  //接口的返回数据
  Cates:[],
  onLoad: function (options) {
    /*
    1.判断本地存储中有没有旧的数据

    2.没有，直接发送新的请求
    3.有，而且没有过期，则使用本地存储中的旧数据即可
    */

    //1.获取本地存储当中的数据(小程序当中也是存在本地存储技术)
    const Cates=wx.getStorageSync('cates');
    //2.判断
    if(!Cates){
      //不存在 发送请求数据
      this.getCates();
    }else{
      //有旧的数据 定义一个过期时间
      if(Date.now()-Cates.time>1000*10){
        //重新发送请求
        this.getCates();
      }else{
        //可以使用旧的数据
        this.Cates=Cates.data;
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
    
  },
  //获取分类数据
  async getCates(){
    // request({
    //   url:'/categories'
    // })
    // .then(res=>{
    //   console.log(res);
    //   this.Cates=res.data.message;

    //   //把接口的数据存入到本地存储当中
    //   wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});

    //   //构造左侧的大菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   //构造右侧的大菜单数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    //1.使用es7的await async来发送请求
    const res=await request({url:'/categories'});
      // this.Cates=res.data.message;
      this.Cates=res;
    //  把接口的数据存入到本地存储当中
       wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});
       //构造左侧的大菜单数据
       let leftMenuList=this.Cates.map(v=>v.cat_name);
       //构造右侧的大菜单数据
      let rightContent=this.Cates[0].children;
       this.setData({
        leftMenuList,
         rightContent
     })
  },
  //左边菜单的点击事件
  handleItemTap(e){
    /*
    1.获取被点击的标题身上的索引
    2.给data当中的currentIndex赋值就可以了
    3.根据不同索引渲染右侧的内容
    */
   const {index}=e.currentTarget.dataset;
   let rightContent=this.Cates[index].children;
   this.setData({
    currentIndex:index,
    rightContent
  })
  this.setData({
    currentIndex:index,
    rightContent,
      //重新设置右侧内容的SCROLL-VIEW标签的距离顶部的距离
    scrollTop:0
  })
  }
})