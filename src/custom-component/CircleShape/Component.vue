<template>
  <div class="circle-shape" ref="elRef">
    <v-text :prop-value="element.propValue" :element="element" />
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from 'vue';
import { useOnEvent } from '../common/onEvent.js';

const elRef = ref();
const props = defineProps({
  propValue: {
    type: String,
    required: true,
    default: '',
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
})
</script>

<style lang="scss" scoped>
.circle-shape {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: auto;
}
</style>
