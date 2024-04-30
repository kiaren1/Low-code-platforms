<template>
  <div :class="!isDarkMode? 'home' : 'home dark'">
    <Toolbar />
    <main>
      <!-- 左侧组件列表 -->
      <section :class="leftList ? 'left active' : 'left inactive'">
        <ComponentList />
        <RealTimeComponentList />
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
        <a-tag :color="currentProjectStatusItem.color" class="project-status-tag">
          {{ currentProjectStatusItem.label }}
          <router-link
            v-if="projectStatus === ProjectStatusMap.Publishing"
            :to="`/works?projectId=${projectKey}`"
            style="margin-left:10px"
          >
            {{ `${basePath}/works?projectId=${projectKey}` }}
          </router-link>
        </a-tag>
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
        <a-tabs v-if="curComponent" v-model="activeName">
          <a-tab-pane tab="属性" key="attr" style="margin-top:-12px">
            <component :is="curComponent.component + 'Attr'" />
          </a-tab-pane>
          <a-tab-pane tab="动画" key="animation" style="padding-top: 20px;">
            <AnimationList />
          </a-tab-pane>
          <a-tab-pane tab="事件" key="events" style="padding-top: 20px;">
            <EventList />
          </a-tab-pane>
        </a-tabs>
        <CanvasAttr v-else></CanvasAttr>
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
import ComponentList from './components/ComponentList.vue';
import componentList from '@/custom-component/component-list'; // 左侧列表数据
import RealTimeComponentList from './components/RealTimeComponentList.vue';
import CanvasAttr from './components/CanvasAttr.vue';
import AnimationList from './components/AnimationList.vue';
import EventList from './components/EventList.vue';
import generateID from '@/utils/generateID';
import { changeComponentSizeWithScale } from '@/utils/changeComponentsSizeWithScale';
import { useStore } from 'vuex';
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { listenGlobalKeyDown } from '@/utils/shortcutKey'
import { cloneDeep } from 'lodash';
import eventBus from '@utils/eventBus';
import {
  CaretLeftOutlined,
  CaretRightOutlined
} from '@ant-design/icons-vue';
import ProjectManagement from '@api/projectManagement.js';

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
const projectStatus = computed(() => store.state.projectStatus);
const projectKey = computed(() => store.state.projectKey);

onMounted(() => {
  restore();
  // 全局监听按键事件（实现快捷键）
  listenGlobalKeyDown();
  const savedMode = localStorage.getItem('isDarkMode');
  if (savedMode !== null) {
    store.commit('toggleDarkMode', JSON.parse(savedMode));
  } else {
    store.isDarkMode = false
  }
  eventBus.on('login', restore); // 登录后需要获取最近的画布
});
onUnmounted(() => {
  eventBus.off('login', restore)
})

async function restore() {
  // 用保存的数据恢复画布
  const projectKey = localStorage.getItem('currentProjectKey');
  if(projectKey){
    try{
      await ProjectManagement.getProjectData(projectKey);
    }catch(e){
      console.error(e);
      const {code} = e;
      if(code === '404'){
        localStorage.removeItem('currentProjectKey');
      }
    }
  }
}

function isShowLeft(){
  leftList.value = !leftList.value;
}
function isShowRight(){
  store.commit('isShowRightList');
}
watch(rightList, (value) => {
  store.commit('setMenuIsRight', !value);
});

function handleDrop(e) {
  e.preventDefault()
  e.stopPropagation()

  const index = e.dataTransfer.getData('index');
  const rectInfo = editor.value.getBoundingClientRect();
  if (index) {
    const component = cloneDeep(componentList[index]);
    component.style.top = e.clientY - rectInfo.y;
    component.style.left = e.clientX - rectInfo.x;
    component.id = generateID();

    // 根据画面比例修改组件样式比例
    changeComponentSizeWithScale(component);

    store.commit('addComponent', { component });
    store.commit('recordSnapshot');
  }
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

const ProjectStatusMap = {
  Setting: '0',
  Publishing: '1',
  Deleted: '2',
}
const currentProjectStatusItem = computed(() => {
  const itemMap = {
    [ProjectStatusMap.Setting]: {
      color: 'processing',
      label: '编辑中'
    },
    [ProjectStatusMap.Publishing]: {
      color: 'success',
      label: '已发布'
    },
    [ProjectStatusMap.Deleted]: {
      color: 'error',
      label: '已删除'
    }
  }
  return itemMap[projectStatus.value];
});

const basePath = computed(() => {
  const fullPath = window.location.href;
  const regex = /(.*)\/#/;
  const match = fullPath.match(regex);
  if (match) {
    return match[1];
  }
  return '';
});

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
    .right {
      padding: 0 5px;
      overflow: scroll;

      .ant-tabs-tabpane{
        padding-top: 10px !important;
      }
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
      position: relative;

      .project-status-tag{
        position: absolute;
        top: 20px; left: 20px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
      }
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
      .ant-form{
        transition: all .3s;
        color: var(--text-color);
      }
      .ant-form-item{
        transition: all .3s;
        color: var(--text-color);
      }
      .ant-form-item-label {
        label{
          transition: all .3s;
          color: var(--text-color);
        }
      }

      .ant-tabs-nav {
        color: var(--text-color);

        &.ant-tabs-tab-active {
          color: var(--actived-text-color);
        }
      }
      .ant-input-group-addon, .ant-input-number-group-addon{
        transition: all .3s;
        background-color: #F5F7FA;
      }
      .ant-input {
        transition: all .3s;
        background-color: var(--placeholder-bg-color);
        color: var(--text-color);
        border-color: var(--border-color);

        &::placeholder{
          color: var(--placeholder-text-color);
        }
      }

      textarea.el-textarea__inner {
        background-color: var(--placeholder-bg-color);
        color: var(--text-color);
      }

      .ant-select{
        .ant-select-selector{
          background-color: var(--placeholder-bg-color);
          color: var(--text-color) !important;
          .ant-select-selection-item{
            color: var(--text-color) !important;
          }
        }
        .ant-select-arrow{
          color: var(--placeholder-text-color);
        }
        .ant-select-selection-placeholder{
          color: var(--placeholder-text-color);
        }
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

  .ant-collapse {
    border-color: var(--border-color);
  }

  .ant-collapse-header,
  .ant-collapse-content-box {
    transition: all .3s;
    border-color: var(--border-color);
    background-color: var(--main-bg-color);
    color: var(--text-color) !important;
  }

  //.ant-collapse-header.is-active {
  //  border-bottom-color: transparent !important;
  //}

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