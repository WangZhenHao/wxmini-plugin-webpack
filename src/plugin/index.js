const FileEntryPlugin = require('./FileEntryPlugin')
const MiniTemplatePlugin = require('./MiniTemplatePlugin')
const LogPlugin = require('./LogPlugin')

/** @typedef {import("webpack/lib/Compilation.js")} Compilation */

module.exports = class MiniProgramPlugin {
    constructor(options) {
        // this.compilation = null
        this.outputUtil = {}
    }

    apply(compiler) {
        this.outputUtil.outputPath = compiler.options.output.path
        compiler.miniLoader = this;

        this.FileEntryPlugin = new FileEntryPlugin();
        this.FileEntryPlugin.apply(compiler)

        new MiniTemplatePlugin({
            outputUtil: this.outputUtil
        }).apply(compiler)

        compiler.hooks.compilation.tap('MiniProgramPlugin', (compilation) => {
            compilation.hooks.processAssets.tap({
                name: 'setEmit',
                stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
                additionalAssets: true          
            }, this.setEmitHook.bind(this))
        })

        
        new LogPlugin().apply(compiler)
    }

    /**
     * Hook into the webpack compilation
     * @param {Compilation} compilation
     */
    setEmitHook(assets) {
        // const assets = compilation.assets

        Object.keys(assets).forEach(fileName => {
            if(this.FileEntryPlugin.chunkNames.indexOf(fileName) >= 0) {
                delete assets[fileName]
            }
        })
    }

    
};

