<template>
  <div class="attr">
    <CommonAttr></CommonAttr>
    <a-form>
      <a-form-item label="标题">
        <a-switch
          v-model:checked="option.title.show"
          active-text="显示标题"
        >
        </a-switch>
        <a-input
          v-model:value="option.title.text"
          placeholder="请输入内容"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="工具提示">
        <a-switch
          v-model:checked="option.tooltip.show"
          active-text="显示提示"
        >
        </a-switch>
      </a-form-item>
      <a-form-item label="图例">
        <a-switch
          v-model:checked="option.legend.show"
          active-text="显示图例"
        >
        </a-switch>
      </a-form-item>
      <a-form-item label="横坐标">
        <a-switch
          v-model:checked="option.xAxis.show"
          active-text="显示横坐标"
        >
        </a-switch>
      </a-form-item>
      <a-form-item>
        <a-dropdown>
          <span class="el-dropdown-link">
            更换图表类型<i class="el-icon-arrow-down el-icon--right"></i>
          </span> 
          <template v-slot:dropdown>
            <a-dropdown-menu >
              <span v-for="(chart, index) in charts" :key="index" @click="selectchart(chart.title)">
                <a-dropdown-item>{{ chart.name }}</a-dropdown-item>
              </span>
            </a-dropdown-menu>
          </template>
        </a-dropdown>
      </a-form-item>
      <a-form-item label="静态数据源">
        <a-button @click="openStaticWinbox">修改数据</a-button>
      </a-form-item>
    </a-form>

    <a-modal 
      v-model:open="dialogVisible"
      title="数据修改"
      width="75%"
    >
      <div ref="aceRef" class="ace"></div>
      <template v-slot:footer>
        <span  class="dialog-footer">
          <a-button type="primary" @click="updatedata">更新数据</a-button>
        </span>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import ace from 'ace-builds'
import 'ace-builds/src-min-noconflict/theme-chrome'
import 'ace-builds/src-min-noconflict/mode-json5'
import CommonAttr from '@/custom-component/common/CommonAttr.vue'
import { computed, reactive, ref, nextTick } from 'vue'
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
const store = useStore();

const curComponent = computed(() => store.state.curComponent);
const option = computed(() => store.state.curComponent.propValue.option);

const dialogVisible = ref(false);
const charts = reactive([
  {
    title: 'bar',
    name: '柱状图',
  },
  {
    title: 'scatter',
    name: '散点图',
  },
  {
    title: 'line',
    name: '折线图',
  },
]);
const editor = ref(null);
const aceRef = ref();

function openStaticWinbox() {
  dialogVisible.value = !dialogVisible.value;
  nextTick(() => {
    ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/');
    editor.value = ace.edit(aceRef.value, {
      maxLines: 28,
      minLines: 28,
      fontSize: 14,
      theme: 'ace/theme/chrome',
      mode: 'ace/mode/json5',
      tabSize: 4,
      readOnly: false,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
    })
    // 初始化图表数据在editor中
    const data = JSON.stringify(curComponent.value.propValue.option.series.data)
    const xAxis = JSON.stringify(curComponent.value.propValue.option.xAxis.data)
    editor.value.setValue(data + '\n' + xAxis);
  })
}

// 寻找数组[]
function findstring(str, ch1, ch2) {
  return str.substr(str.indexOf(ch1), str.indexOf(ch2) + 1)
}

// 更新数据editor中的数据修改
function updatedata() {
  const str = editor.value.getValue();
  const Arrdata = findstring(str, '[', ']');
  const ArrXAxis = findstring(str.substr(str.indexOf(']') + 1), '[', ']');
  curComponent.value.propValue.option.series.data = JSON.parse(Arrdata);
  curComponent.value.propValue.option.xAxis.data = JSON.parse(ArrXAxis);
  message.success('更新成功');
  dialogVisible.value = !dialogVisible.value;
}

// 更换表格类型
function selectchart(chart) {
  curComponent.value.propValue.option.series.type = chart;
}
</script>

<style>
.ace {
  height: 600px;
  width: 100%;
}

.attr {
  margin: 13px;
}
</style>
