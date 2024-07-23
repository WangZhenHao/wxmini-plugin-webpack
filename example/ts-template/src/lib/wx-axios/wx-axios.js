(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.WxAxois = factory());
}(this, (function () { 'use strict';

  function cancelToken(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    var token = this;
    executor(function calcel(message) {
      if (token.reason) {
        return;
      }

      token.reason = 'calcel ' + message;
      resolvePromise(token.reason);
    });
  }

  cancelToken.source = function () {
    var cancel;
    var token = new cancelToken(function (c) {
      cancel = c;
    });
    return {
      token: token,
      cancel: cancel
    };
  };

  var cancelToken_1 = cancelToken;

  function mergeConfig(config1, config2) {
    return Object.assign(config1, config2);
  }

  var mergeConfig_1 = mergeConfig;

  function validateStatus(status) {
    return status >= 200 && status < 300;
  }

  function settle(resolve, reject, responce) {
    if (validateStatus(responce.statusCode)) {
      resolve(responce);
    } else {
      reject(responce);
    }
  }

  var settle_1 = settle;

  function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  }

  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
  }

  function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }

    return requestedURL;
  }
  var buildFullPath_1 = buildFullPath;

  function dispatchRequest(config) {
    var url = config.url,
        data = config.data,
        header = config.header,
        timeout = config.timeout,
        method = config.method,
        dataType = config.dataType,
        responseType = config.responseType,
        cancelToken = config.cancelToken,
        baseURL = config.baseURL;
    url = buildFullPath_1(baseURL, url);
    return new Promise(function (resolve, reject) {
      var request = wx.request({
        url: url,
        data: data,
        header: header,
        timeout: timeout,
        method: method,
        dataType: dataType,
        responseType: responseType,
        success: function success(response) {
          response.config = config;
          settle_1(resolve, reject, response);
        },
        fail: function fail(reason) {
          reject(reason);
        }
      });

      if (cancelToken) {
        cancelToken.promise.then(function onCanceled(cancel) {
          if (!request) {
            return;
          }

          request.abort();
          reject(cancel);
          request = null;
        });
      }
    });
  }

  var dispatchRequest_1 = dispatchRequest;

  function InterceptorManager() {
    this.handlers = [];
  }

  InterceptorManager.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected
    });
    return this.handlers.length - 1;
  };

  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };

  InterceptorManager.prototype.forEach = function (fn) {
    this.handlers.forEach(function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };

  var interceptorManager = InterceptorManager;

  var methods = ['get', 'post', 'put'];

  function wxAxios(instanceConfig) {
    // this.defaults = mergeConfig(defaults, instanceConfig);
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new interceptorManager(),
      response: new interceptorManager()
    };
  }

  wxAxios.prototype = {
    request: function request() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      config = mergeConfig_1(this.defaults, config); // debugger

      if (!config.method) {
        config.method = 'get';
      }

      config.method = config.method.toLowerCase();
      var chain = [dispatchRequest_1, null];
      var promise = Promise.resolve(config);
      this.interceptors.request.forEach(function unshfitRequsetInterceptors(intercetpor) {
        chain.unshift(intercetpor.fulfilled, intercetpor.rejected);
      });
      this.interceptors.response.forEach(function pushResponseInterceptors(intercetpor) {
        chain.push(intercetpor.fulfilled, intercetpor.rejected);
      });

      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }

      return promise;
    }
  };
  methods.forEach(function (method) {
    wxAxios.prototype[method] = function (url, data, config) {
      return this.request(mergeConfig_1(config || {}, {
        url: url,
        data: data,
        method: method
      }));
    };
  });
  var wxAxios_1 = wxAxios;

  var defaults = {
    timeout: 0,
    header: {
      'content-type': 'application/json'
    },
    method: 'GET'
  };
  var defaults_1 = defaults;

  function extend(to, form) {
    for (var i in form) {
      to[i] = form[i];
    }

    return to;
  }

  var utils = {
    extend: extend
  };

  var extend$1 = utils.extend; // wxAios.cancelToken = cancelToken

  function createInstance(config) {
    var context = new wxAxios_1(config);
    var instance = wxAxios_1.prototype.request.bind(context);
    extend$1(instance, context);
    return instance;
  }

  var axios = createInstance(defaults_1);

  axios.create = function create(config) {
    return createInstance(Object.assign(defaults_1, config));
  };

  axios.cancelToken = cancelToken_1; // console.log(createInstance())

  var src = axios;

  return src;

})));
