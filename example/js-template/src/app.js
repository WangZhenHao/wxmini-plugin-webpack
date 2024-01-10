import env from '@src/env'

App({
    global: {
      
    },
    onLaunch() {
      // console.log(process.env.BUILD_ENV)
      console.log(env)
    }
  });
  