import store from '../vuexStore'
import { cloneDeep } from 'lodash'
// 设置画布默认数据
let defaultcomponentData = []
function getDefaultcomponentData() {
  return cloneDeep(defaultcomponentData);
}
export function setDefaultcomponentData(data = []) {
  defaultcomponentData = data
}
export default {
  state: {
    // 通过每次更新维持一个快照来实现回滚功能
    snapshotData: [], // 编辑器快照数据
    snapshotIndex: -1, // 快照索引
  },
  mutations: {
    undo(state) { // 找到上一步的快照然后回上一步
      if (state.snapshotIndex >= 0) {
        state.snapshotIndex--
        const componentData = cloneDeep(state.snapshotData[state.snapshotIndex]) || getDefaultcomponentData()
        if (store.state.curComponent) {
          // 如果当前组件不在 componentData 中，则置空
          const needClean = !componentData.find((component) => store.state.curComponent.id === component.id)

          if (needClean) {
            store.commit('setCurComponent', {
              component: null,
              index: null,
            })
          }
        }

        store.commit('setComponentData', componentData)
      }
    },
    redo(state) {
      // 反撤销
      if (state.snapshotIndex < state.snapshotData.length - 1) {
        state.snapshotIndex++
        store.commit('setComponentData', cloneDeep(state.snapshotData[state.snapshotIndex]))
      }
    },
    recordSnapshot(state) {
      // 添加新的快照
      state.snapshotData[++state.snapshotIndex] = cloneDeep(store.state.componentData)
      // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
      if (state.snapshotIndex < state.snapshotData.length - 1) {
        state.snapshotData = state.snapshotData.slice(0, state.snapshotIndex + 1)
      }
    },
    setDefaultcomponentData(state, defaultData){
      setDefaultcomponentData(defaultData);
    }
  },
}
