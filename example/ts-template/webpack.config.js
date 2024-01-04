var path = require('path');
var webpackMajorVersion = require('webpack/package.json').version.split('.')[0];
const MiniProgramPlugin = require('../../src/index')
// const html = require('html-webpack-plugin')

const fileLoader = (name) => ({
  loader: 'file-loader',
  options: {
    publicPath: '',
    context: __dirname,
    name,
  },
});
module.exports = {
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
          test: /\.js$/,
          exclude: path.resolve(__dirname, '../../node_modules'),
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
            {
              loader: path.resolve(__dirname, '../../src/loader.js'),
            }
          ]
          // use: [
          //   fileLoader('[path][name].[ext]'),
          //   {
          //     loader: path.resolve(__dirname, '../../src/loader.js'),
          //   },
          // ]
        },
        {
          test: /\.wxs$/,
          type: 'asset/resource',
          generator: {
            filename: '[path][name][ext]'
          }
        },
        {
          test: /\.wxss/,
          type: 'asset/resource',
          generator: {
            filename: '[path][name][ext]'
          }
        },
        {
          test: /\.(png|jpg|gif)$/,
          type: 'asset/resource',
          generator: {
            filename: '[path][name][ext]'
          }
        },
        {
          test: /\.json/,
          type: 'asset/resource',
          generator: {
            filename: '[path][name][ext]'
          },
          use: [
            {
              loader: path.resolve(__dirname, '../../src/loader.js'),
            },
          ]
        }
      ]
      },
    plugins: [
        new MiniProgramPlugin(),
        // new html({
        //   template: './test.html'
        // })
    ]
}