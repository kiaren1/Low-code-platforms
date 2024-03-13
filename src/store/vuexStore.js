import { createStore } from 'vuex'
import user from './modules/user.js';

export default createStore({
  modules: {
    user,
  },
  state: { // 存放数据，使用响应式包装

  },
  mutations: { // 同步修改state内容

  },
})