var CleanCSS = require('clean-css');
var minifyCss = require('../src/lib/clean-css/index.js')

// const css = `
// @import "../commont.wxss"
// .test {
//     background: red;
//     font-size: 12rpx;
// }`
const css = `@import '../commont.wxss'; a .test{ font-size: 12px; } @font-face {
    font-display: auto;
    font-family: vant-icon;
    font-style: normal;
    font-weight: 400;
    src: url(//at.alicdn.com/t/c/font_2553510_kfwma2yq1rs.woff2?t=1694918397022)
            format("woff2"),
        url("//at.alicdn.com/t/c/font_2553510_kfwma2yq1rs.woff?t=1694918397022")
            format("woff");
}
// 测试

/**
 * 测试
 * /
`
// var re = /(\/\/.*\n?)|(\/\*[\s\S]*?\*\/)/g;
// var re2 = /\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g
// function minify(code) {
//     // var result = code
//     //     .replace(/( [^0-9a-zA-Z\\.#])\\s+/g, "$1")
//     //     .replace(/\\s ( [^0-9a-zA-Z\\.#]+)/g, "$1")
//     //     .replace(/;}/g, "}")
//     //     .replace(/\/\*.*?\*\//g, "");
//     const result =  code.replace(re2, '')
//     return result;
// }

// console.log(new CleanCSS({inline: 'none' }).minify(css))
console.log(minifyCss(css))
// console.log(minify(css))