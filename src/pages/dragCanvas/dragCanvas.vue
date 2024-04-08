<template>
  <div :class="!isDarkMode? 'home' : 'home dark'">
    <Toolbar />
    <main>
      <!-- 左侧组件列表 -->
      <section :class="leftList ? 'left active' : 'left inactive'">
        <!-- <ComponentList />
        <RealTimeComponentList /> -->
      </section>
      <a-button
        title="show-list-btn"
        class="btn show-list left-btn"
        @click="isShowLeft"
      >
        <template #icon>
          <CaretLeftOutlined v-if="leftList" :style="{fontSize: '1.15em'}" />
          <CaretRightOutlined v-else :style="{fontSize: '1.15em'}" />
        </template>
      </a-button>

      <!-- 中间画布 -->
      <section class="center" :style="rightList ? 'margin-right:288px' : 'margin-right:10px'">
        <div
          class="content"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @mousedown="handleMouseDown"
          @mouseup="deselectCurComponent"
        >
          <Editor />
        </div>
      </section>

      <!-- 右侧属性列表 -->
      <section :class="rightList ? 'right active' : 'right inactive'">
        <!-- <el-tabs v-if="curComponent" v-model="activeName">
          <el-tab-pane label="属性" name="attr">
            <component :is="curComponent.component + 'Attr'" />
          </el-tab-pane>
          <el-tab-pane label="动画" name="animation" style="padding-top: 20px;">
            <AnimationList />
          </el-tab-pane>
          <el-tab-pane label="事件" name="events" style="padding-top: 20px;">
            <EventList />
          </el-tab-pane>
        </el-tabs>
        <CanvasAttr v-else></CanvasAttr> -->
      </section>
      <a-button
        title="show-list-btn"
        class="btn show-list right-btn"
        @click="isShowRight"
      >
        <template #icon>
          <CaretRightOutlined v-if="rightList" :style="{fontSize: '1.15em'}" />
          <CaretLeftOutlined v-else :style="{fontSize: '1.15em'}" />
        </template>
      </a-button>
    </main>
  </div>
</template>

<script setup>
import Editor from './components/Editor/index.vue';
import Toolbar from "./components/Toolbar.vue";
import { useStore } from 'vuex';
import { computed, onMounted, ref, watch } from "vue";
import { listenGlobalKeyDown } from '@/utils/shortcutKey'
import { cloneDeep } from 'lodash';
import {
  CaretLeftOutlined,
  CaretRightOutlined
} from '@ant-design/icons-vue';
const store = useStore();

const leftList = ref(true);
const activeName = ref('attr');
const reSelectAnimateIndex = ref(undefined);

const isDarkMode = computed(() => store.state.isDarkMode);
const componentData = computed(() => store.state.componentData);
const curComponent = computed(() => store.state.curComponent);
const isClickComponent = computed(() => store.state.isClickComponent);
const canvasStyleData = computed(() => store.state.canvasStyleData);
const editor = computed(() => store.state.compose.editor);
const rightList = computed(() => store.state.rightList);

onMounted(() => {
  restore()
  // 全局监听按键事件（实现快捷键）
  listenGlobalKeyDown();
  const savedMode = localStorage.getItem('isDarkMode');
  if (savedMode !== null) {
    store.commit('toggleDarkMode', JSON.parse(savedMode));
  } else {
    store.isDarkMode = false
  }
});

function restore() {
  // 用保存的数据恢复画布
  console.log('restore');
  const JSONDATA = `[{"animations":[],"events":{},"groupStyle":{},"isLock":false,"collapseName":"style","linkage":{"duration":0,"data":[{"id":"","label":"","event":"","style":[{"key":"","value":""}]}]},"component":"SVGTriangle","label":"三角形","icon":"xingzhuang-sanjiaoxing","propValue":"","style":{"rotate":0,"opacity":1,"width":80,"height":80,"fontSize":"","fontWeight":400,"lineHeight":"","letterSpacing":0,"textAlign":"center","color":"","borderColor":"#000","backgroundColor":"rgba(255,255,255,1)","top":288,"left":578},"id":"VpbUirBrhzw6N0NeVdI_u"},{"animations":[],"events":{},"groupStyle":{},"isLock":false,"collapseName":"style","linkage":{"duration":0,"data":[{"id":"","label":"","event":"","style":[{"key":"","value":""}]}]},"component":"VText","label":"文字","propValue":"双击编辑文字","icon":"wenben","request":{"method":"GET","data":[],"url":"","series":false,"time":1000,"paramType":"","requestCount":0},"style":{"rotate":0,"opacity":1,"width":200,"height":28,"fontSize":"","fontWeight":400,"lineHeight":"","letterSpacing":0,"textAlign":"","color":"","top":235,"left":518},"id":"7KWIzsJKje2-_88kUp0cT"}]`
  store.commit('setComponentData', JSON.parse(JSONDATA))
  // if (localStorage.getItem('canvasData')) {
  //   setDefaultcomponentData(JSON.parse(localStorage.getItem('canvasData')))
  //   store.commit('setComponentData', JSON.parse(localStorage.getItem('canvasData')))
  // }

  // if (localStorage.getItem('canvasStyle')) {
  //   store.commit('setCanvasStyle', JSON.parse(localStorage.getItem('canvasStyle')))
  // }
}

function isShowLeft(){
  leftList.value = !leftList.value;
}
function isShowRight(){
  rightList.value = !rightList.value;
}
watch(rightList, (value) => {
  store.commit('setMenuIsRight', !value);
});

