const test = require('./lib/test2')
const a = require('./lib/test')

App({
    global: {
      
    },
    onLaunch() {
      console.log(test)
      console.log(a)
    }
  });
  