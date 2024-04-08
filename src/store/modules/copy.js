import store from '../vuexStore';
import { message } from 'ant-design-vue';
import generateID from '@/utils/generateID';
import { cloneDeep } from 'lodash';

export default {
  state: {
    copyData: null, // 复制粘贴剪切
    isCut: false,
  },
  mutations: {
    copy(state) {
      if (!store.state.curComponent) {
        message.error('请选择组件')
        return
      }

      // 如果有剪切的数据，需要先还原
      restorePreCutData(state)
      copyData(state)

      state.isCut = false
    },

    paste(state, isMouse) {
      if (!state.copyData) {
        message.error('请选择组件')
        return
      }

      const data = state.copyData.data

      if (isMouse) {
        data.style.top = store.state.contextmenu.menuTop
        data.style.left = store.state.contextmenu.menuLeft
      } else {
        data.style.top += 10
        data.style.left += 10
      }

      store.commit('addComponent', { component: deepCopyHelper(data) })
      if (state.isCut) {
        state.copyData = null
      }
    },

    cut(state) {
      if (!store.state.curComponent) {
        message.error('请选择组件')
        return
      }

      // 如果重复剪切，需要恢复上一次剪切的数据
      restorePreCutData(state)
      copyData(state)

      store.commit('deleteComponent')
      state.isCut = true
    },
  },
}

// 恢复上一次剪切的数据
function restorePreCutData(state) {
  if (state.isCut && state.copyData) {
    const data = cloneDeep(state.copyData.data);
    const index = state.copyData.index;
    store.commit('addComponent', { component: data, index });
    if (store.state.curComponentIndex >= index) {
      // 如果当前组件索引大于等于插入索引，需要加一，因为当前组件往后移了一位
      store.state.curComponentIndex++;
    }
  }
}

function copyData(state) {
  state.copyData = {
    data: cloneDeep(store.state.curComponent),
    index: store.state.curComponentIndex,
  }
}

function deepCopyHelper(data) {
  const result = cloneDeep(data)
  result.id = generateID()
  if (result.component === 'Group') {
    result.propValue.forEach((component, i) => {
      result.propValue[i] = deepCopyHelper(component)
    })
  }

  return result
}
