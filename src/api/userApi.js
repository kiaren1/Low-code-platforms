import request from '@utils/request.js';
import { reTryRequest } from '@utils/request.js'
import store from '@store'
const APIS = {
  Login: '/api/user/login',
  Switch: '/api/user/switch',
  Signup: '/api/user/signup',
  UpdateNickName: '/api/user/updatenickname'
}

export default {
  async login(username, password) {
    const user = await request.post(APIS.Login, {
      username, password
    });
    store.commit('setUser', user);
    localStorage.setItem('token', user.token);
    return user;
  },
  async switch() {
    const user = await reTryRequest(4, 
      () => request.get(APIS.Switch),
      (err) => {
        const errRes = err.message;
        if(errRes.data && errRes.data.code === 401){
          return true;
        }
        return false;
      } 
    );
    if (user) {
      store.commit('setUser', user);
    }
    return user;
  },
  async signup(username, password) {
    const user = await request.post(APIS.Signup, {
      username, password
    });
    store.commit('setUser', user);
    localStorage.setItem('token', user.token);
    return user;
  },
  // 退出登录
  logout() {
    localStorage.removeItem('token');
    store.commit('clearUser');
  },
  // 更新昵称
  async updateNickName(nickName) {
    const user = await request.post(APIS.UpdateNickName, {
      nickName,
      userId: store.state.user.userData.userId
    });
    store.commit('setUser', user);
    return user;
  }
}