<template>
  <div class="attr-container">
    <p class="title">画布属性</p>
    <a-form style="padding: 20px;">
      <a-form-item label="文本颜色">
        <pick-colors v-model:value="canvasStyleData.color" show-alpha :theme="isDarkMode ? 'dark': 'light'"/>
      </a-form-item>
      <a-form-item label="背景色">
        <pick-colors v-model:value="canvasStyleData.background" show-alpha :theme="isDarkMode ? 'dark': 'light'"/>
      </a-form-item>
      <a-form-item label="透明度">
        <a-row>
          <a-col :span="12">
            <a-slider v-model:value="canvasStyleData.opacity" :min="0" :max="1" :step="0.01" />
          </a-col>
          <a-col :span="4">
            <a-input-number
              v-model:value="canvasStyleData.opacity"
              :min="0"
              :max="1"
              :step="0.01"
              style="margin-left: 16px"
            />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="字体大小">
        <a-input-number
          v-model:value="canvasStyleData.fontSize"
          :min="0"
          addon-after="px"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import PickColors from 'vue-pick-colors'
import { useStore } from "vuex";
const store = useStore();

const canvasStyleData = computed(() => store.state.canvasStyleData);
const isDarkMode = computed(() => store.state.isDarkMode);

</script>

<style lang="less">
.attr-container {
  .title {
    text-align: center;
    margin-bottom: 10px;
    height: 40px;
    line-height: 40px;
    border-bottom: 2px solid #e4e7ed;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color);
  }
}
</style>
