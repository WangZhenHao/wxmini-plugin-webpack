const path = require("path");
const { RELATIVEPATH } = require('../helpers/constant')

async function parseJson(context, code, callback) {
    const json = JSON.parse(code);

    if(json.usingComponents && Object.keys(json.usingComponents).length) {
        for (let key in json.usingComponents) {
            const component = json.usingComponents[key];
            // 相对路径不做处理
            if(RELATIVEPATH.test(component)) continue;

            const result = await calResolve(context.resolve,
                context.rootContext,
                component
            );
            json.usingComponents[key] = caclation(context.resourcePath, result);
        }

        code = JSON.stringify(json, null, 2)
    }
    

    callback(null, code);
}

function calResolve(resolveFn, rootContext, request) {
    return new Promise((resolve, rejects) => {
        resolveFn(rootContext, request, (err, result) => {
            if(!err) {
                resolve(result)
            } else {
                rejects(err)
            }
        })
    })
}
function caclation(from, to) {
    return "./" + path.relative(path.dirname(from), to).replace(/\\/g, "/").replace(/\.js$/, '');
}

module.exports = parseJson