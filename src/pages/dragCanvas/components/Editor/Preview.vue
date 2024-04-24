<template>
  <a-modal v-model:open="open" width="fit-content" title="预览" style="top: 70px">
    <div ref="containerRef" class="content">
      <div class="canvas-container">
        <div
          v-if="open"
          class="canvas"
          :style="{
            ...getCanvasStyle(canvasStyleData),
            width: changeStyleWithScale(canvasStyleData.width) + 'px',
            height: changeStyleWithScale(canvasStyleData.height) + 'px',
          }"
        >
          <ComponentWrapper
            v-for="(item, index) in copyData"
            :key="index"
            :config="item"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <a-button v-if="!isScreenshot" @click="close">关闭</a-button>
      <a-button v-else type="primary" @click="htmlToImage">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { getCanvasStyle } from '@/utils/style';
import { useStore } from 'vuex';
import ComponentWrapper from './ComponentWrapper.vue';
import { changeStyleWithScale } from '@/utils/translate';
import { toPng } from 'html-to-image';
import { cloneDeep } from 'lodash';
import { computed, onMounted, ref, toRefs, watch } from 'vue';

const store = useStore();
const emits = defineEmits(['close', 'update:show']);

const props = defineProps({
  isScreenshot: {
    type: Boolean,
    default: false,
  },
  show: {
    type: Boolean,
    default: false,
  }
});
const { isScreenshot, show } = toRefs(props);

const containerRef = ref();

const componentData = computed(() => store.state.componentData);
const canvasStyleData = computed(() => store.state.canvasStyleData);

const copyData = ref([]);
const open = ref(show.value);
watch(show, (newValue) => {
  open.value = newValue;
});
watch(open, (newValue) => {
  emits('update:show', newValue);
  if(newValue === false){
    emits('close');
  }
});
watch(open, () => {
  refreash();
})

onMounted(() => {
  refreash();
});

function refreash(){
  copyData.value = cloneDeep(componentData.value);
}

function close() {
  open.value = false;
}

async function htmlToImage() {
  try{
    const dataUrl = await toPng(containerRef.value.querySelector('.canvas'));
    const a = document.createElement('a')
    a.setAttribute('download', 'screenshot')
    a.href = dataUrl
    a.click();
  }catch(error){
    console.error('oops, something went wrong!', error)
  }
  close();
}
</script>

<style lang="scss" scoped>
.content {
  .canvas-container {
    overflow: auto;
    .canvas {
      background: #fff;
      position: relative;
      margin: auto;
      overflow: hidden;
    }
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>
