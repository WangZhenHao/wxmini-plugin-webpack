declare const Tools: {
    getLocalStorage(key: any): any;
    clearAllLocalStorage(): void;
    clearLocalStorage(key: any): void;
    setLocalStorage(key: any, value: any, expires: any): void;
    /**
     * 显示加载框
     * @param  {[type]} title [description]
     * @return {[type]}       [description]
     */
    showLoading(title?: string): void;
    /**
     * 隐藏加载框
     * @return {[type]} [description]
     */
    hideLoading(): void;
};
export default Tools;