function handleDrop(e) {
  // e.preventDefault()
  // e.stopPropagation()

  // const index = e.dataTransfer.getData('index');
  // const rectInfo = editor.value.getBoundingClientRect();
  // if (index) {
  //   const component = cloneDeep(componentList[index]);
  //   component.style.top = e.clientY - rectInfo.y;
  //   component.style.left = e.clientX - rectInfo.x;
  //   component.id = generateID();

  //   // 根据画面比例修改组件样式比例
  //   changeComponentSizeWithScale(component);

  //   store.commit('addComponent', { component });
  //   store.commit('recordSnapshot');
  // }
}

function  handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
}

function  handleMouseDown(e) {
  e.stopPropagation();
  store.commit('setClickComponentStatus', false);
  store.commit('setInEditorStatus', true);
}

// 未选中组件时处理
function deselectCurComponent(e) {
  if (!isClickComponent.value) {
    store.commit('setCurComponent', { component: null, index: null })
  }

  // 0 左击 1 滚轮 2 右击
  if (e.button !== 2) {
    store.commit('hideContextMenu')
  }
}

</script>

<style lang="less">
.home {
  height: 100vh;
  background: var(--main-bg-color);

  main {
    height: calc(100% - 64px);
    position: relative;
    background: var(--secondary-bg-color);

    .show-list {
      position: absolute;
      z-index: 9;
      top: 40%;
      transition: all .3s;
    }
    .left-btn,
    .right-btn {
      background: var(--main-bg-color);
      color: var(--button-text-color);
      border: 1px;
      height: auto;
      width: fit-content;
    }

    .left-btn {
      margin-left: 200px;
      border-radius: 0 50% 50% 0;
      padding: 7px 7px 7px 0px;
    }

    .right-btn {
      right: 0;
      margin-right: 288px;
      border-radius: 50% 0 0 50%;
      padding: 7px 0px 7px 7px;
    }

    .left,
    .right {
      position: absolute;
      height: 100%;
      top: 0;
      transition: all .3s;
      background: var(--main-bg-color);
      color: var(--text-color);
    }

    .left {
      width: 200px;
      left: 0;

      .real-time-component-list .list:hover {
        color: var(--text-color);
      }

      .real-time-component-list .actived.list {
        color: var(--actived-text-color);
        background-color: var(--actived-bg-color);
      }

      .real-time-component-list .list {
        color: var(--text-color);
      }

      & > div {
        overflow: auto;

        &:first-child {
            border-bottom: 1px solid var(--border-color);
        }
      }
    }

    .center {
      margin: 0 288px 0 200px;
      background: var(--secondary-bg-color);
      height: 100%;
      overflow: auto;
      padding: 20px;
      transition: all .3s;
    }

    .placeholder {
      text-align: center;
      color: var(--placeholder-text-color);
    }

    .left.inactive {
      width: 10px;
      overflow: hidden;

      div {
        opacity: 0;
      }
    }

    .left.inactive ~ .center,
    .left.inactive ~ .btn.left-btn {
      margin-left: 10px;
    }

    .right {
      position: absolute;
      height: 100%;
      width: 288px;
      right: 0;
      top: 0;
      transition: all .3s;
      background-color: var(--main-bg-color);

      .el-select {
        width: 100%;
      }

      .el-form-item__label {
        color: var(--text-color);
      }

      .el-tabs__item.is-top {
        color: var(--text-color);

        &.is-active {
          color: var(--actived-text-color);
        }
      }

      .el-input__inner {
        background-color: var(--placeholder-bg-color);
        color: var(--text-color);
        border-color: var(--border-color);
      }

      textarea.el-textarea__inner {
        background-color: var(--placeholder-bg-color);
        color: var(--text-color);
      }

      .el-select-dropdown__item {
        color: var(--text-color);
      }

      .linkage-container .linkage-component {
        border-color: var(--border-color);

        .div-guanbi {
          color: var(--border-color);
          border-color: var(--border-color);
        }
      }
    }

    .right.inactive {
      width: 10px;
      overflow: hidden;

      div {
        opacity: 0;
      }
    }

    .right.inactive ~ .btn.right-btn {
        margin-right: 10px;
    }

    .center {
      margin-left: 200px;
      margin-right: 288px;
      background: var(--secondary-bg-color);
      height: 100%;
      overflow: auto;
      padding: 20px;
      transition: all .3s;

      .content {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  }

  .placeholder {
      text-align: center;
      color: var(--placeholder-text-color);
  }

  .global-attr {
    padding: 10px;
  }

  .el-collapse {
    border-color: var(--border-color);
  }

  .el-collapse-item__header,
  .el-collapse-item__wrap {
    border-color: var(--border-color);
    background-color: var(--main-bg-color);
    color: var(--text-color);
  }

  .el-collapse-item__header.is-active {
    border-bottom-color: transparent !important;
  }

  .el-tabs__item {
    color: var(--text-color);
  }

  .animation-list {
    .el-tabs.el-tabs--top {
      background-color: var(--main-bg-color);
    }

    .el-scrollbar__view {
      margin-top: 30px;
    }
  }

  .ace {
    background: var(--ace-bg-color);
    border-color: var(--main-bg-color);

    .ace_editor,
    .ace_gutter {
      background-color: var(--main-bg-color);
      color: var(--text-color);
    }
  }
}
</style>