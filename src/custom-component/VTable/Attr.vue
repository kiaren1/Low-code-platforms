<template>
  <div class="attr-list v-talbe-attr">
    <CommonAttr></CommonAttr>
    <EditTable></EditTable>
    <a-form>
      <a-form-item label="斑马纹">
        <a-switch v-model:checked="propValue.stripe"></a-switch>
      </a-form-item>
      <a-form-item label="表头加粗">
        <a-switch v-model:checked="propValue.thBold"></a-switch>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import CommonAttr from '@/custom-component/common/CommonAttr.vue';
import EditTable from './EditTable.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const propValue = computed(() => store.state.curComponent.propValue);
</script>
