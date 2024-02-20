const { ProgressPlugin } = require("webpack");
const readline = require("readline");
const log = require("../helpers/colorlog.js");

module.exports = class Progress {
    apply(compiler) {
        new ProgressPlugin({ handler: this.progress }).apply(compiler);

        compiler.hooks.environment.tap('log-plugin', () => {
            compiler.options.stats.moduleAssets = false;
            compiler.options.stats.assets = false;
            compiler.options.stats.modules = false;
        })

        compiler.hooks.done.tap('log-plugin', this.showList)
    }

    showList(stats) {
        if(stats.compilation.options.mode !== 'production') return;
        
        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);

        const arrList = Object.entries(stats.compilation.assets);
        let padEnd = 0;
        arrList.sort((a, b) =>  {
            if(a[0].length >= padEnd) {
                padEnd = a[0].length;
            }

            return b[1]._size - a[1]._size
        });

        console.table(arrList.map(item => {
            const name = item[0].replace(/\\/g, '/').replace( /^\/(.*)/g, '$1');

            return {
                size: (item[1]._size / 1024).toFixed(2) + 'KB',
                name: name.padEnd(padEnd),
            }
        }))
    }
    /**
     * 输出打包进度
     * @param {String} progress 进度
     * @param {String} event
     * @param {*} modules
     */
    progress(progress, event, modules) {
        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);

        if (+progress === 1) return;
        log(
            `正在打包: ${`${(progress * 100).toFixed(2)}%`} ${event || ""}`,
            "info"
        );
        
    }
}
