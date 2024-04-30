export default {
  state: {
    // 在这里定义应用的初始状态
    userData: {
      userId: null,
      userName: null,
      nickName: null,
    }
  },
  mutations: {
    setUser(state, payload) {
      state.userData = payload;
    },
    // 清除用户信息
    clearUser(state) {
      state.userData = {
        userId: '',
        userName: '',
        nickName: '',
      }
    }
  }
};
