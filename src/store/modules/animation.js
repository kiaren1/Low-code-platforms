import store from '../vuexStore';

export default {
  mutations: {
    addAnimation(state, animation) {
      const curComponent = store.state.curComponent;
      curComponent.animations.push(animation)
    },

    removeAnimation(state, index) {
      const curComponent = store.state.curComponent;
      curComponent.animations.splice(index, 1)
    },

    alterAnimation(state, { index, data = {} }) {
      const curComponent = store.state.curComponent;
      if (typeof index === 'number') {
        const original = curComponent.animations[index]
        curComponent.animations[index] = { ...original, ...data }
      }
    },
  },
}