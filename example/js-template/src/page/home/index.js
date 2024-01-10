Page({
    data: {
      checked: true,
    },
    onLoad() {
        console.log('1312')
    },
    onChange({ detail }) {
      // 需要手动对 checked 状态进行更新
      this.setData({ checked: detail });
    },
  });