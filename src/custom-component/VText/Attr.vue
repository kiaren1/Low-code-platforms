<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <el-form>
      <el-form-item label="内容">
        <el-input v-model="curComponent.propValue" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import CommonAttr from '@/custom-component/common/CommonAttr.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const curComponent = computed(() => store.state.curComponent);
</script>
