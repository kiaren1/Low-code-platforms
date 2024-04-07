import { createStore } from 'vuex'
import user from './modules/user.js';
import animation from './modules/animation';
import snapshot from './modules/snapshot.js';
import compose from './modules/compose.js';

export default createStore({
  modules: {
    user,
    animation,
    snapshot,
    compose
  },
  state: { // 存放数据，使用响应式包装
    openLogin: false, // 是否显示登录弹窗
    isDarkMode: true, // 光/暗样式
    editMode: 'edit', // 编辑器模式 edit preview
    canvasStyleData: { // 页面全局数据
      width: 1200,
      height: 740,
      scale: 100,
      color: '#000',
      opacity: 1,
      background: '#fff',
      fontSize: 14,
    },
    isInEdiotr: false, // 是否在编辑器中，用于判断复制、粘贴组件时是否生效，如果在编辑器外，则无视这些操作
    componentData: [], // 画布组件数据
    curComponent: null,
    curComponentIndex: null,
    // 点击画布时是否点中组件，主要用于取消选中组件用。
    // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
    isClickComponent: false,
    rightList: true,
    isMenuRight: false, // 决定功能按钮靠左还是靠右
  },
  mutations: { // 同步修改state内容
    changeLoginWindowState(state, payload) {
      state.openLogin = payload.openLogin;
    },
    changeDarkMode(state, value) {
      state.isDarkMode = value;
    },
    aceSetCanvasData(state, value) {
      state.canvasStyleData = value;
    },
    setMenuIsRight(state, value) {
      state.isMenuRight = value;
    },

    // 通过json设置组件
    aceSetcurComponent(state, value) {
      for (let i = 0; i < state.componentData.length; i++) {
        if (state.componentData[i].id === value.id) {
          state.componentData.splice(i, 1)
        }
      }
      state.componentData.push(value)
      state.curComponent = value
    },

    setClickComponentStatus(state, status) {
      state.isClickComponent = status
    },

    isShowRightList(state) {
      state.rightList = !state.rightList
    },

    toggleDarkMode(state, sateus) {
      state.isDarkMode = sateus
      state.canvasStyleData.background = sateus ? '#817f7f' : '#fff'
      localStorage.setItem('isDarkMode', JSON.stringify(state.isDarkMode))
    },

    setEditMode(state, mode) {
      state.editMode = mode
    },

    setInEditorStatus(state, status) {
      state.isInEdiotr = status
    },

    setCanvasStyle(state, style) {
      state.canvasStyleData = style
    },

    setCurComponent(state, { component, index }) {
      state.curComponent = component
      state.curComponentIndex = index
    },

    setShapeStyle({ curComponent }, { top, left, width, height, rotate }) {
      if (top !== undefined) { curComponent.style.top = Math.round(top) }
      if (left !== undefined) { curComponent.style.left = Math.round(left) }
      if (width) { curComponent.style.width = Math.round(width) }
      if (height) { curComponent.style.height = Math.round(height) }
      if (rotate) { curComponent.style.rotate = Math.round(rotate) }
    },

    setShapeSingleStyle({ curComponent }, { key, value }) {
      curComponent.style[key] = value
    },

    setComponentData(state, componentData = []) {
      state.componentData = componentData;
    },

    addComponent(state, { component, index }) {
      if (index !== undefined) {
        state.componentData.splice(index, 0, component)
      } else {
        state.componentData.push(component)
      }
    },

    deleteComponent(state, index) {
      let compIndex = null;
      if (index === undefined) {
        compIndex = state.curComponentIndex;
      }

      if (index === state.curComponentIndex) {
        state.curComponentIndex = null;
        state.curComponent = null;
      }

      if (/\d/.test(index)) {
        state.componentData.splice(compIndex, 1)
      }
    },
  },
})