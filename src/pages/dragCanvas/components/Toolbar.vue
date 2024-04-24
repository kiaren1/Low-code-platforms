<template>
  <div>
    <div :class="store.state.isDarkMode ? 'dark toolbar' : 'toolbar'">
      <a-button @click="onAceEditorChange">JSON</a-button>
      <a-button @click="onImportJSON">导入</a-button>
      <a-button @click="onExportJSON">导出</a-button>
      <a-button @click="undo">撤销</a-button>
      <a-button @click="redo">反撤销</a-button>
      <a-upload
        accept="image/*"
        :showUploadList="false"
        :beforeUpload="handleUploadImage"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          上传图片
        </a-button>
      </a-upload>

      <a-button @click="preview(false)">预览</a-button>
      <a-button @click="save">保存</a-button>
      <a-button @click="clearCanvas">清空画布</a-button>
      <a-button :disabled="!areaData.components.length" @click="compose">组合</a-button>
      <a-button 
        :disabled="!curComponent || curComponent.isLock || curComponent.component != 'Group'"
        @click="decompose"
      >拆分</a-button>

      <a-button :disabled="!curComponent || curComponent.isLock" @click="lock">锁定</a-button>
      <a-button :disabled="!curComponent || !curComponent.isLock" @click="unlock">解锁</a-button>
      <a-button @click="preview(true)">截图</a-button>

      <div class="canvas-config">
        <span>画布大小</span>
        <a-input v-model:value="canvasStyleData.width"/>
        <span style="margin-left:5px">*</span>
        <a-input v-model:value="canvasStyleData.height"/>
      </div>
      <div class="canvas-config">
        <span>画布比例</span>
        <a-input v-model:value.lazy.number="canvasStyleData.scale" min="0"/> %
      </div>
      <a-switch 
        class="dark-mode-switch"
        v-model:checked="isDarkMode" 
      >
        <template #checkedChildren>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-taiyang"></use>
          </svg>
        </template>
        <template #unCheckedChildren>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-yueliang"></use>
          </svg>
        </template>
      </a-switch>
    </div>

    <!-- 预览 -->
    <Preview v-model:show="isShowPreview" :is-screenshot="isScreenshot" @close="handlePreviewChange" />
    <AceEditor v-if="isShowAceEditor" @closeEditor="closeEditor" />

    <a-modal v-model:open="isShowDialog" :title="isExport ? '导出数据' : '导入数据'" width="1000px">
      <a-textarea v-model:value="jsonData" placeholder="请输入 JSON 数据或拖放文件" allow-clear :rows="20" @drop="handleFileDrop" />
      <template #footer>
        <div class="dialog-footer">
          <a-button @click="isShowDialog = false">取 消</a-button>
          <a-upload
            v-show="!isExport"
            :before-upload="beforeUpload"
            :showUploadList="false"
            accept="application/json"
          >
            <a-button type="primary">选择 JSON 文件</a-button>
          </a-upload>
          <a-button type="primary" @click="processJSON">确 定</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { toRefs, ref, watch, computed } from "vue";
import { UploadOutlined } from '@ant-design/icons-vue';
import { commonStyle, commonAttr } from '@/custom-component/component-list';
import generateID from '@/utils/generateID';
import { message } from 'ant-design-vue';
import AceEditor from './Editor/AceEditor.vue';
import Preview from './Editor/Preview.vue';
import { $, compressImage } from '@/utils/utils';
import changeComponentsSizeWithScale, { changeComponentSizeWithScale } from '@/utils/changeComponentsSizeWithScale';
const store = useStore();

const { componentData, canvasStyleData, isDarkMode, curComponent } = toRefs(store.state);

const areaData = computed(() => store.state.compose.areaData);

const jsonData = ref(''); // 导出/导入的JSON数据
const isShowDialog = ref(false);
const isExport = ref(false); // 导出/导入
const isShowAceEditor = ref(false); // 是否展示JSON数据栏

const isScreenshot = ref(false);
const isShowPreview = ref(false);

// 把风格明暗改变同步到画布样式上
watch(isDarkMode, (newValue) => {
  store.commit('toggleDarkMode', newValue);
})

