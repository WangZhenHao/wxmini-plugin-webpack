// const test = require('./lib/test2')
// const a = require('./lib/test.js')
import tools from '@src/utils/tools.js'

App({
    global: {
      
    },
    onLaunch() {
      wx.$tools = tools
      console.log(wx.$tools)
    }
  });
  