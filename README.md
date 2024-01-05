# wxmini-plugin-webpack

webpack5版本的微信小程序插件,让微信原生小程的开发也能变成工程化。
### 使用
```
npm -i -D wxmini-plugin-webpack
```

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
        }
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

### 本地运行
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