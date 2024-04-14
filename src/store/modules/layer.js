import { swap } from '@/utils/utils'
import { message } from 'ant-design-vue';
import store from '../vuexStore';

export default {
  mutations: {
    upComponent() {
      const { componentData, curComponentIndex } = store.state;
      // 上移图层 index，表示元素在数组中越往后
      if (curComponentIndex < componentData.length - 1) {
        swap(componentData, curComponentIndex, curComponentIndex + 1);
        store.state.curComponentIndex = curComponentIndex + 1;
      } else {
        message.info('已经到顶了');
      }
    },

    downComponent() {
      const { componentData, curComponentIndex } = store.state;
      // 下移图层 index，表示元素在数组中越往前
      if (curComponentIndex > 0) {
        swap(componentData, curComponentIndex, curComponentIndex - 1);
        store.state.curComponentIndex = curComponentIndex - 1;
      } else {
        message.info('已经到底了');
      }
    },

    moveComponent(state, { curIndex, targetIndex }) {
      const { componentData } = store.state;
      if (targetIndex >= 0 && targetIndex < componentData.length) {
        const temp = componentData.splice(curIndex, 1)[0];
        componentData.splice(targetIndex, 0, temp);
      }
      else if (targetIndex < 0) {
        message.info('已经到顶了');
      }
      else if (targetIndex >= componentData.length) {
        message.info('已经到顶了');
      }
    },

    topComponent() {
      const { componentData, curComponentIndex, curComponent } = store.state;
      // 置顶
      if (curComponentIndex < componentData.length - 1) {
        componentData.splice(curComponentIndex, 1);
        componentData.push(curComponent);
        store.state.curComponentIndex = componentData.length - 1;
      } else {
        message.info('已经到顶了');
      }
    },

    bottomComponent() {
      const { componentData, curComponentIndex, curComponent } = store.state;
      // 置底
      if (curComponentIndex > 0) {
        componentData.splice(curComponentIndex, 1);
        componentData.unshift(curComponent);
        store.state.curComponentIndex = 0;
      } else {
        message.info('已经到底了');
      }
    },
  },
}
