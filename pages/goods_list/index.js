/*
1.用户上滑页面 滚动条触底 开始加载下一页数据
  找到滚动条触底事件
  判断有没有下一页数据
    获取到总页数   只有总条数
    总页数 =Math.ceil(总条数/页容量 pagesize)
    获取到当前页码  pagenum
    判断一下，当前页码是否大于等于总页数

  假如没有，则弹出一个提示框
  假如还有下一页数据 则加载下一页数据
     1.当前页码++
     2.重新发送请求
     3.数据请求回来  要对data中的数组进行拼接 而不是替换
*/
import { request } from '../../request/index.js';
Page({
  data: {
    tabs:[
      {
        id:0,
        value:'综合',
        isActive:true
      },
      {
        id:1,
        value:'销量',
        isActive:false
      },
      {
        id:2,
        value:'价格',
        isActive:false
      },
    ],
    goodsList:[]

  },
  //接口要的参数
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  totalPages:1,
  onLoad: function (options) {
    this.QueryParams.cid=options.cid;
    this.getGoodsList();

    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function(){
      wx.hideLoading()
    },2000)
  },

  //获取商品列表数据
  async getGoodsList(){
    const res=await request({url:'/goods/search',data:this.QueryParams});
    //获取总条数
    const total=res.total;
    //计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    console.log(this.totalPages);
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
    })
    //关闭下拉刷新的窗口
    wx.stopPullDownRefresh();

  },
  //标题的点击事件,从子组件传递过来的
  handletabsItemChange(e){
    //获取被点击的标题索引
    const {index}=e.detail;
    //修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    //赋值到data当中
    this.setData({
      tabs
    })
  },
  //页面上滑
  onReachBottom(){
    //判断有没有下一页
    if(this.QueryParams.pagenum>=this.totalPages){
      // //没有下一页数据
       //console.log('%c'+'没有下一页了','color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)')
       wx.showToast({
         title:'我可是有底线呢'
       })
    }else{
      // //还有下一页数据
      
      // console.log('%c'+'有下一页','color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)');
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  //下拉刷新页面
  onPullDownRefresh(){
    console.log('刷新');
    //重置数组
    this.setData({
      goodsList:[]
    })
    //重置页码
    this.QueryParams.pagenum=1;
    //重新发送请求
    this.getGoodsList();
  }
})