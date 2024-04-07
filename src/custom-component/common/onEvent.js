import { onMounted, onUnmounted } from 'vue';
import eventBus from '@utils/eventBus';
export function useOnEvent(linkage, element, elRef) {

  onMounted(() => {
    if (linkage?.data?.length) {
      eventBus.on('v-click', onClick);
      eventBus.on('v-hover', onHover);
    }

    const { data, duration } = linkage || {};
    if (data?.length) {
      elRef.value.style.transition = `all ${duration}s`;
    }
  });
  onUnmounted(() => {
    if (linkage?.data?.length) {
      eventBus.$off('v-click', onClick);
      eventBus.$off('v-hover', onHover);
    }
  })

  function onClick(componentId) {
    const data = linkage.data.filter((item) => item.id === componentId && item.event === 'v-click')
    changeStyle(data)
  }

  function onHover(componentId) {
    const data = linkage.data.filter((item) => item.id === componentId && item.event === 'v-hover')
    changeStyle(data)
  }

  function changeStyle(data = []) {
    data.forEach((item) => {
      item.style.forEach((e) => {
        if (e.key) {
          element.style[e.key] = e.value
        }
      })
    })
  }
}

