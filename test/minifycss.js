var CleanCSS = require('clean-css');

// const css = `
// @import "../commont.wxss"
// .test {
//     background: red;
//     font-size: 12rpx;
// }`
const css = "@import '../commont.wxss'; .test{ font-size: 12px; }"

function minify(code) {
    var result = code
        .replace(/( [^0-9a-zA-Z\\.#])\\s+/g, "$1")
        .replace(/\\s ( [^0-9a-zA-Z\\.#]+)/g, "$1")
        .replace(/;}/g, "}")
        .replace(/\/\*.*?\*\//g, "");

    return result;
}

// console.log(new CleanCSS({inline: 'none' }).minify(css))
console.log(minify(css))