<template>
  <div class="real-time-component-list">
    <Draggable
      :list="reverseDataList"
      animation="200"
      @end="onEnd"
      itemKey
    >
      <template #item="{ element, index }">
        <div
          class="list-item" 
          @click="onClick(transformIndex(index))" 
          :class="{ actived: transformIndex(index) === curComponentIndex }"
        >
          <!-- Group组合给个单独的图标 -->
          <svg v-if="element.component === 'Group'" class="icon" aria-hidden="true">
            <use xlink:href="#icon-zuhe"></use>
          </svg>
          <svg v-else class="icon" aria-hidden="true">
            <use :xlink:href="`#icon-${element.icon}`"></use>
          </svg>
          <div
            :style="{flex: 1, textAlign: 'left', padding: '5px'}"
            :contenteditable="canEdit"
            @dblclick="setEdit"
            @blur="handleBlur"
            @paste="(event)=>clearStyle(event, element)"
            @input="(event)=>handleInput(event, element)"
            @mousedown="handleMousedown"
            tabindex="1">
            {{ element.label }}
          </div>
          <div class="icon-container">
            <div class="content">
              <div class="icon-item" @click="upComponent(transformIndex(index))">
                <ArrowUpOutlined />
              </div>
              <div class="icon-item" @click="downComponent(transformIndex(index))">
                <ArrowDownOutlined />
              </div>
              <div class="icon-item" @click="deleteComponent(transformIndex(index))">
                <DeleteOutlined />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import Draggable from "vuedraggable";
import { cloneDeep } from 'lodash';
import { ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { insertTextAtCaret } from '@/utils/utils.js';

const store = useStore();

const componentData = computed(() => store.state.componentData);
const curComponentIndex = computed(() => store.state.curComponentIndex);
const curComponent = computed(() => store.state.curComponent);
const canEdit = ref(false);

const reverseDataList = computed(() => {
  const ansList = cloneDeep(componentData.value);
  ansList.reverse();
  return ansList;
})
function onEnd(){
  saveData();
}
function saveData(){
  const ansList = cloneDeep(reverseDataList.value);
  ansList.reverse();
  store.commit('setComponentData', ansList);
  store.commit('setCurComponentIndex', getCurComponentIndex());
  store.commit('recordSnapshot');
}
function getCurComponentIndex(){
  const id = curComponent.value.id;
  for (let index = 0; index < componentData.value.length; index++) {
    const component = componentData.value[index];
    if(component.id === id) {
      return index;
    }
  }
  return -1;
}

function transformIndex(index) {
  return componentData.value.length - 1 - index;
}

function onClick(index) {
  if (!store.state.rightList) {
    store.commit('isShowRightList')
  }
  setCurComponent(index);
}

function deleteComponent(index) {
  setTimeout(() => {
    store.commit('deleteComponent', index)
    store.commit('recordSnapshot')
  })
}

function upComponent(index) {
  setTimeout(() => {
    store.commit('moveComponent', {curIndex: index, targetIndex: index+1})
    store.commit('recordSnapshot')
  })
}

function downComponent(index) {
  setTimeout(() => {
    store.commit('moveComponent', {curIndex: index, targetIndex: index-1})
    store.commit('recordSnapshot')
  })
}

function setCurComponent(index) {
  store.commit('setCurComponent', { component: componentData.value[index], index })
}

function setEdit(event){
  canEdit.value = true;
  selectText(event.target);
}
function selectText(elementItem) {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(elementItem);
  selection.removeAllRanges();
  selection.addRange(range);
}
function handleBlur(){
  canEdit.value = false;
  saveData();
}
function handleInput(event, element) {
  element.label = event.target.innerHTML;
}
function handleMousedown(e) {
  if (canEdit.value) {
    e.stopPropagation();
  }
}
function clearStyle(e, element) {
  e.preventDefault()
  const clp = e.clipboardData
  const text = clp.getData('text/plain') || ''
  if (text !== '') {
    insertTextAtCaret(text);
  }
  element.label = e.target.innerHTML;
}
</script>

<style lang="scss" scoped>
.real-time-component-list {
  height: 35%;

  .list-item {
    height: 30px;
    cursor: grab;
    text-align: center;
    display: flex;
    align-items: center;
    font-size: 12px;
    padding: 0 10px;
    position: relative;
    user-select: none;
    opacity: 1;

    &:active {
      cursor: grabbing;
    }

    &:hover {
      background-color: rgba(200, 200, 200, .2);

      .icon-container {
        display: block;
      }
    }
    .icon {
      margin-bottom: 2px;
      margin-right: 2px;
      font-size: 16px;
    }

    .icon-container {
      position: absolute;
      right: 10px;
      display: none;
      height: 100%;
      .content{
        height: 100%;
        display: flex;
        flex-direction: row;
      }
      .icon-item{
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        .anticon{
          margin-right: 8px;
        }
      }
    }
  }

  .actived {
    background: #ecf5ff;
    color: #409eff;
  }
}
</style>
