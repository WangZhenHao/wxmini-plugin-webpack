
const path = require("path");
const {
    addModule,
    calResolve
} = require('./parse-wxml');
const { relativePath } = require("../helpers/utils");
// var CleanCSS = require('clean-css');

const { RELATIVEPATH } = require('../helpers/constant')

const map = {
    wxss: /@import ('|")([^"].+?)('|");/g,
    wxs: /require\(('|")([^)]*.wxs)('|")\)/g
}


async function parseWxss(context, source, callback, key = 'wxss') {
    let matched = null;
    const promiseModule = [];
    const wxssDepsReg = map[key]
    // 不解析@import关键字
    // const result = new CleanCSS({inline: false }).minify(source);

    // 如果出错了
    // if(result.errors && result.errors.length) {
    //     callback(JSON.stringify(result.errors), result.style)
    //     return;
    // }

    // source = result.styles

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