/**
 * 1.当我们点击+按钮时，触发Tap事件
 *   1.调用小程序内置的选择图片的api
 *   2.获取到图片路径，数组格式
 *   3.把图片路径存入data变量当中
 *   4.页面根据图片数组将自定义组件遍历出来
 * 2.点击自定义图片
 *   1.获取被点击的元素的索引
 *   2.获取data当中的图片数组
 *   3.根据索引数组中删除元素
 *   4.把删除后的数组设置会data当中
 * 3.点击提交按钮
 *   1.获取文本域内容  类似普通输入框的获取
 *      1.data中定义变量，表示输入框的内容
 *      2.文本域绑定输入事件，事件触发时，把输入框的值获取
 *   2.对这些内容做一个合法性验证
 *   3.验证通过 用户选择的图片 上传到专门的图片的服务器当中 返回图片外网的链接
 *      1.遍历图片数组
 *      2.自己再维护图片数组 存放 上传后的外网链接
 *   4.文本域和外网的图片的路径一起提交到服务器
 *   5.清空当前页面
 *   6.返回到上一页
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:'体验问题',
        isActive:true
      },
      {
        id:1,
        value:'商品，商家投诉',
        isActive:false
      }
    ],
    //表示文本域的内容
    textVal:'',
    //被选中的图片路径数组
    chooseImage:[]
  },
    //点击自定义图片组件
    handleRemoveImg(e){
      //获取点击图片的索引
      const {index}=e.currentTarget.dataset;
      //获取data当中的数组
      let {chooseImage}=this.data;
      //删除元素
      chooseImage.splice(index,1);
      //填充回去
      this.setData({
        chooseImage
      })
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
    //文本域的输入事件
    handleTextInput(e){
     this.setData({
       textVal:e.detail.value
     })
    },
    //提交事件的触发
    handleFormSubmit(){
      //1.获取文本域的内容
      const {textVal,chooseImage}=this.data;
      //2.合法域的验证
       if(!textVal.trim()){
         //不合法
        wx.showToast({
           title: '输入不合法',
           mask:true,
           icon:"none"
         });
         return;
       }
      //3.准备上传图片到专门的图片路径
      //api不支持多个文件同时上传 遍历数组 挨个上传
      // chooseImage.forEach((v,i)=>{
      //   wx.uploadFile({
      //     //被上传的文件的路径
      //     filePath: v,
      //     //被上传的文件的名称，给后台来获取文件  file
      //     name: 'file',
      //     //图片上传到哪里
      //     url: 'https://images.ac.cn/Home/Index/UploadAction/',
      //     success:(result)=>{
      //       console.log(result);
      //     }
      //   })
      // })
    },
    //点击+号选择图片事件
    handleChooseImg(){
      //2.调用小程序内置的选择图片
      wx.chooseImage({
        //同时选中图片的数量
        count: 9,
        //图片的格式 原图 压缩
        sizeType:['original','compressed'],
        //图片的来源,相册或者照相机
        sourceType:['album','camera'],
        success:(result)=>{
          // console.log(result);
          this.setData({
            //图片数组进行一个拼接
            chooseImage:[...this.data.chooseImage,...result.tempFilePaths]
          })
        }
      })
    }
})