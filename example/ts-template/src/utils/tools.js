const Tools = {
    getLocalStorage(key) {
        var json = JSON.parse(wx.getStorageSync(key));
        if (json) {
            if (json.expires) {
                var timestamp = parseInt(+new Date() / 1000);
                if (timestamp > json.expires) {
                    this.clearLocalStorage(key);
                    return null;
                }
            }
            return json[key];
        } else {
            return null;
        }
    },
    clearAllLocalStorage() {
        wx.clearStorageSync()
    },
    clearLocalStorage(key) {
        wx.removeStorageSync(key);
    },
    setLocalStorage(key, value, expires) {
        var json = {};
        json[key] = value;
        if (expires) {
            var timestamp = parseInt(+new Date() / 1000) + expires;
            json["expires"] = timestamp;
        }

        // localStorage.setItem(key, JSON.stringify(json));
        wx.setStorageSync(key, JSON.stringify(json));
    },
    /**
     * 显示加载框
     * @param  {[type]} title [description]
     * @return {[type]}       [description]
     */
    showLoading(title = "加载中...") {
        wx.showLoading({
            title: title,
            mask: true,
        });
    },
    /**
     * 隐藏加载框
     * @return {[type]} [description]
     */
    hideLoading() {
        wx.hideLoading();
    },
};

export default Tools;
