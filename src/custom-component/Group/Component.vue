<template>
  <div class="group" ref="elRef">
    <div>
      <component
        :is="item.component"
        v-for="item in propValue"
        :id="'component' + item.id"
        :key="item.id"
        class="component"
        :style="item.groupStyle"
        :prop-value="item.propValue"
        :element="item"
        :request="item.request"
      />
    </div>
  </div>
</template>

<script setup>
import { useOnEvent } from '../common/onEvent.js';
import { toRefs,onMounted,ref } from 'vue';

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
const { propValue, element, linkage} = toRefs(props);
onMounted(() => {
  useOnEvent(linkage.value, element.value, elRef.value);
})
</script>

<style lang="scss" scoped>
.group {
  & > div {
    position: relative;
    width: 100%;
    height: 100%;

    .component {
      position: absolute;
    }
  }
}
</style>
