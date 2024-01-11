import env from '@src/env'
import axios from './utils/request';


App({
    global: {
      env: env
    },
    onLaunch() {
      wx.$axios = axios;
      // console.log(process.env.BUILD_ENV)
    }
  });
  