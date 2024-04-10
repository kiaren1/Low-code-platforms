<template>
  <div ref="elRef" class="content">
    <v-chart 
      ref="chart" 
      class="chart" 
      :option="propValue.option"
      autoresize
    />
  </div>
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { ScatterChart, BarChart, LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { useOnEvent } from '../common/onEvent.js';
import { toRefs, onMounted, ref } from 'vue';

const chart = ref();
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

use([
  CanvasRenderer,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  LineChart,
]);

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.contentBoxSize) {
      chart.value.resize();
    }
  }
});
onMounted(() => {
  resizeObserver.observe(elRef.value);
})
</script>

<style scoped>
.content{
  width: 100%;
  height: 100%;
}
.chart {
  height: 100%;
}
</style>
