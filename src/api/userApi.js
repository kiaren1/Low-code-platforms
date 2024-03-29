import request from '@utils/request.js';
import store from '@store'
const APIS = {
  Login: '/api/user/login',
  Switch: '/api/user/switch',
  Signup: '/api/user/signup'
}

export default {
  async login(username, password) {
    const user = await request.post(APIS.Login, {
      username, password
    });
    store.commit('setUser', user);
    return user;
  },
  async switch() {
    const user = await request.get(APIS.Switch);
    store.commit('setUser', user);
    return user;
  },
  async signup(username, password) {
    const user = await request.post(APIS.Signup, {
      username, password
    });
    store.commit('setUser', user);
    return user;
  },
  // 退出登录
  logout() {
    document.cookie = "token=";
    store.commit('clearUser')
  }
}