
const path = require("path");
const { existsSync, readFileSync } = require('fs')
const { SUFFIXLIST, SCRIPTSUFFIX } = require('./constant')

function resoveConfigJson(context) {
    const list = ['project.config.json', 'project.private.config.json', 'sitemap.json'];
    const jsonList = []
    list.forEach(page => {
        const entryJSON = path.join(context, page);
        
        if(existsSync(entryJSON)) {
            jsonList.push(entryJSON)
        }
    })

    return jsonList;
}
function resolveAppJson(appEntry, context) {
    const entryJSON = path.join(context, appEntry);
    // const entryJs =  entryJSON.replace(/\.json/, '.js')
    const appCode = JSON.parse(readFileSync(entryJSON, { encoding: 'utf-8' }));

    const basename = entryJSON.replace(/\.json/, '')
    const entryList = resolvePage([basename], '')

    let subPageList = []

    if(appCode.subPackages) {
        const subList = []
        appCode.subPackages.forEach(item => {
            // const root = item.root.replace(//)
            item.pages.forEach((pageList) => {
                const path =  item.root + '/' +pageList;
                subList.push(path)
            })
        })

        subPageList = resolvePage(subList, context)
    }
    // SUFFIXLIST.forEach((suffix) => {
    //     const filename = basename + suffix
    //     if (existsSync(filename)) {
    //         entryList.push(filename)
    //     }
    // });

    return {
        // entry: {
        //     js: existsSync(entryJs) ? entryJs : null,
        //     json: existsSync(entryJSON) ? entryJSON : null,
        //     css: ''
        // },
        entryList,
        subPageList,
        appCode
    }
}

function resolvePage(pageList, context) {
    const list = [];

    pageList.forEach((page) => {
        SUFFIXLIST.forEach((suffix) => {
            const entry = path.join(context, page + suffix);

            if (existsSync(entry)) {
                list.push(entry);
            }
        });
    });

    return list;
}

function getJsFileRelPath(entry, context) {
    return entry.replace(context, '').replace(SCRIPTSUFFIX, '')
}

module.exports = {
    resolvePage,
    resolveAppJson,
    getJsFileRelPath,
    resoveConfigJson
};
