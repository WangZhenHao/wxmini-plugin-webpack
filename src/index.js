const path = require('path');
const FileEntryPlugin = require('./plugin/FileEntryPlugin')
const MiniTemplatePlugin = require('./plugin/MiniTemplatePlugin')

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

        compiler.hooks.emit.tap('MiniProgramPlugin', this.setEmitHook.bind(this))
    }

    /**
     * Hook into the webpack compilation
     * @param {Compilation} compilation
     */
    setEmitHook(compilation) {
        const assets = compilation.assets

        Object.keys(assets).forEach(fileName => {
            if(this.FileEntryPlugin.chunkNames.indexOf(fileName) >= 0) {
                delete assets[fileName]
            }
        })
    }
};

