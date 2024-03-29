import axios from 'axios';
/* eslint-disable-next-line */
import qs from 'qs';
import { message } from 'ant-design-vue';
import store from '../store/vuexStore';

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
    if (res.code) handleResponseError(res.code);
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
