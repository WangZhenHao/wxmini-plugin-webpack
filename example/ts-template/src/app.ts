// const test = require('./lib/test2')
const a = require('./lib/test.js')

let b: { name?: string } = {}

App({
    global: {
      
    },
    onLaunch() {
      console.log(wx)
      console.log(a)
      b.name = '12'
    }
  });
  