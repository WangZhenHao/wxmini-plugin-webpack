const { existsSync } = require('fs')
const path = require('path')

function isSuffixFile(entry) {
    return existsSync(entry)
}

function relativePath(from, to) {
    return path.relative(path.dirname(from), to).replace(/\\/g, "/")
}

module.exports = {
    isSuffixFile,
    relativePath
}