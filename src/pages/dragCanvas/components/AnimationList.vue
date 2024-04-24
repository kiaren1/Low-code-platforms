<template>
  <div class="animation-list">
    <div class="div-animation">
      <a-space style="margin-top: 0">
        <a-button @click="isShowAnimation = true">添加动画</a-button>
        <a-button @click="previewAnimate">预览动画</a-button>
      </a-space>
      <div v-for="(tag, index) in curComponent.animations" :key="index">
        <a-tag
          closable
          @close="removeAnimation(index)"
          color="blue"
          class="tag"
        >
          <div style="margin-right:auto">{{ tag.label }}</div>
          <SettingOutlined class="cursor" @click="handleAnimationSetting(index)" />
        </a-tag>
      </div>
    </div>

    <!-- 选择动画 -->
    <a-drawer
      v-model:open="isShowAnimation"
      :rootClassName="isDarkMode ? 'darkDrawer':''"
      title="动画"
      placement="left"
      :bodyStyle="{ padding: '0 10px' }"
      width="400px"
    >
      <a-tabs v-model:activeKey="animationActiveName">
        <a-tab-pane
          v-for="item in animationClassData"
          :key="item.label"
          :tab="item.label"
        >
          <div class="animate-scrollbar">
            <div
              v-for="animate in item.children"
              :ref="animate.value"
              :key="animate.value"
              class="animate"
              @mouseenter="(e) => {handleRunAnimation(e.target, animate)}"
              @click="addAnimation(animate)"
            >
              <div>
                {{ animate.label }}
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-drawer>
    <!-- 编辑动画配置 -->
    <AnimationSettingModal
      v-model:isShowAnimationSetting="isShowAnimationSetting"
      :cur-index="curIndex"
    />
  </div>
</template>

<script setup>
import eventBus from '@/utils/eventBus';
import animationClassData from '@/utils/animationClassData';
import { useStore } from 'vuex';
import runAnimation from '@/utils/runAnimation';
import { computed, ref } from 'vue';
import { SettingOutlined } from '@ant-design/icons-vue';
import AnimationSettingModal from './AnimationSettingModal.vue'

const store = useStore();

const isDarkMode = computed(() => store.state.isDarkMode);
const curComponent = computed(() => store.state.curComponent);

const isShowAnimation = ref(false);
const hoverPreviewAnimate = ref('');
const animationActiveName = ref('进入');
const showAnimatePanel = ref(false);
const timer = ref(null);
const isShowAnimationSetting = ref(false);
const curIndex = ref(0);

function addAnimation(animate) {
  console.log(111);
  store.commit('addAnimation', animate);
  isShowAnimation.value = false;
}

function previewAnimate() {
  eventBus.emit('runAnimation');
}

function removeAnimation(index) {
  store.commit('removeAnimation', index)
  if (!curComponent.value.animations.length) { // 清空动画数据，停止运动
    eventBus.emit('stopAnimation')
  }
}

function handleAnimationSetting(index) {
  isShowAnimationSetting.value = true;
  curIndex.value = index;
}

async function handleRunAnimation(target, animate) {
  if (animate.pending) {return}

  animate.pending = true;
  await runAnimation(target, [animate]);

  // 防止无限触发同一元素的动画
  setTimeout(() => {
    animate.pending = false
  }, 100)  
}

</script>

<style lang="scss">
.animation-list {
  .tag{
    margin: 10px auto 0 auto;
    width: 140px;

    display: flex;
    .cursor{
      cursor: pointer;
    }
  }

  .div-animation {
    text-align: center;

    & > div {
      margin-top: 20px;
    }
  }
}
.animate-scrollbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  overflow: hidden;

  .animate {
    cursor: pointer;
  }

  .animate > div {
    width: 100px;
    height: 60px;
    background: #f5f8fb;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 12px;
    margin-bottom: 10px;
    font-size: 12px;
    color: #333;
    border-radius: 5px;
    user-select: none;
    cursor: pointer;
  }
}
.darkDrawer{
  .ant-drawer-content{
    background-color: #2e2e2e !important;
    .ant-drawer-title, .ant-drawer-close, .ant-tabs{
        color: #fff !important;
      }
  }
}
</style>