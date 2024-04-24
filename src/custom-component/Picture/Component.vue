<template>
  <div style="overflow: hidden;" ref="elRef">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { useOnEvent } from '../common/onEvent.js';
import { toRefs,onMounted,ref, watch } from 'vue';

const elRef = ref();
const props = defineProps({
  propValue: {
    type: Object,
    required: true,
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
const { propValue, element, linkage} = toRefs(props);
onMounted(() => {
  useOnEvent(linkage.value, element.value, elRef.value);
})

const img = ref(null);
const canvas = ref();
const ctx = ref(null);

let preUrl = ''; // 记录前一段的url，用来判断url是否发生变化

onMounted(() => {
  ctx.value = canvas.value.getContext('2d');
  drawImage();
});

watch([() => element.value.propValue.url, () => element.value.style.width, () => element.value.style.height], () => {
  drawImage();
});
watch([() => propValue.value.flip.vertical, () => propValue.value.flip.horizontal], () => {
  mirrorFlip();
});

function drawImage(){
  const { width, height } = element.value.style;
  canvas.value.width = width;
  canvas.value.height = height;
  if (preUrl !== element.value.propValue.url) { // 如果url发生改变需要对画布重绘
    preUrl = element.value.propValue.url;
    const imageElement = document.createElement('img');
    imageElement.src = propValue.value.url;
    imageElement.onload = () => {
      ctx.value.drawImage(imageElement, 0, 0, width, height);
      mirrorFlip();
    }
    img.value = imageElement;
  } else {
    mirrorFlip();
  }
}
function mirrorFlip() {
  const { vertical, horizontal } = propValue.value.flip;
  const { width, height } = element.value.style;
  const hvalue = horizontal ? -1 : 1
  const vValue = vertical ? -1 : 1

  // 清除图片
  ctx.value.clearRect(0, 0, width, height)
  // 平移图片
  ctx.value.translate(width / 2 - width * hvalue / 2, height / 2 - height * vValue / 2)
  // 对称镜像
  ctx.value.scale(hvalue, vValue);
  ctx.value.drawImage(img.value, 0, 0, width, height);
  // 还原坐标点
  ctx.value.setTransform(1, 0, 0, 1, 0, 0);
}
</script>
