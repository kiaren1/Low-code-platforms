<template>
  <div @click="onClick" @mouseenter="onMouseEnter">
    <component
      :is="config.component"
      v-if="config.component.startsWith('SVG')"
      ref="component"
      class="component"
      :style="getSVGStyle(config.style)"
      :prop-value="config.propValue"
      :element="config"
      :request="config.request"
      :linkage="config.linkage"
    />

    <component
      :is="config.component"
      v-else
      ref="component"
      class="component"
      :style="getStyle(config.style)"
      :prop-value="config.propValue"
      :element="config"
      :request="config.request"
      :linkage="config.linkage"
    />
  </div>
</template>

<script setup>
import { getStyle, getSVGStyle } from '@/utils/style';
import runAnimation from '@/utils/runAnimation';
import { events } from '@/utils/events';
import eventBus from '@/utils/eventBus';
import { onMounted, ref, toRefs } from 'vue';

const props = defineProps({
  config: {
    type: Object,
    required: true,
    default: () => {},
  },
});
const { config } = toRefs(props);

const component = ref();

onMounted(() => {
  if(component.value){
    runAnimation(component.value.$el, config.value.animations);
  }
});

function onClick() {
  const configEvents = config.value.events;
  Object.keys(configEvents).forEach((event) => {
    events[event](configEvents[event]);
  })

  eventBus.emit('v-click', config.value.id);
}

function onMouseEnter() {
  eventBus.emit('v-hover', config.value.id);
}

</script>

<style lang="scss" scoped>
.component {
  position: absolute;
}
</style>
