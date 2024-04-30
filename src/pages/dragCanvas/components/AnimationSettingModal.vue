<template>
  <a-modal 
    v-model:open="isShow" 
    :title="`${config.label} 动画配置`" 
    @ok="handleSaveSetting" 
    width="30%"
    cancelText="取消"
    okText="确认"
  >
    <a-form style="margin-top:30px">
      <a-form-item label="动画时长">
        <a-input-number
          v-model:value="config.animationTime"
          :min="0.1"
          :precision="2"
          :step="0.01"
        />
      </a-form-item>
      <a-form-item label="是否循环">
        <a-switch
          v-model:checked="config.isLoop"
          checkedChildren="是"
          unCheckedChildren="否"
          :disabled="isDisabled"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { useStore } from 'vuex'
import eventBus from '@/utils/eventBus'
import { computed, onMounted, ref, toRefs, watch } from 'vue';

const store = useStore();
const props = defineProps({
  curIndex: {
    type: Number,
    default: 0,
  },
  isShowAnimationSetting: {
    type: Boolean,
    default: false,
  }
})
const { curIndex, isShowAnimationSetting } = toRefs(props);

const isShow = ref(isShowAnimationSetting.value);

const emits = defineEmits(['update:isShowAnimationSetting']);

watch(isShowAnimationSetting, (newValue) => {
  isShow.value = newValue
})
watch(isShow, (newValue) => {
  emits('update:isShowAnimationSetting', newValue);
})

const config = ref({});

const curComponent = computed(() => store.state.curComponent);
const isDisabled = computed(() => {
  return curComponent.value.animations.length > 1
});

onMounted(() => {
  refreash();
});

watch([() => curComponent.value.animations, curIndex], () => {
  refreash();
})
function refreash(){
  const { label, animationTime, isLoop = false, value } = curComponent.value.animations[curIndex.value] || {}
  config.value = {
    animationTime,
    label,
    isLoop,
    value,
  }
}

function handleCloseModal() {
  emits('close');
}
function handleSaveSetting() {
  const { isLoop } = config.value
  store.commit('alterAnimation', {
    index: curIndex.value,
    data: { 
      animationTime: config.value.animationTime,
      isLoop,
    },
  })
  eventBus.emit('stopAnimation');
  handleCloseModal();
  isShow.value = false;
}

</script>

<style scoped lang="scss">
.loop {
  margin-top: 10px;
}
</style>
