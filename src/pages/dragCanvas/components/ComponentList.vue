<template>
  <div class="component-list" @dragstart="handleDragStart">
    <div
      v-for="(item, index) in componentList"
      :key="index"
      class="list"
      :draggable="true"
      :data-index="index"
    >
      <svg class="icon" aria-hidden="true" v-if="item.icon.substr(0,2) === 'el'" :style="{color: isDarkMode?'#ddd':'#606266'}">
        <use :xlink:href="`#item.icon`"></use>
      </svg>
      <svg class="icon" aria-hidden="true" v-else :style="{color: isDarkMode?'#ddd':'#606266'}">
        <use :xlink:href="`#icon-${item.icon}`"></use>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import componentList from '@/custom-component/component-list'
import { computed } from 'vue';

const store = useStore();

const isDarkMode = computed(() => store.state.isDarkMode);

function handleDragStart(e) {
  e.dataTransfer.setData('index', e.target.dataset.index);
}
</script>

<style lang="scss" scoped>
.component-list {
  opacity: 1;
  height: 65%;
  padding: 8px;
  display: grid;
  position: relative;
  grid-gap: 10px 19px;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-template-rows: repeat(auto-fill, 40px);
  transition: opacity .5s .5s;

  .list {
    width: 80px;
    height: 40px;
    border: 1px solid #ddd;
    cursor: grab;
    text-align: center;
    padding: 2px 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      cursor: grabbing;
    }

    .icon {
      margin-right: 4px;
      font-size: 23px;
    }
  }
}
</style>
