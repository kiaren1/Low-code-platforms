import store from '../vuexStore';

export default {
  mutations: {
    addEvent(state, { event, param }) {
      const curComponent = store.state.curComponent;
      curComponent.events[event] = param;
    },

    removeEvent(state, event) {
      const curComponent = store.state.curComponent;
      delete curComponent.events[event];
    },

    updateEvent(state, { event, param }) {
      const curComponent = store.state.curComponent;
      curComponent.events[event] = param;
    }
  },
}