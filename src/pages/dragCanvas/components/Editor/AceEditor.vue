<template>
  <div class="ace">
    <div class="header">
      <a-space>
        <a-button
          class="btn"
          :icon="h(SearchOutlined)"
          @click="openSearchBox"
        >
          查找
        </a-button>
        <a-button
          class="btn"
          :icon="h(CloseOutlined)"
          @click="closeEditor"
        >
          关闭
        </a-button>
      </a-space>
    </div>
    <div class="ace-editor">
      <div ref="aceRef" class="editor" />
    </div>
    <div class="footer">
      <a-button
        type="primary"
        @click="setCode"
      >
        重置代码
      </a-button>
      <a-button
        type="success"
        @click="getCode"
      >
        保存提交
      </a-button>
    </div>
  </div>
</template>

<script setup>
import ace from 'ace-builds'
import 'ace-builds/src-min-noconflict/theme-one_dark'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/mode-json5'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import { useStore } from 'vuex';
import { computed, onMounted, ref, watch, h } from 'vue';
import { SearchOutlined, CloseOutlined} from '@ant-design/icons-vue';

const store = useStore();

const canvasStyleData = computed(() => store.state.canvasStyleData);
const curComponent = computed(() => store.state.curComponent);
const editor = ref(null);
const obj = ref(null);

const aceRef = ref();

const emits = defineEmits(['closeEditor']);

watch([curComponent, canvasStyleData], () => {
  setCode();
})

onMounted(() => {
  ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/')
  editor.value = ace.edit(aceRef.value, {
    maxLines: 40,
    minLines: 40,
    fontSize: 14,
    theme: 'ace/theme/one_dark',
    mode: 'ace/mode/json5',
    tabSize: 4,
    readOnly: false,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
  })

  obj.value = curComponent.value || canvasStyleData.value;
  editor.value.setValue(JSON.stringify(obj.value, null, 4));
});

function setCode() {
  obj.value = curComponent.value || canvasStyleData.value;
  editor.value.setValue(JSON.stringify(obj.value, null, 4));
}

function getCode() {
  const str = editor.value.getValue();
  if (!curComponent.value) {
    store.commit('aceSetCanvasData', JSON.parse(str));
  } else {
    store.commit('aceSetcurComponent', JSON.parse(str));
  }
}

function updateEditorTheme(theme) {
  editor.value.setTheme(theme);
}

function openSearchBox() {
  editor.value.execCommand('find');
}

function closeEditor() {
  emits('closeEditor');
}
</script>

<style lang="scss" scoped>
.ace {
  position: absolute;
  height: calc(100% - 80px);
  width: 550px;
  top: 63px;
  background-color: #fff;
  border: 1px solid #ddd;
  z-index: 100;
  padding: 10px;

  .header,
  .footer {
    display: flex;
    justify-content: flex-end;
  }

  .ace-editor {
    height: calc(100% - 80px);
    overflow: auto;
  }
}

.editor {
  margin: 10px 0;
}
</style>
