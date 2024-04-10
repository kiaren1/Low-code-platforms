<template>
  <div class="svg-triangle-container" ref="elRef">
    <svg
      version="1.1"
      baseProfile="full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        ref="triangle"
        :points="points"
        :stroke="element.style.borderColor"
        :fill="element.style.backgroundColor"
        stroke-width="1"
      />
    </svg>
    <v-text :prop-value="element.propValue" :element="element" />
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs, watch } from 'vue';
import { useOnEvent } from '../../common/OnEvent.js';

const props = defineProps({
  propValue: {
    type: String,
    required: true,
    default: '',
  },
  linkage: {
    type: Object,
    default: () => {},
  },
  element: {
    type: Object,
    default: () => {},
  },
});

const { linkage, element } = toRefs(props);

const elRef = ref();
onMounted(() => {
  useOnEvent(linkage.value, element.value, elRef.value);
})

const points = ref('');

onMounted(() => {
  draw();
})
watch(() => element.value.style.width, () => {
  draw();
});
watch(() => element.value.style.height, () => {
  draw();
});

function draw() {
  const { width, height } = element.value.style
  drawTriangle(width, height)
}

function drawTriangle(width, height) {
  // 三角形三个坐标点的比例集合
  const trianglePoints = [
    [0.5, 0.05],
    [1, 0.95],
    [0, 0.95],
  ]

  const coordinatePoints = trianglePoints.map((point) => width * point[0] + ' ' + height * point[1])
  points.value = coordinatePoints.toString()
}

</script>

<style lang="scss" scoped>
.svg-triangle-container {
    width: 100%;
    height: 100%;

    svg {
        width: 100%;
        height: 100%;
    }

    .v-text {
        position: absolute;
        top: 72%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
        height: 40%;
    }
}
</style>
