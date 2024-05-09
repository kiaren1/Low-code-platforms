<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <a-form :labelCol="{span: 8, offset: 0}" labelAlign="left">
      <a-form-item label="内容">
        <a-textarea v-model:value="curComponent.propValue.text" type="textarea" :auto-size="{ maxRows: 3 }" />
      </a-form-item>
      <a-form-item label="按钮类型">
        <a-select
          v-model:value="curComponent.propValue.type"
        >
          <a-select-option v-for="type in typeList" :key="type" :value="type">{{type}}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import CommonAttr from '@/custom-component/common/CommonAttr.vue'
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const curComponent = computed(() => store.state.curComponent);

// primary | ghost | dashed | link | text | default
const typeList = ['primary', 'ghost', 'dashed', 'link', 'text', 'default'];
</script>
