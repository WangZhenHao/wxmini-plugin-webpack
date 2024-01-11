var UglifyJS = require("uglify-js");
const code = `/* eslint-disable */
// var style = require('../wxs/style.wxs');

function rootStyle(data) {
  if (!data.color) {
    return data.customStyle;
  }
  debugger
  var properties = {
    color: data.plain ? data.color : '#fff',
    background: data.plain ? null : data.color,
  };

  // hide border when color is linear-gradient
  if (data.color.indexOf('gradient') !== -1) {
    properties.border = 0;
  } else {
    properties['border-color'] = data.color;
  }

  return style([properties, data.customStyle]);
}

function loadingColor(data) {
  if (data.plain) {
    return data.color ? data.color : '#c9c9c9';
  }

  if (data.type === 'default') {
    return '#c9c9c9';
  }

  return '#fff';
}

module.exports = {
  rootStyle: rootStyle,
  loadingColor: loadingColor,
};
`
const result = UglifyJS.minify(code, { compress: false, mangle: false })

console.log(result)