function onAceEditorChange() {
  isShowAceEditor.value = !isShowAceEditor.value;
}
function closeEditor(){
  isShowAceEditor.value = false;
}
function onImportJSON(){ // 导入
  jsonData.value = '';
  isExport.value = false;
  isShowDialog.value = true;
}
function onExportJSON(){ // 导出
  isShowDialog.value = true;
  isExport.value = true;
  jsonData.value = JSON.stringify(componentData.value, null, 4);
}
function clearCanvas(){
  store.commit('setCurComponent', { component: null, index: null });
  store.commit('setComponentData', []);
  store.commit('recordSnapshot');
}
function undo(){
  store.commit('undo');
}
function redo(){
  store.commit('redo')
}
function lock() {
  store.commit('lock');
}
function unlock() {
  store.commit('unlock');
}
function compose() {
  store.commit('compose');
  store.commit('recordSnapshot');
}

function decompose() {
  store.commit('decompose');
  store.commit('recordSnapshot');
}

async function handleUploadImage(file){
  // 压缩图片
  const pressedFile = await compressImage(file);

  const reader = new FileReader();
  reader.readAsDataURL(pressedFile);
  reader.onload = (res) => {
    const fileResult = res.target.result;
    const img = new Image();
    img.onload = () => {
      const component = {
        ...commonAttr,
        id: generateID(),
        component: 'Picture',
        label: '图片',
        icon: "tupian",
        propValue: {
          url: fileResult,
          flip: {
            horizontal: false,
            vertical: false,
          },
        },
        style: {
          ...commonStyle,
          top: 0,
          left: 0,
          width: img.width,
          height: img.height,
        },
      }

      // 根据画面比例修改组件样式比例
      changeComponentSizeWithScale(component);

      store.commit('addComponent', { component });
      store.commit('recordSnapshot');
    }

    img.src = fileResult
  }
}

function processJSON(){ // 导入/导出确认
  try {
    // 先校验数据
    const data = JSON.parse(jsonData.value)
    if (!Array.isArray(data)) {
      message.error('数据格式错误，组件数据必须是一个数组');
      return;
    }
    
    if (isExport.value) { // 导出模式
      downloadFileUtil(jsonData.value, 'application/json', 'data.json');
    } else { // 导入模式
      store.commit('setComponentData', data)
    }
    
    isShowDialog.value = false
  } catch (error) {
    message.error('数据格式错误，请传入合法的 JSON 格式数据')            
  }
}

// 将data包装成文件然后下载下来
function downloadFileUtil(data, type, fileName = '') {
  const url = window.URL.createObjectURL(new Blob([data], { type }))
  const link = document.createElement('a')

  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

function readFile(file){
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function(e) {
    const content = e.target.result;
    jsonData.value = content;
  }
}

watch(() => canvasStyleData.value.scale, (newValue, oldValue) => {
  if(newValue < 0) {
    canvasStyleData.value.scale = 1;
    /* eslint-disable-next-line */
    newValue = 1;
  }
  changeComponentsSizeWithScale(canvasStyleData.value.scale, oldValue);
})

// 处理文件拖放
function handleFileDrop(event){
  event.preventDefault(); // 避免浏览器默认行为
  const file = event.dataTransfer.files[0];
  if(file.type !== 'application/json') {
    message.error('请传入json文件');
    return;
  }
  readFile(file);
}

function beforeUpload(file){
  if(file.type !== 'application/json') {
    message.error('请传入json文件');
    return false;
  }
  readFile(file);
  return false;
}

function preview(isScreenshotVal) {
  isScreenshot.value = isScreenshotVal;
  isShowPreview.value = true;
  store.commit('setEditMode', 'preview');
}

function handlePreviewChange() {
  store.commit('setEditMode', 'edit');
}
</script>

<style lang="scss">
.toolbar {
  padding: 15px 10px;
  white-space: nowrap;
  overflow-x: auto;
  background: var(--main-bg-color);
  border-color: var(--ace-bg-color);
  border-bottom: 1px solid var(--border-color);

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;

  .ant-btn{
    margin-left: 10px;
  }

  .canvas-config {
    display: inline-block;
    margin-left: 10px;
    font-size: 14px;
    color: var(--text-color);

    .ant-input {
      width: 50px;
      margin-left: 4px;
      outline: none;
      padding: 0 5px;
      border: 1px solid var(--border-color);
      color: #606266;
    }

    span {
      margin-left: 10px;
    }
  }

  .insert {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid var(--toolbar-border-color);
    color: var(--text-color);
    appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-left: 10px;
  }

  .insert {
    background: var(--main-bg-color);
    border: 1px solid var(--toolbar-border-color);
    color: var(--button-text-color);

    &:active {
      background: var(--button-active-text-color);
      border-color: var(--actived-bg-color);
      color: var(--main-bg-color);
    }

    &:hover {
      background: var(--button-active-text-color);
      border-color: var(--actived-bg-color);
      color: var(--main-bg-color);
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;

  & > * {
    margin-left: 10px;
  }
}
</style>
