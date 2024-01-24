const { dirname } = require('path')
const { readFileSync } = require('fs')

async function resolveComponent(resolver, context, component) {
    component = component + ".json";
    // 获取自定义组件的绝对路径
    return await resolver(context, component);
}

function forEachUsingComponent(usingComponents, fn) {
    let ps = [];

    for (const key in usingComponents || {}) {
        let element = usingComponents[key];

        ps.push(fn(key, element));
    }

    return ps;
}


function forEachUsingPage(pages, fn) {
    let ps = [];

    for (const key in pages || {}) {
        let element = pages[key];

        ps.push(fn(key, element));
    }

    return ps;
}

function forEachUsingSubPage(pages, fn) {
    let ps = [];

    for (const key in pages || {}) {
        let element = pages[key];
        element.pages.forEach(page => {
            const subPage = element.root + page;

            ps.push(fn(subPage, subPage));
        })
        
    }

    return ps;
}

async function resolveComponentsPath(resolver, request) {
    let content = {};

    try {
        content = JSON.parse(readFileSync(request, { encoding: "utf8" }));
    } catch (error) {
        console.log(error);
    }

    const context = dirname(request);
    const components = new Map();
    const { pages, usingComponents, subPackages } = content;

    if (!usingComponents && !pages && !subPackages)
        return components;

    /**
     * 自定义组件
     */
    let normalPromises = forEachUsingComponent(
        usingComponents,
        async (key, item) => {
            if (
                /^plugin:\/\//.test(item) ||
                /^plugin-private:\/\//.test(item)
            ) {
                components.set(key, {
                    request,
                    origin: item,
                    absPath: item,
                    type: "plugin",
                });
                return;
            }
            let component = await resolveComponent(resolver, context, item);

            components.set(key, {
                request,
                origin: item,
                absPath: component,
                type: "normal",
            });
        }
    );

    let noramlPages = forEachUsingPage(pages, async (key, item) => {
        item = "./" + item;
        let component = await resolveComponent(resolver, context, item);
        components.set(key, {
            request,
            origin: item,
            absPath: component,
            type: "normal",
        });
    })

    let noramlSubPage = forEachUsingSubPage(subPackages, async (key, item) => {
        item = "./" + item;
        let component = await resolveComponent(resolver, context, item);
        components.set(key, {
            request,
            origin: item,
            absPath: component,
            type: "normal",
        });
    })

    /**
     * 插件组件处理和普通插件处理一样
     */
    // let pluginPromises = forEachUsingComponent(
    //     publicComponents,
    //     async (key, item) => {
    //         let component = await resolveComponent(resolver, context, item);
    //         components.set(key, {
    //             request,
    //             origin: item,
    //             absPath: component,
    //             type: "normal",
    //         });
    //     }
    // );

    // /**
    //  * 抽象组件
    //  */
    // let genericesPromises = forEachComponentGenerics(
    //     componentGenerics,
    //     async (key, element) => {
    //         if (componentGenerics[element] === true) {
    //             return components.set(element, {
    //                 request,
    //                 origin: "",
    //                 absPath: "",
    //                 type: "generics",
    //             });
    //         }
    //         let relPath = componentGenerics[element].default;
    //         let component = await resolveComponent(resolver, context, relPath);
    //         components.set(element, {
    //             request,
    //             origin: relPath,
    //             absPath: component,
    //             type: "generics",
    //         });
    //     }
    // );

    await Promise.all([
        ...normalPromises,
        ...noramlPages,
        ...noramlSubPage
        // ...pluginPromises,
        // ...genericesPromises,
    ]);

    return components;
}

async function resolveComponentsFiles(
    jsons,
    componentSet,
    resolver
) {
    let nextJsons = [];
    for (const json of jsons) {
        // if (emptyComponent && emptyComponent.test(json)) {
        //     continue; // 对于需要处理为空组件的不再加载其子组件
        // }

        let components = await resolveComponentsPath(resolver, json);

        for (const [key, component] of components) {
            componentSet.add({ tag: key, component });
            if (component.type === "normal") {
                nextJsons.push(component.absPath);
            }
        }
    }

    nextJsons.length &&
        (await resolveComponentsFiles(
            nextJsons,
            componentSet,
            resolver,
            // emptyComponent
        ));
}

module.exports = {
    resolveComponentsFiles,
};
