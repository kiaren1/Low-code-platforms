<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    ref="elRef"
    v-if="editMode == 'edit'"
    class="v-text"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  >
    <!-- tabindex >= 0 使得双击时聚焦该元素 -->
    <div
      ref="text"
      :contenteditable="canEdit"
      :class="{ 'can-edit': canEdit }"
      tabindex="0"
      :style="{ verticalAlign: element.style.verticalAlign }"
      @dblclick="setEdit"
      @paste="clearStyle"
      @mousedown="handleMousedown"
      @blur="handleBlur"
      @input="handleInput"
      v-html="element.propValue"
    ></div>
  </div>
  <div v-else class="v-text preview">
    <div :style="{ verticalAlign: element.style.verticalAlign }" v-html="element.propValue"></div>
  </div>
</template>

<script setup>
import { keycodes } from '@/utils/shortcutKey.js';
import { requestWarpper } from '@/utils/request';
import { useOnEvent } from '../common/onEvent.js';
import eventBus from '@/utils/eventBus';
import { useStore } from 'vuex';
import { computed, nextTick, onMounted, onUnmounted, ref, toRefs } from 'vue';
import { insertTextAtCaret } from '@/utils/utils.js';

const store = useStore();
const elRef = ref();
const textRef = ref();

const props = defineProps({
  propValue: {
    type: String,
    required: true,
    default: '',
  },
  request: {
    type: Object,
    default: () => {},
  },
  element: {
    type: Object,
    default: () => {},
  },
  linkage: {
    type: Object,
    default: () => {},
  },
});
const { propValue, request, element, linkage} = toRefs(props);
useOnEvent(linkage, element, elRef);
const emits = defineEmits(['input']);

const canEdit = ref(false);
const ctrlKey = ref(17);
const isCtrlDown = ref(false);
const cancelRequest = ref(null);

const editMode = computed(() => store.state.editMode);
const curComponent = computed(() => store.state.curComponent);

onMounted(() => {
  // 注意，修改时接口属性时不会发数据，在预览时才会发
  // 如果要在修改接口属性的同时发请求，需要 watch 一下 request 的属性
  if (request.value) {
    // 第二个参数是要修改数据的父对象，第三个参数是修改数据的 key，第四个数据修改数据的类型
    cancelRequest.value = requestWarpper(request.value, element.value, 'propValue', 'string');
  }
  eventBus.on('componentClick', onComponentClick);
});
onUnmounted(() => {
  // 组件销毁时取消请求
  request.value && cancelRequest();
  eventBus.off('componentClick', onComponentClick);
});

function onComponentClick() {
  // 如果当前点击的组件 id 和 VText 不是同一个，需要设为不允许编辑 https://github.com/woai3c/visual-drag-demo/issues/90
  if (curComponent.value.id !== element.value.id) {
    canEdit.value = false;
  }
}

function  handleInput(e) {
  emits('input', element.value, e.target.innerHTML);
}

function  handleKeydown(e) {
  // 阻止冒泡，防止触发复制、粘贴组件操作
  canEdit.value && e.stopPropagation();
  if (e.keyCode === ctrlKey.value) {
    isCtrlDown.value = true;
  } else if (isCtrlDown.value && canEdit.value && keycodes.includes(e.keyCode)) {
    e.stopPropagation();
  } else if (e.keyCode === 46) { // deleteKey
    e.stopPropagation();
  }
}

function  handleKeyup(e) {
  // 阻止冒泡，防止触发复制、粘贴组件操作
  canEdit.value && e.stopPropagation();
  if (e.keyCode === ctrlKey.value) {
    isCtrlDown.value = false;
  }
}

function handleMousedown(e) {
  if (canEdit.value) {
    e.stopPropagation()
  }
}

function clearStyle(e) {
  e.preventDefault()
  const clp = e.clipboardData
  const text = clp.getData('text/plain') || ''
  if (text !== '') {
    insertTextAtCaret(text);
  }

  emits('input', element.value, e.target.innerHTML)
}

function handleBlur(e) {
  element.value.propValue = e.target.innerHTML || '&nbsp;';
  const html = e.target.innerHTML;
  if (html !== '') {
    element.value.propValue = e.target.innerHTML;
  } else {
    element.value.propValue = '';
    nextTick(() => {
      element.value.propValue = '&nbsp;';
    })
  }
  canEdit.value = false;
}

function setEdit() {
  if (element.value.isLock) {return}

  canEdit.value = true
  // 全选
  selectText(textRef.value);
}

function selectText(elementItem) {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(elementItem);
  selection.removeAllRanges();
  selection.addRange(range);
}

</script>

<style lang="scss" scoped>
.v-text {
  width: 100%;
  height: 100%;
  display: table;

  div {
    display: table-cell;
    width: 100%;
    height: 100%;
    outline: none;
    word-break: break-all;
    padding: 4px;
  }

  .can-edit {
    cursor: text;
    height: 100%;
  }
}

.preview {
  user-select: none;
}
</style>
