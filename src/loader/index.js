const parseJson = require('./parse-json')
const parseWxml = require('./parse-wxml');
const parseWxss = require('./parse-wxss')

const { JSONSUFFIX, WXMLSUFFIX, WXSSSUFFIX } = require('../helpers/constant')



function loader(code) {
    const callback = this.async()
    if(JSONSUFFIX.test(this.resourcePath)) {
        parseJson(this, code, callback)
    } else if(WXMLSUFFIX.test(this.resourcePath)) {
        parseWxml(this, code, callback)
    } else if(WXSSSUFFIX.test(this.resourcePath)) {
        parseWxss(this, code, callback)
    } else {
        callback(null, code);
    }
}


module.exports = loader;
