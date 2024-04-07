import axios from 'axios';
/* eslint-disable-next-line */
import qs from 'qs';
import { message } from 'ant-design-vue';
import store from '@store';

axios.defaults.withCredentials = true;

const request = axios.create();

request.interceptors.request.use((config) => {
  // request 封装request
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  if (config.method === 'post') {
    if (config.contentType === 'application/x-www-form-urlencoded') {
      config.headers['content-type'] = 'application/x-www-form-urlencoded';
      config.data = qs.stringify(config.data);
    } else {
      config.headers['content-type'] = 'application/json';
    }
  }
  return config;
}, (error) => {
  // response 错误处理
  message.error({
    content: '请求异常',
    duration: 2,
  })
  return Promise.reject(error);
});

// response 拦截
request.interceptors.response.use((response) => {
  // 处理response data
  const res = response.data;
  if (res.code === undefined || res.code !== 200) {
    res.msg = res.msg || res.message || res.errmsg || '服务异常';
    message.error({
      content: res.msg,
      duration: 2,
    })
    if (res.code) { handleResponseError(res.code); }
    return Promise.reject(res);
  }
  return res.data !== undefined ? res.data : response;
}, (error) => {
  // response 错误处理
  message.error({
    content: '请求异常',
    duration: 4,
  })
  return Promise.reject(error);
});

function handleResponseError(code) {
  switch (code) {
    case 102: // 未登录
      store.commit('changeLoginWindowState', { openLogin: true });
      break;
  }
}

export default request;


// 测试是否是url的正则
export const urlRE = /(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;
function getURLParam(data) {
  let result = ''
  data.forEach((item) => {
    if (item[0]) {
      result += `&${item[0]}=${item[1]}`
    }
  })

  return result ? '?' + result : ''
}

function getURLData(data, paramType) {
  if (!data) { return '' }

  if (paramType === 'array') {
    return data
  }

  const result = {}
  data.forEach((item) => {
    if (item[0]) {
      result[item[0]] = item[1]
    }
  })

  return result
}

export function getURL(url) {
  return url.startsWith('http') ? url : 'https://' + url
}

function doRequest(options) {
  const url = getURL(options.url);
  if (url && options.method === 'GET') {
    return request.get(url, getURLParam(options.data));
  } else {
    return request.post(url, getURLParam(options.data));
  }
}
/**
 *
 * @param {object} options 请求的相关参数
 * @param {object} obj 需要修改的数据的父对象
 * @param {string} key 需要修改的数据在父对象中对应的 key
 * @param {string} responseType 需要修改的数据对应的类型
 * @returns {function} 可以取消请求的函数
 */
export function requestWarpper(options, obj, key, responseType = 'object') {
  let count = 0
  let timer = null
  const url = options?.url
  if (url && !/^\d+$/.test(url) || urlRE.test(getURL(url))) {
    if (!options.series) {
      doRequest(options)
        .then((data) => {
          if (responseType === 'object' || responseType === 'array') {
            obj[key] = JSON.parse(data)
          } else {
            obj[key] = data
          }
        })
        .catch((err) => message.error(err?.message || err))
    } else {
      timer = setInterval(() => {
        if (options.requestCount !== 0 && options.requestCount <= count) {
          clearInterval(timer)
          return
        }

        count++
        doRequest(options)
          .then((data) => {
            if (responseType === 'object' || responseType === 'array') {
              obj[key] = JSON.parse(data)
            } else {
              obj[key] = data
            }
          })
          .catch((err) => message.error(err?.message || err))
      }, options.time)
    }
  }

  return function cancelRequest() {
    clearInterval(timer)
  }
}
