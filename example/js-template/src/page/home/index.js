Page({
    data: {
      checked: true,
    },
  
    onChange({ detail }) {
      // 需要手动对 checked 状态进行更新
      this.setData({ checked: detail });
      console.log(2221)
    },
  });