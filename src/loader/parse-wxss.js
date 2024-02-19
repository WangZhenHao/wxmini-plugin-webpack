
const path = require("path");
const {
    addModule,
    calResolve
} = require('./parse-wxml');
const { relativePath } = require("../helpers/utils");
const CleanCSS = require('../lib/clean-css/index.js')
// var CleanCSS = require('clean-css');
// var UglifyJS = require("uglify-js");
const { RELATIVEPATH } = require('../helpers/constant')

// 移除注释
const removeCommoent = function(code) {
    // var re = /(\/\/.*\n?)|(\/\*[\s\S]*?\*\/)/g;

    // return code.replace(re, '')
    return code;
}

const map = {
    wxss: {
        re: /@import ('|")([^"].+?)('|");/g,
        miniFn: (code) => {
            const  res = CleanCSS(code);
            return res.styles
        }
    },
    wxs: {
        re: /require\(('|")([^)]*.wxs)('|")\)/g,
        // miniFn: (code) => {
        //     const result = UglifyJS.minify(code, { compress: false, mangle: false })

        //     return result.code;
        // }
        miniFn: (code) => removeCommoent(code)
    }
}


async function parseWxss(context, source, callback, key = 'wxss') {
    let matched = null;
    const promiseModule = [];
    const wxssDepsReg = map[key].re;
    const miniFn = map[key].miniFn

    source = miniFn(source);

    while ((matched = wxssDepsReg.exec(source)) !== null) {
        let dep = matched[2];
        // let ext = path.extname(dep);

        if (!RELATIVEPATH.test(dep)) {
            const result = await calResolve(
                context.resolve,
                context.rootContext,
                dep
            );
            const resoveRelPath = relativePath(context.resourcePath, result);
            source = source.replace(dep, resoveRelPath);

            dep = result;
        }

        let filePath = path.resolve(path.dirname(context.resourcePath), dep);

        context.addDependency(filePath);
        promiseModule.push(addModule(context.loadModule, filePath));
    }

    return Promise.all(promiseModule).then((res) => {
        if (res && res.length) {
            for (let item of res) {
                const filePath = item.filePath.replace(context.rootContext, "");

                context.emitFile(filePath, item.source);
            }
        }

        callback(null, source);
    });

    // callback(null, source);
}

module.exports = parseWxss