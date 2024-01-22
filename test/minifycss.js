var CleanCSS = require('clean-css');
var minifyCss = require('../src/lib/clean-css/index.js')
const fs = require('fs');
const path = require('path')

// const css = `
// @import "../commont.wxss"
// .test {
//     background: red;
//     font-size: 12rpx;
// }`
const test = `@import '../commont.wxss'; a .test{ font-size: 12rpx; } @font-face {
    font-display: auto;
    font-family: vant-icon;
    font-style: normal;
    font-weight: 400;
    src: url(//at.alicdn.com/t/c/font_2553510_kfwma2yq1rs.woff2?t=1694918397022)
            format("woff2"),
        url("//at.alicdn.com/t/c/font_2553510_kfwma2yq1rs.woff?t=1694918397022")
            format("woff"); // 测试
}
// 测试

/**
 * 测试
 * /
`

var test2 = `


/*
  .tes3 { 
    color: pink;
  }
*/

.test1 {
    // counter-reset: 1;
    background: url('//www.baidu.com/1.png');
    color: red; // test
    /* background:red; */
}

/* .test {
    background: url('//www.baidu.com/1.png')
} */
`
const res = minifyCss(test2);
console.log(res)
fs.writeFile(path.resolve(__dirname, './minfi.css'), res.styles, function(err) {
    if(err) {
        return console.log(err);
    }
    // console.log("The file was saved!");
}); 

// console.log(new CleanCSS({}).minify(test2))