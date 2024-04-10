<template>
  <table class="v-table" ref="elRef">
    <tbody>
      <tr
        v-for="(item, index) in propValue.data"
        :key="index"
        :class="{
          stripe: propValue.stripe && index % 2,
          bold: propValue.thBold && index === 0
        }"
      >
        <td v-for="(e, i) in item" :key="i">{{ e }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { requestWarpper } from '@/utils/request';
import { useOnEvent } from '../common/onEvent.js';
import { toRefs, onMounted, ref, onBeforeUnmount } from 'vue';

const elRef = ref();
const props = defineProps({
  request: {
    type: Object,
    default: () => {},
  },
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
const { propValue, request, element, linkage } = toRefs(props);
onMounted(() => {
  useOnEvent(linkage.value, element.value, elRef.value);
});

const cancelRequest = ref(null);

onMounted(() => {
  if (requestWarpper) {
    cancelRequest.value = requestWarpper(request.value, propValue.value, 'data');
  }
});
onBeforeUnmount(() => {
  request.value && cancelRequest();
});
</script>

<style lang="scss" scoped>
.v-table {
  border-collapse: collapse;
  table-layout: fixed;
  word-break: break-all;
  word-wrap: break-word;
  width: 100%;
  height: 100%;

  td {
    border: 1px solid #ebeef5;
    height: 40px;
    width: 60px;
    padding: 10px;
  }

  .bold {
    font-weight: bold;
  }

  .stripe {
    background-color: #fafafa;
  }
}
</style>
