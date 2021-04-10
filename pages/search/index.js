import { request } from '../../request/index.js';
Page({
  /**
   * 1.输入框绑定 值改变事件 INPUT事件
   *   1.获取到输入框的值
   *   2.合法性判断
   *   3.检验通过 把输入框的数值 发送到后台
   *   4.返回的数据打印到页面上
   * 2.防抖(防止抖动，通过定时器来实现)
  */
  data: {
    goods:[],
    //取消按钮是否显示
    isFocus:false
  },
  TimeId:-1,
  //输入框的数值改变就会触发的事件
  handleInput(e){
    //1.获取输入框的值
    const {value}=e.detail;
    //2.检测合法性
    if(!value.trim()){
      // this.setData({
      //   goods:[],
      //   isFocus:false,
      //   //数组框的数值
      //   inpValue:''
      //})
      //数值不合法
      return;
    }
    //3.准备发送请求数据
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimdeId);
    this.TimdeId=setTimeout(()=>{
      this.qsearch(value);
    },1000);
  },
  //发送请求获取搜索建议 数据
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}});
    this.setData({
      goods:res
    })
  },
  //点击取消
  handleCancel(){
    this.setData({
      inpValue:'',
      isFocus:false,
      goods:[]
    })
  }
})