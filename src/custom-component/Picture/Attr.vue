<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <a-form>
      <a-form-item label="镜像翻转">
        <div style="clear: both;">
          <a-checkbox v-model="curComponent.propValue.flip.horizontal">水平翻转</a-checkbox>
          <a-checkbox v-model="curComponent.propValue.flip.vertical">垂直翻转</a-checkbox>
        </div>
      </a-form-item>
      <a-form-item label="更改图片">
        <div style="clear: both;">

        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import CommonAttr from '@/custom-component/common/CommonAttr.vue'
import { useStore } from 'vuex';
import { computed } from 'vue';
const store = useStore();
const curComponent = computed(() => store.state.curComponent);
</script>
