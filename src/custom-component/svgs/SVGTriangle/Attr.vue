<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <a-form>
      <a-form-item label="内容">
        <a-input v-model="curComponent.propValue" type="textarea" :rows="3" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import CommonAttr from '@/custom-component/common/CommonAttr.vue';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const curComponent = computed(() => store.state.curComponent);

</script>
