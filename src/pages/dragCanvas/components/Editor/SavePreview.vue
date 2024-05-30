<template>
  <a-modal v-model:open="open" width="fit-content" :title="title" style="top: 55px">
    <div ref="containerRef" class="content">
      <div class="canvas-container">
        <div
          v-if="open"
          class="canvas"
          :style="{
            ...getCanvasStyle(canvasStyleData),
            width: changeStyleWithScale(canvasStyleData.width) + 'px',
            height: changeStyleWithScale(canvasStyleData.height) + 'px',
          }"
        >
          <ComponentWrapper
            v-for="(item, index) in copyData"
            :key="index"
            :config="item"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <a-form :model="modifyForm" :rules="rules" @finish="handleSubmit">
        <div class="footer">
          <a-form-item class="nameInput" name="projectName">
            <a-input v-model:value="modifyForm.projectName" placeholder="请输入项目名称"></a-input>
          </a-form-item>
          <a-button @click="close" style="margin-right: 10px">取消</a-button>
          <a-button type="primary" html-type="submit">确定</a-button>
        </div>
      </a-form>
    </template>
  </a-modal>
</template>

<script setup>
import { getCanvasStyle } from '@/utils/style';
import { useStore } from 'vuex';
import ComponentWrapper from '@/components/canvasComponents/ComponentWrapper.vue';
import { changeStyleWithScale } from '@/utils/translate';
import { toPng } from 'html-to-image';
import { cloneDeep } from 'lodash';
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue';
import projectManagement from '@api/projectManagement.js';
import { message } from 'ant-design-vue';
import { compressDataUrl } from '@/utils/utils.js';

const store = useStore();
const emits = defineEmits(['close', 'update:show']);

const props = defineProps({
  savePreviewMode: {
    type: String,
    default: 'save',
  },
  show: {
    type: Boolean,
    default: false,
  }
});
const { savePreviewMode, show } = toRefs(props);

const containerRef = ref();

const componentData = computed(() => store.state.componentData);
const canvasStyleData = computed(() => store.state.canvasStyleData);
const projectName = computed(() => store.state.projectName);
const projectKey = computed(() => store.state.projectKey);

const modifyForm = reactive({
  jsonData: '',
  projectKey: null,
  projectName: null,
});
const rules = reactive({
  projectName: [{
    type: 'string',
    required: true,
    message: '请输入项目名称'
  },
  {
    type: 'string',
    validator: (rule, value) => {
      if(savePreviewMode.value === 'saveAs'){
        if(value === projectName.value) {
          return Promise.reject(new Error('另存项目名请和原项目名不同'));
        }
      }
      return Promise.resolve();
    }
  }]
})

const title = computed(() => {
  switch (savePreviewMode.value){
    case 'save':
      return '保存预览';
    case 'saveAs':
      return '另存预览';
    case 'publish':
      return '发布预览';
    default:
      return '预览';
  }
})

const copyData = ref([]);
const open = ref(show.value);
watch(show, (newValue) => {
  open.value = newValue;
});
watch(open, (newValue) => {
  emits('update:show', newValue);
  if(newValue === false){
    emits('close');
  }
});
watch(open, () => {
  if(open.value === true){
    refreash();
  }
})

onMounted(() => {
  refreash();
});

function refreash(){
  copyData.value = cloneDeep(componentData.value);
  modifyForm.jsonData = JSON.stringify({
    componentData: componentData.value,
    canvasStyle: canvasStyleData.value
  });
  modifyForm.projectKey = projectKey.value || null;
  modifyForm.projectName = projectName.value || null;
}

function close() {
  open.value = false;
}

async function htmlToImage() {
  try{
    const dataUrl = await toPng(containerRef.value.querySelector('.canvas'));
    return dataUrl;
  }catch(error){
    console.error('图片获取失败', error);
    return new Error('图片获取失败');
  }
}

async function handleSubmit(){
  message.info('保存中', 5000);
  try{
    const dataUrl = await htmlToImage();
    const previewPicDataUrl = await compressDataUrl(dataUrl);

    switch (savePreviewMode.value){
      case 'save':{ // 保存，可能是有key的更新，也可能是无key新建
        let newProjectData = null;
        if(modifyForm.projectKey){
          newProjectData = await projectManagement.update({
            key: modifyForm.projectKey,
            projectName: modifyForm.projectName,
            jsonData: modifyForm.jsonData,
            picUrl: previewPicDataUrl
          });
        }else {
          newProjectData = await projectManagement.create({
            projectName: modifyForm.projectName,
            jsonData: modifyForm.jsonData,
            picUrl: previewPicDataUrl
          });
        }
        store.commit('setProject', {
          key: newProjectData.projectId,
          name: newProjectData.name,
          status: newProjectData.status
        });
        message.destroy();
        message.success('保存成功');
        break;
      }
      case 'saveAs':{ // 另存，就是create
        const newProjectData = await projectManagement.create({
          projectName: modifyForm.projectName,
          jsonData: modifyForm.jsonData,
          picUrl: previewPicDataUrl
        });
        store.commit('setProject', {
          key: newProjectData.projectId,
          name: newProjectData.name,
          status: newProjectData.status
        });
        message.success('另存成功');
        break;
      }
      case 'publish':{ // 发布，可能是有key的发布，也可能是没有保存过的直接发布
        const newProjectData = await projectManagement.publish({
          key: modifyForm.projectKey,
          projectName: modifyForm.projectName,
          jsonData: modifyForm.jsonData,
          picUrl: previewPicDataUrl
        });
        store.commit('setProject', {
          key: newProjectData.projectId,
          name: newProjectData.name,
          status: newProjectData.status
        });
        message.success('发布成功');
        break;
      }
    }
    setTimeout(close, 500);
  }catch(e){
    console.error(e);
  }
}
</script>

<style lang="scss" scoped>
.content {
  .canvas-container {
    overflow: auto;
    .canvas {
      background: #fff;
      position: relative;
      margin: auto;
      overflow: hidden;
    }
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
.footer{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 20px 10px 10px;
  // margin-top: -20px;
  border-top: 1px solid var(--border-color);
  .nameInput{
    width: 75%;
    margin: auto;
  }

  :deep(.ant-form-item-explain-error){
    position: absolute;
    right: 0;
  }
}
</style>
