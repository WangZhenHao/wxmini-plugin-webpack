const { relativePath } = require('../helpers/utils')
const path = require('path')

module.exports = class MiniTemplatePlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        const webpack = compiler.webpack;

        compiler.hooks.compilation.tap("MiniTemplatePlugin", (compilation) => {
            webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).render.tap('MyPlugin', (bootstrapSource, module, hash, moduleTemplate, dependencyTemplates) => {
                for(let index = 0; index < bootstrapSource._children.length; index++) {
                    const str = bootstrapSource._children[index]
                    if(typeof str === 'string' && str.indexOf('runtime.js') > -1) {
                        const chunk = module.chunk;
                        const entry = path.join(this.options.outputUtil.outputPath, chunk.name + '.js');
                        const runtime = path.join(this.options.outputUtil.outputPath, chunk.runtime + '.js')
                        const relPath = relativePath(entry, runtime)
                        
                        // const entryModle = .entryModule
                        bootstrapSource._children[index] = str.replace(/\..*\/runtime\.js/, relPath)
                    }
                }
                // return bootstrapSource
            })
            // compilation.hooks.processAssets.tapPromise({
            //     name: "MyPlugin",
            //     stage: compiler.webpack.Compilation
            //         .PROCESS_ASSETS_STAGE_ADDITIONAL,
            //     additionalAssets: true,
            // }, async (assets) => {
            //     const oldSource = assets['runtime.js'];

            //     await compilation.updateAsset('runtime.js', oldSource);
            // });
           
        });
    }
};
