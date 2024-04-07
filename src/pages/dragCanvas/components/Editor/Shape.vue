<template>
  <div
    class="shape"
    :class="{ active }"
    @click="selectCurComponent"
    @mousedown="handleMouseDownOnShape"
  >
    <span v-show="isActive()" class="iconfont icon-xiangyouxuanzhuan" @mousedown="handleRotate"></span>
    <span v-show="element.isLock" class="iconfont icon-suo"></span>
    <div
      v-for="item in (isActive()? getPointList() : [])"
      :key="item"
      class="shape-point"
      :style="getPointStyle(item)"
      @mousedown="handleMouseDownOnPoint(item, $event)"
    >
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import eventBus from '@utils/eventBus';
import runAnimation from '@utils/runAnimation';
import calculateComponentPositonAndSize from '@utils/calculateComponentPositonAndSize';
import { mod360 } from '@utils/translate';
import { isPreventDrop } from '@utils/utils';
import { computed, toRefs } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  element: {
    required: true,
    type: Object,
    default: () => {},
  },
  defaultStyle: {
    required: true,
    type: Object,
    default: () => {},
  },
  index: {
    required: true,
    type: [Number, String],
    default: 0,
  },
})
const {active, element, defaultStyle, index} = toRefs(props);

const curComponent = computed(() => store.state.curComponent);
const editor = computed(() => store.state.compose.editor);

function isActive() {
  return active.value && !element.value.isLock
}

</script>

<style lang="scss" scoped>
.shape {
  position: absolute;

  &:hover {
    cursor: move;
  }
}

.active {
  outline: 1px solid #70c0ff;
  user-select: none;
}

.shape-point {
  position: absolute;
  background: #fff;
  border: 1px solid #59c7f9;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  z-index: 1;
}

.icon-xiangyouxuanzhuan {
  position: absolute;
  top: -34px;
  left: 50%;
  transform: translateX(-50%);
  cursor: grab;
  color: #59c7f9;
  font-size: 20px;
  font-weight: 600;

  &:active {
    cursor: grabbing;
  }
}

.icon-suo {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
