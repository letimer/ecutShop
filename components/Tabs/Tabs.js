// components/Tabs/Tabs.js
Component({
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },
  data: {
  },
  methods: {
    //点击事件
    handleItemTap(e){
      //获取点击索引
      const {index}=e.currentTarget.dataset;
      console.log(index);
      //触发父组件中的事件 自定义
      this.triggerEvent("tabsItemChange",{index});
    }
  }
})
