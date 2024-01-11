import wxAxios from "@src/lib/wx-axios/wx-axios";
import env from '@src/env'

const axios = wxAxios.create({
    timeout: 1500,
    header: {
      'my-hearder': '1111'
    },
    baseURL: env.apiHost
  });


  export default axios