<template>
  <div
    :style="{
      left: start.x + 'px',
      top: start.y + 'px',
      width: width + 'px',
      height: height + 'px',
    }"
    class="area"
  />
</template>

<script setup>
import { toRefs } from 'vue';
const props = defineProps({
  start: {
    type: Object,
    default: () => {},
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
});
const {start, width, height} = toRefs(props);
</script>

<style lang="scss" scoped>
.area {
  border: 1px solid #70c0ff;
  position: absolute;
}
</style>