const parseJson = require('./loader/parse-json')
const parseWxml = require('./loader/parse-wxml');

const { JSONSUFFIX, WXMLSUFFIX } = require('./helpers/constant')



function loader(code) {
    const callback = this.async()
    if(JSONSUFFIX.test(this.resourcePath)) {
        parseJson(this, code, callback)
    } else if(WXMLSUFFIX.test(this.resourcePath)) {
        parseWxml(this, code, callback)
    } else {
        callback(null, code);
    }
}


module.exports = loader;
