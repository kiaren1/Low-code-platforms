<template>
  <div class="attr-list">
    <CommonAttr></CommonAttr>
    <a-form>
      <a-form-item label="镜像翻转">
        <div style="clear: both;">
          <a-checkbox v-model:checked="curComponent.propValue.flip.horizontal">水平翻转</a-checkbox>
          <a-checkbox v-model:checked="curComponent.propValue.flip.vertical">垂直翻转</a-checkbox>
        </div>
      </a-form-item>
      <a-form-item label="更改图片">
        <div style="clear: both;">
          <a-upload
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
          >
            <div>
              <LoadingOutlined v-if="loading"></LoadingOutlined>
              <PlusOutlined v-else></PlusOutlined>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import CommonAttr from '@/custom-component/common/CommonAttr.vue'
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { compressImage } from '@/utils/utils.js';
import { changeComponentSizeWithScale } from '@/utils/changeComponentsSizeWithScale';

const store = useStore();
const curComponent = computed(() => store.state.curComponent);

const loading = ref(false);
async function beforeUpload(file){
  // 压缩图片
  const pressedFile = await compressImage(file);

  const reader = new FileReader();
  reader.readAsDataURL(pressedFile);
  reader.onload = (res) => {
    const fileResult = res.target.result;
    const img = new Image();
    img.src = fileResult;
    img.onload = () => {
      curComponent.value.propValue.url = fileResult;
      curComponent.value.style = {
        ...curComponent.value.style,
        width: img.width,
        height: img.height,
      }

      // 根据画面比例修改组件样式比例
      changeComponentSizeWithScale(curComponent.value);
    }
    
  }
}
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
