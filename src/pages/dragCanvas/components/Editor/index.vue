<template>
  <div
    id="editor"
    class="editor"
    :class="{ edit: isEdit }"
    :style="{
      ...getCanvasStyle(canvasStyleData),
      width: changeStyleWithScale(canvasStyleData.width) + 'px',
      height: changeStyleWithScale(canvasStyleData.height) + 'px',
    }"
    @contextmenu="handleContextMenu"
    @mousedown="handleMouseDown"
  >
    <!-- 网格线 -->
    <Grid :isDarkMode="store.state.isDarkMode" />
    <!--页面渲染组件-->
    <Shape
      v-for="(item, index) in componentData"
      :key="item.id"
      :default-style="item.style"
      :style="getShapeStyle(item.style)"
      :active="item.id === (curComponent || {}).id"
      :element="item"
      :index="index"
      :class="{ lock: item.isLock }"
    >
      <!-- 区分不同类型的组件进行渲染 -->
      <!-- SVG图 -->
      {{ item.component }}
      <component
        :is="item.component"
        v-if="item.component.startsWith('SVG')"
        :id="'component' + item.id"
        :style="getSVGStyle(item.style)"
        class="component"
        :prop-value="item.propValue"
        :element="item"
        :request="item.request"
      />

      <!-- 非SVG图非VText文本 -->
      <!-- <component
        :is="item.component"
        v-else-if="item.component != 'VText'"
        :id="'component' + item.id"
        class="component"
        :style="getComponentStyle(item.style)"
        :prop-value="item.propValue"
        :element="item"
        :request="item.request"
      /> -->

      <!-- VText需要监听Input事件 -->
      <component
        :is="item.component"
        v-else
        :id="'component' + item.id"
        class="component"
        :style="getComponentStyle(item.style)"
        :prop-value="item.propValue"
        :element="item"
        :request="item.request"
        @input="handleInput"
      />
    </Shape>
    <!-- 右击菜单 -->
    <!-- <ContextMenu /> -->
    <!-- 标线 -->
    <!-- <MarkLine /> -->
    <!-- 选中区域 -->
    <!-- <Area
      v-show="isShowArea"
      :start="start"
      :width="width"
      :height="height"
    /> -->
  </div>
</template>

<script setup>
import Grid from './Grid.vue';
import Shape from './Shape.vue';
import { computed, onMounted, ref } from "vue";
import { changeStyleWithScale } from '@utils/translate';
import eventBus from '@utils/eventBus.js'
import { getStyle, getComponentRotatedStyle, getShapeStyle, getSVGStyle, getCanvasStyle } from '@utils/style';
import { useStore } from 'vuex';

const store = useStore();

const editorX = ref(0);
const editorY = ref(0);
const start = ref({ // 选中区域的起点
  x: 0,
  y: 0,
});
const width = ref(0);
const height = ref(0);
const isShowArea = ref(false);
const svgFilterAttrs = ref(['width', 'height', 'top', 'left', 'rotate']);

const canvasStyleData = computed(() => store.state.canvasStyleData);
const componentData = computed(() => store.state.componentData);
const curComponent = computed(() => store.state.curComponent);

onMounted(() => {
  // 获取编辑器元素
  store.commit('getEditor');
  eventBus.on('hideArea', () => {
    hideArea()
  })
});

function hideArea() {
  isShowArea.value = 0
  width.value = 0
  height.value = 0

  store.commit('setAreaData', {
    style: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    },
    components: [],
  })
}

function getComponentStyle(style) {
  return getStyle(style, svgFilterAttrs.value);
}

</script>

<style lang="less" scoped>
.editor {
  position: relative;
  background: #fff;
  margin: auto;

  .lock {
    opacity: .5;

    &:hover {
      cursor: not-allowed;
    }
  }
}

.edit {
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>
