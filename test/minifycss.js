var CleanCSS = require('clean-css');

// const css = `
// @import "../commont.wxss"
// .test {
//     background: red;
//     font-size: 12rpx;
// }`
const css = "@import '../commont.wxss'; .test{ font-size: 12px; }"

console.log(new CleanCSS({inline: 'none' }).minify(css))