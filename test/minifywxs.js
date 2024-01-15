const { readFileSync } = require('fs');
const path = require('path')
const code = readFileSync(path.resolve(__dirname, './test.wxs'), { encoding: "utf8" });

var re = /(\/\/.*\n?)|(\/\*[\s\S]*?\*\/)/g;
// var re2 = //g
const result = code.replace(re, '');
// console.log(code.match(re2))
console.log(result)
