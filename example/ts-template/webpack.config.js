var path = require('path');
var webpackMajorVersion = require('webpack/package.json').version.split('.')[0];
const  MiniProgramPlugin  = require('wxmini-plugin-webpack').plugin

module.exports = {
    // resolve: {
    //   alias: {
    //     'wxmini-plugin-webpack5': path.resolve('../../src/')
    //   }
    // },
    resolve: { extensions: ['.ts', '.js'] },
    context: path.join(__dirname, './src'),
    mode: 'development',
    entry: './app.json',
    devtool: false,
    output: {
        path: path.join(__dirname, 'dist/webpack-' + webpackMajorVersion),
    },
    watch: false,
    target: 'node',
    optimization: {
      runtimeChunk: {
        name: 'runtime',
      },
      splitChunks: {
        minSize: 0,
        cacheGroups: {
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 3,
          },
        },
      },
    },
    resolve: {
      alias: {
        '@components': path.join(__dirname, './src/components'),
        "@page": path.join(__dirname, './src/page'),
        '@common': path.join(__dirname, './src/common'),
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: path.resolve(__dirname, '../node_modules'),
          use: ['ts-loader'],
        },
        {
          test: /\.js$/,
          exclude: path.resolve(__dirname, '../node_modules'),
          use: ['babel-loader'],
        },
        {
          test: /\.less/,
          type: 'asset/resource',
          generator: {
            filename: '[path][name].wxss'
          },
          use: [
            'less-loader'
          ]
        },
        {
          test: /\.wxml$/,
          type: 'asset/resource',
          generator: {
            filename: '[path][name][ext]'
          },
          use: [
            'wxmini-plugin-webpack'
            // {
            //   loader: path.resolve(__dirname, '../../src/index.js'),
            // }
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
            // {
            //   loader: path.resolve(__dirname, '../../src/index.js'),
            // },
          ]
        },
        {
          test: /\.wxs$/,
          type: 'asset/resource',
          generator: {
            filename: '[path][name][ext]'
          },
          use: [
            'wxmini-plugin-webpack'
          ]  
        },
        {
          test: /\.wxss/,
          type: 'asset/resource',
          generator: {
            filename: '[path][name][ext]'
          }
        },
      ]
      },
    plugins: [
        new MiniProgramPlugin()
    ]
}