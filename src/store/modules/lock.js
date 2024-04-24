import store from '../vuexStore';

export default {
  mutations: {
    lock() {
      const curComponent = store.state.curComponent;
      curComponent.isLock = true
    },

    unlock() {
      const curComponent = store.state.curComponent;
      curComponent.isLock = false
    },
  },
}