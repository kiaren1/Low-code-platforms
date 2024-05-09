<template>
  <a-button :type="propValue.type" class="v-button" ref="elRef"><div>{{ propValue.text }}</div></a-button>
</template>

<script setup>
import { useOnEvent } from '../common/onEvent.js';
import { toRefs, onMounted, ref } from 'vue';

const elRef = ref();
const props = defineProps({
  propValue: {
    type: Object,
    required: true,
    default: () => ({
      text: '',
      type: '',
    }),
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
.v-button {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
