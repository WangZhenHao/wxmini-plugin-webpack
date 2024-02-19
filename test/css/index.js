var CleanCSS = require('clean-css');
var minifyCss = require('../../src/lib/clean-css/index.js')
const fs = require('fs');
const path = require('path')

const testStr = fs.readFileSync(path.resolve(__dirname, './origin.css'), { encoding: 'utf-8' })
const res = minifyCss(testStr);
console.log(res)
fs.writeFile(path.resolve(__dirname, './minify.css'), res.styles, function(err) {
    if(err) {
        return console.log(err);
    }
}); 

// console.log(new CleanCSS({}).minify(testStr))