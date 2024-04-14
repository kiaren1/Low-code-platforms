<template>
  <div class="v-common-attr">
    <a-collapse v-model:activeKey="activeName" accordion @change="onChange" :bordered="false" expandIconPosition="end">
      <a-collapse-panel header="通用样式" key="style">
        <a-form layout="vertical">
          <a-form-item v-for="({ key, label }, index) in styleKeys" :key="index" :label="label">
            <pick-colors v-if="isIncludesColor(key)" v-model:value="curComponent.style[key]" show-alpha :theme="isDarkMode ? 'dark': 'light'"/>
            <a-select v-else-if="selectKey.includes(key)" v-model:value="curComponent.style[key]">
              <a-select-option
                v-for="item in optionMap[key]"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <a-input-number v-else v-model:value="curComponent.style[key]" />
          </a-form-item>
        </a-form>
      </a-collapse-panel>
      <a-collapse-panel header="数据来源（预览生效）" key="request" v-if="curComponent.request">
        <Request></Request>
      </a-collapse-panel>
      <a-collapse-panel header="组件联动（预览生效）" key="linkage" v-if="curComponent.linkage">
        <Linkage v-if="curComponent.linkage"></Linkage>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup>
import { styleData, textAlignOptions, borderStyleOptions, verticalAlignOptions, selectKey, optionMap } from '@/utils/attr'
import Request from './Request.vue';
import Linkage from './Linkage.vue'
import PickColors from 'vue-pick-colors'
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex'

const store = useStore();

const curComponent = computed(() => store.state.curComponent);
const isDarkMode = computed(() => store.state.isDarkMode);

const activeName = ref('linkage');

const styleKeys = computed(() => {
  if (curComponent.value) {
    const curComponentStyleKeys = Object.keys(curComponent.value.style);
    return styleData.filter((item) => curComponentStyleKeys.includes(item.key));
  }

  return [];
});

onMounted(() => {
  // activeName.value = curComponent.value.collapseName;
})

watch(curComponent, () => {
  // activeName.value = curComponent.value.collapseName;
});

function onChange() {
  curComponent.value.collapseName = activeName.value;
}
function isIncludesColor(str) {
  return str.toLowerCase().includes('color');
}
</script>

<style lang="scss">
.v-common-attr {
  .el-input-group__prepend {
    padding: 0 10px;
  }
  .ant-collapse{
    background-color: white;
    .attr-list{
      padding: 0;
      padding-bottom: 10px;
    }
  }
}
</style>
