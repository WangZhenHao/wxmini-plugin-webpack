const EntryPlugin = require("webpack/lib/EntryPlugin");
const path = require("path");
const { createResolver } = require("../helpers/create-resolver");
const {
    resolvePage,
    resolveAppJson,
    getJsFileRelPath,
    resoveConfigJson
} = require("../helpers/resolve-page");
const { CHUNKNAME, SCRIPTSUFFIX, JSONSUFFIX } = require("../helpers/constant");
const { resolveComponentsFiles } = require("../helpers/resolve-component-path");

module.exports = class FileEntryPlugin {
    constructor() {
        this.compiler = "";
        this.context = "";
        this.chunNameIndex = 0;
        this.chunkNames = ["main.js"];
        this.isFirstCompile = true;
        // this._row = {};
        this.chunkMap = new Map();
        this.entryList = []
    }

    apply(compiler) {
        this.compiler = compiler;
        this.resolver = createResolver(compiler);

        this.compiler.hooks.entryOption.tap(
            "FileEntryPlugin",
            this.entryOption.bind(this)
        );
        compiler.hooks.beforeCompile.tapAsync(
            "FileEntryPlugin",
            this.beforeCompile.bind(this)
        );
        // this.compiler.hooks.compilation.tap('FileEntryPlugin', this.setCompilation.bind(this))
        this.compiler.hooks.watchRun.tapAsync(
            "FileEntryPlugin",
            this.fileChange.bind(this)
        );

        this.compiler.hooks.emit.tap('FileEntryPlugin', this.setEmitHook.bind(this))
    }

    entryOption(context, entry) {
        this.context = context;
        this.entry = entry;

        this.start();
    }

    start() {
        return new Promise((resolve, reject) => {
            const appJson = resolveAppJson(
                this.entry["main"]["import"][0],
                this.context
            );
    

            if(appJson.entryList.length !== 3) {
                throw new Error("必须要有三个app入口文件");
            }

            // this._row[appJson.entry.json] = true;
            
            const entryList = resolvePage(appJson.appCode.pages, this.context);
            const configJosnEntryList = resoveConfigJson(this.context)
            this.entryList = [...appJson.entryList, ...entryList, ...configJosnEntryList];
    
            this.reolveEntry(this.entryList);

            resolve()
        })
       

    }
    setEmitHook() {
        if(this.isFirstCompile) {
            this.isFirstCompile = false;
        }
    }
    beforeCompile(prarams, callback) {
        if(!this.isFirstCompile) {
            callback()
            return
        };

        const jsonList = this.entryList.filter(page => JSONSUFFIX.test(page))

        this.loadJsonFiles(jsonList).then(() => callback())
    }

    reolveEntry(list) {
        if (!list.length) return;

        list.forEach((entry) => {
            if (SCRIPTSUFFIX.test(entry)) {
                this.addEntry(entry, getJsFileRelPath(entry, this.context));
            } else {
                this.addEntry(entry);
            }
        });
    }

    fileChange(compiler, callback) {
        if (compiler.modifiedFiles) {
            const jsonList = []
            compiler.modifiedFiles.forEach((entry) => {
                if (JSONSUFFIX.test(entry)) {
                    jsonList.push(entry)
                }
            });
            
            this.loadJsonFiles(jsonList).then(() => callback())
        } else {
            callback();
        }

        
    }
    

    loadJsonFiles(json) {
        const componentSet = new Set();

        return resolveComponentsFiles(json, componentSet, this.resolver).then(() => {
            const pageList = [];
            componentSet.forEach((item) => {
                const page = resolvePage(
                    [item.component.absPath.replace(JSONSUFFIX, "")],
                    ""
                );
                pageList.push(...page);
            });

            this.reolveEntry(pageList);

            return pageList
        });
    }

    addEntry(entry, name) {
        if (!this.chunkMap.get(entry)) {
            const tips = name ? name : CHUNKNAME + this.chunNameIndex;
            this.chunkMap.set(entry, tips);

            new EntryPlugin(this.context, entry, {
                name: tips,
            }).apply(this.compiler);

            this.chunkNames.push(CHUNKNAME + this.chunNameIndex + ".js");
            this.chunNameIndex++;
        }
    }
};
