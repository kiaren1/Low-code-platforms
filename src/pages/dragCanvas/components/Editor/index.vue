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
      <!-- {{ item.component }} -->
      <component
        :is="item.component"
        v-if="item.component.startsWith('SVG')"
        :id="'component' + item.id"
        :style="getSVGStyle_Local(item.style)"
        class="component"
        :prop-value="item.propValue"
        :element="item"
        :request="item.request"
      />

      <!-- 非SVG图非VText文本 -->
      <component
        :is="item.component"
        v-else-if="item.component != 'VText'"
        :id="'component' + item.id"
        class="component"
        :style="getComponentStyle(item.style)"
        :prop-value="item.propValue"
        :element="item"
        :request="item.request"
      />

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
    <ContextMenu />
    <!-- 标线 -->
    <MarkLine />
    <!-- 选中区域 -->
    <Area
      v-show="isShowArea"
      :start="start"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script setup>
import Grid from './Grid.vue';
import Shape from './Shape.vue';
import Area from './Area.vue';
import MarkLine from './MarkLine.vue';
import ContextMenu from './ContextMenu.vue';
import { $, isPreventDrop } from '@/utils/utils'
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
const editor = computed(() => store.state.compose.editor);

onMounted(() => {
  // 获取编辑器元素
  store.commit('getEditor');
  eventBus.on('hideArea', () => {
    hideArea()
  })
});

// 处理点击选择组件
function handleMouseDown(e) {
  // 如果没有选中组件 在画布上点击时需要调用 e.preventDefault() 防止触发 drop 事件
  if (!curComponent.value || (isPreventDrop(curComponent.value.component))) {
    e.preventDefault();
  }

  hideArea();

  // 获取编辑器的位移信息，每次点击时都需要获取一次。主要是为了方便开发时调试用。
  const rectInfo = editor.value.getBoundingClientRect()
  editorX.value = rectInfo.x
  editorY.value = rectInfo.y

  const startX = e.clientX
  const startY = e.clientY
  start.value.x = startX - editorX.value;
  start.value.y = startY - editorY.value;
  // 展示选中区域
  isShowArea.value = true

  const move = (moveEvent) => {
    width.value = Math.abs(moveEvent.clientX - startX)
    height.value = Math.abs(moveEvent.clientY - startY)
    if (moveEvent.clientX < startX) {
      start.value.x = moveEvent.clientX - editorX.value
    }

    if (moveEvent.clientY < startY) {
      start.value.y = moveEvent.clientY - editorY.value
    }
  }

  const up = () => {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)

    if (e.clientX === startX && e.clientY === startY) {
      hideArea()
      return
    }

    createGroup()
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}

function hideArea() {
  isShowArea.value = false;
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

function createGroup() {
  // 获取选中区域的组件数据
  const areaData = getSelectArea()
  if (areaData.length <= 1) {
    hideArea()
    return
  }

  // 根据选中区域和区域中每个组件的位移信息来创建 Group 组件
  // 要遍历选择区域的每个组件，获取它们的 left top right bottom 信息来进行比较
  let top = Infinity, left = Infinity
  let right = -Infinity, bottom = -Infinity
  areaData.forEach((component) => {
    let style = {}
    if (component.component === 'Group') {
      component.propValue.forEach((item) => {
        const rectInfo = $(`#component${item.id}`).getBoundingClientRect();
        style.left = rectInfo.left - editorX.value;
        style.top = rectInfo.top - editorY.value;
        style.right = rectInfo.right - editorX.value;
        style.bottom = rectInfo.bottom - editorY.value;

        if (style.left < left) {left = style.left}
        if (style.top < top) {top = style.top}
        if (style.right > right) {right = style.right}
        if (style.bottom > bottom) {bottom = style.bottom}
      })
    } else {
      style = getComponentRotatedStyle(component.style)
    }

    if (style.left < left) {left = style.left}
    if (style.top < top) {top = style.top}
    if (style.right > right) {right = style.right}
    if (style.bottom > bottom) {bottom = style.bottom}
  })

  start.value.x = left
  start.value.y = top
  width.value = right - left
  height.value = bottom - top

  // 设置选中区域位移大小信息和区域内的组件数据
  store.commit('setAreaData', {
    style: {
      left,
      top,
      width: width.value,
      height: height.value,
    },
    components: areaData,
  })
}

function getSelectArea() {
  const result = []
  // 区域起点坐标
  const { x, y } = start.value
  // 计算所有的组件数据，判断是否在选中区域内
  componentData.value.forEach((component) => {
    if (component.isLock) {return}

    const { cleft, ctop, cwidth, cheight } = getComponentRotatedStyle(component.style)
    if (x <= cleft && y <= ctop && (cleft + cwidth <= x + width.value) && (ctop + cheight <= y + height.value)) {
      result.push(component)
    }
  });

  // 返回在选中区域内的所有组件
  return result;
}

function handleContextMenu(e) {
  e.stopPropagation();
  e.preventDefault();

  // 计算菜单相对于编辑器的位移
  let target = e.target;
  let top = e.offsetY;
  let left = e.offsetX;
  while (target instanceof SVGElement) {
    target = target.parentNode;
  }

  while (!target.className.includes('editor')) {
    left += target.offsetLeft;
    top += target.offsetTop;
    target = target.parentNode;
  }
  store.commit('showContextMenu', { top, left });
}

function getComponentStyle(style) {
  return getStyle(style, svgFilterAttrs.value);
}

function getSVGStyle_Local(style) {
  return getSVGStyle(style, svgFilterAttrs.value)
}

function handleInput(element, value){
  // 根据文本组件高度调整 shape 高度
  store.commit('setShapeStyle', { height: getTextareaHeight(element, value) })
}

function getTextareaHeight(element, text) {
  /* eslint-disable-next-line */
  let { lineHeight, fontSize, height } = element.style
  if (lineHeight === '') {
    lineHeight = 1.5
  }

  const newHeight = (text.split('<br>').length - 1) * lineHeight * (fontSize || canvasStyleData.value.fontSize)
  return height > newHeight ? height : newHeight
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
