<template>
  <div class="rect-shape" ref="elRef">
    <v-text :prop-value="element.propValue" :element="element" />
  </div>
</template>

<script setup>
import { useOnEvent } from '../common/onEvent.js';
import { toRefs, onMounted, ref } from 'vue';

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
</script>

<style lang="scss" scoped>
.rect-shape {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
