<template>
  <div class="svg-star-container" ref="elRef">
    <svg
      version="1.1"
      baseProfile="full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        ref="star"
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
import { useOnEvent } from '../../common/onEvent';
import { toRefs, onMounted, ref, watch } from 'vue';

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
const { element, linkage} = toRefs(props);
onMounted(() => {
  useOnEvent(linkage.value, element.value, elRef.value);
});

const points = ref('');

onMounted(() => {
  draw();
})
watch([() => element.value.style.width, () => element.value.style.height], () => {
  draw();
})

function draw() {
  const { width, height } = element.value.style;
  drawPolygon(width, height);
}

function drawPolygon(width, height) {
  // 五角星十个坐标点的比例集合
  const pointsList = [
    [0.5, 0],
    [0.625, 0.375],
    [1, 0.375],
    [0.75, 0.625],
    [0.875, 1],
    [0.5, 0.75],
    [0.125, 1],
    [0.25, 0.625],
    [0, 0.375],
    [0.375, 0.375],
  ];

  const coordinatePoints = pointsList.map((point) => width * point[0] + ' ' + height * point[1]);
  points.value = coordinatePoints.toString();
}
</script>

<style lang="scss" scoped>
.svg-star-container {
  width: 100%;
  height: 100%;

  svg {
    width: 100%;
    height: 100%;
  }

  .v-text {
    position: absolute;
    top: 58%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 40%;
  }
}
</style>
