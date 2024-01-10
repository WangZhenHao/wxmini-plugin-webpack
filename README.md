# wxmini-plugin-webpack

webpack5版本的微信小程序插件,让微信原生小程的开发也能变成工程化。
### 使用
```
npm -i -D wxmini-plugin-webpack
```

[js-template 案例](https://github.com/WangZhenHao/wxmini-plugin-webpack/tree/master/example/js-template)

[ts-template 案例](https://github.com/WangZhenHao/wxmini-plugin-webpack/tree/master/example/ts-template)

### 优势/好处

- 1.可以区分不同的环境变量，dev, production开发环境等等

- 2.无用代码筛检，剔除

- 3.`@import`， `require`， `<wxs src'@src/test.wxs'></wxs>`, `json文件的组件引入` 可以用别名引入，如@src, @common等

- 4.代码体积小，不会像uniapp, Taro，产生大量运行代码

- 5.支持ts，支持es6语法的`import` `export deufalt`

### 注意事项

- 子的`.less`的文件如果引入在父页面的`less`中，会合并到一个文件，`.wxss`文件后缀用`@import`引入的文件，不会合并一个文件

- 只有两个公共js文件，`runtime.js`和`common.js`



### webpack配置
```js
// webpack配置

const  MiniProgramPlugin  = require('wxmini-plugin-webpack').plugin

module.exports = {
    ...,
    ...,
    module: {
      rules: [
        {
          test: /\.wxml$/,
          type: 'asset/resource',
          generator: {
            filename: '[path][name][ext]'
          },
          use: [
            'wxmini-plugin-webpack'
          ]
        },
        {
          test: /\.json/,
          type: 'asset/resource',
          generator: {
            filename: '[path][name][ext]'
          },
          use: [
            'wxmini-plugin-webpack'
          ]
        },
        {
          test: /\.wxs$/,
          type: 'asset/resource',
          generator: {
            filename: '[path][name][ext]'
          },
          use: ['wxmini-plugin-webpack']
        },
        {
          test: /\.wxss/,
          type: 'asset/resource',
          generator: {
            filename: '[path][name][ext]'
          },
          use: ['wxmini-plugin-webpack']
        },
        ...,
        ...,
        ...
      ]
      },
    plugins: [
        new MiniProgramPlugin()
    ],
    ...,
    ...,
    ...
}
```

### To-do 

>代办事项
- [ ] wxss文件代码压缩
- [ ] wxs文件代码压缩
- [ ] 输出打包文件信息
- [ ] 显示打包进度

### 本地调试
```
安装依赖
npm i

// 运行脚本
node example/build-examples.js resolve-template
或者
npm run dev
npm run build
```


### qq讨论群: 475870039