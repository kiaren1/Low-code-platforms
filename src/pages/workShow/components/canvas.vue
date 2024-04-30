<template>
  <section ref="containerRef" class="content">
    <div class="canvas-container">
      <div
        v-if="componentData.length" 
        class="canvas"
        :style="{
          ...getCanvasStyle(canvasStyleData),
          width: changeStyleWithScale(canvasStyleData.width) + 'px',
          height: changeStyleWithScale(canvasStyleData.height) + 'px',
        }"
      >
        <ComponentWrapper
          v-for="(item, index) in componentData"
          :key="index"
          :config="item"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { getCanvasStyle } from '@/utils/style';
import { useStore } from 'vuex';
import ComponentWrapper from '@/components/canvasComponents/ComponentWrapper.vue';
import { changeStyleWithScale } from '@/utils/translate';
import { computed, ref } from 'vue';

const store = useStore();

const containerRef = ref();

const componentData = computed(() => store.state.componentData);
const canvasStyleData = computed(() => store.state.canvasStyleData);


</script>

<style lang="scss" scoped>
.content {
  .canvas-container {
    overflow: auto;
    .canvas {
      position: relative;
      margin: auto;
      overflow: hidden;
    }
  }
}
</style>
