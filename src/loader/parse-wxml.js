const path = require("path");
const {
    LOADER_ACCEPT_FILE_EXTS,
    RELATIVEPATH,
} = require("../helpers/constant");
const { relativePath } = require("../helpers/utils");
const isInvaildExt = (ext) => LOADER_ACCEPT_FILE_EXTS.indexOf(ext) === -1;
const wxmlDepsReg = /src=('|")([^"]*)('|")/g;
const minify = require("html-minifier").minify;

async function parseWxml(context, source, callback) {
    let matched = null;
    const promiseModule = [];

    source = minify(source, {
        removeComments: true,
        collapseWhitespace: true,
        keepClosingSlash: true,
    });

    while ((matched = wxmlDepsReg.exec(source)) !== null) {
        let dep = matched[2];
        let ext = path.extname(dep);
        // let result = ''

        if (isInvaildExt(ext)) {
            continue;
        }

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
}

function addModule(loadModule, filePath) {
    return new Promise((resolve, reject) => {
        loadModule(filePath, (err, source, sourceMap, module) => {
            if (!err) return resolve({ source, filePath });

            reject(err);
        });
    });
}

function calResolve(resolveFn, rootContext, request) {
    return new Promise((resolve, rejects) => {
        resolveFn(rootContext, request, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                rejects(err);
            }
        });
    });
}

module.exports = parseWxml;
