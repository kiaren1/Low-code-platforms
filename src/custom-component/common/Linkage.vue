<template>
  <div class="linkage-container">
    <a-form layout="vertical">
      <div v-for="(item, index) in linkage.data" :key="index" class="linkage-component">
        <div class="div-guanbi" @click="deleteLinkageData(index)">
          <CloseCircleOutlined />
        </div>
        <a-select v-model:value="item.id" placeholder="请选择联动组件" style="margin-top:10px; width: 100%">
          <a-select-option 
            v-for="(component, i) in componentData"
            :key="component.id"
            :value="component.id"
          >
            <div @mouseenter="onEnter(i)" @mouseout="onOut(i)">{{ component.label }}</div>
          </a-select-option>
        </a-select>
        <a-select v-model:value="item.event" placeholder="请选择监听事件" style="margin-top:10px; width: 100%">
          <a-select-option
            v-for="e in eventOptions"
            :key="e.value"
            :value="e.value"
          >
            {{ e.label }}
          </a-select-option>
        </a-select>
        <div class="change-attr">
          <p>事件触发时，要修改的属性</p>
          <div v-for="(e, i) in item.style" :key="i" class="attr-container">
            <a-select v-model:value="e.key" @change="e.value = ''">
              <a-select-option
                v-for="attr in Object.keys(curComponent.style)"
                :key="attr"
                :value="attr"
              >
                {{ styleMap[attr] }}
              </a-select-option>
            </a-select>
            <pick-colors v-if="isIncludesColor(e.key)" v-model:value="e.value" show-alpha :theme="isDarkMode ? 'dark': 'light'"/>
            <a-select v-else-if="selectKey.includes(e.key)" v-model="e.value">
              <a-select-option
                v-for="option in optionMap[e.key]"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </a-select>
            <a-input
              v-else
              v-model.number="e.value"
              type="number"
              placeholder="请输入"
            />
            <span class="iconfont icon-shanchu" @click="deleteData(item.style, i)"></span>
          </div>
          <a-button @click="addAttr(item.style)">添加属性</a-button>
        </div>
      </div>
      <a-button style="margin-bottom: 10px;" @click="addComponent">添加组件</a-button>
      <p>过渡时间（秒）</p>
      <a-input v-model="linkage.duration" class="input-duration" placeholder="请输入"></a-input>
    </a-form>
  </div>
</template>

<script setup>
import { styleMap, optionMap, selectKey } from '@/utils/attr';
import { reactive, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { CloseCircleOutlined } from '@ant-design/icons-vue';
import PickColors from 'vue-pick-colors';

const store = useStore();

const isDarkMode = computed(() => store.state.isDarkMode);
const curComponent = computed(() => store.state.curComponent);
const linkage = computed(() => store.state.curComponent.linkage);
const componentData = computed(() => store.state.componentData);

const eventOptions = reactive([
  { label: '点击', value: 'v-click' },
  { label: '悬浮', value: 'v-hover' },
]);
const oldOpacity = ref('');
const oldBackgroundColor = ref('');

function onEnter(index) {
  oldOpacity.value = componentData.value[index].style.opacity;
  oldBackgroundColor.value = componentData.value[index].style.backgroundColor;
  componentData.value[index].style.opacity = '.3';
  componentData.value[index].style.backgroundColor = '#409EFF';
}

function onOut(index) {
  componentData.value[index].style.opacity = oldOpacity.value;
  componentData.value[index].style.backgroundColor = oldBackgroundColor.value;
}

function isIncludesColor(str) {
  return str.toLowerCase().includes('color');
}

function addAttr(style) {
  style.push({ key: '', value: '' });
}

function addComponent() {
  linkage.value.data.push({
    id: '',
    event: '',
    style: [{ key: '', value: '' }],
  })
}

function deleteData(style, index) {
  style.splice(index, 1);
}

function deleteLinkageData(index) {
  linkage.value.data.splice(index, 1);
}
</script>

<style lang="scss" scoped>
.linkage-container {
  .linkage-component {
    margin: 10px 0;
    border: 1px solid #ddd;
    padding: 10px;
    position: relative;
    padding-top: 24px;

    .div-guanbi {
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 5px;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;

      .anticon {
        color: var(--text-color);
        font-size: 18px;
      }
    }
  }

  .el-select {
    margin-bottom: 10px;
  }

  .change-attr{
    margin-top: 10px;
    .attr-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 10px 0;

      .el-select {
        margin-bottom: 0;
      }

      & > div {
        width: 97px;
      }

      .icon-shanchu {
        cursor: pointer;
      }
    }
  }
}
</style>
