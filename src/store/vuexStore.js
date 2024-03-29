import { createStore } from 'vuex'
import user from './modules/user.js';

export default createStore({
  modules: {
    user,
  },
  state: { // 存放数据，使用响应式包装
    openLogin: false // 是否显示登录弹窗
  },
  mutations: { // 同步修改state内容
    changeLoginWindowState(state, payload) {
      state.openLogin = payload.openLogin;
    }
  },
})