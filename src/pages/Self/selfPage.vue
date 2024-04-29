<template>
  <div class="self-page" id="selfPageRef">
    <main class="content">
      <header class="user-detail">
        <a-form>
          <a-space size="large">
            <a-form-item label="昵称">
              <a-input v-model:value="modifyForm.nickName"></a-input>
            </a-form-item>
            <a-form-item label="用户名">
              <a-input v-model:value="userData.userName" disabled></a-input>
            </a-form-item>
            <a-button type="primary" v-if="showSubmit" @click="updateUser">保存修改</a-button>
          </a-space>
        </a-form>
      </header>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import userApi from '@api/userApi.js';
import { message } from 'ant-design-vue';
// import createRibbons from '@components/coloredRibbon.js';

const store = useStore();

const userData = computed(() => store.state.user.userData);

const modifyForm = reactive({
  nickName: '' // 昵称
});
onMounted(() => {
  modifyForm.nickName = userData.value.nickName;
})
watch(() => userData.value.nickName, (newValue) => {modifyForm.nickName = newValue});

// 只有有修改内容时才展示保存按钮
const showSubmit = computed(() => {
  if(modifyForm.nickName && modifyForm.nickName!==userData.value.nickName) {return true;}
  return false
})

async function updateUser(){
  await userApi.updateNickName(modifyForm.nickName);
  message.success('更新成功');
}


</script>

<style lang="less" scoped>
.self-page{
  .content{
    width: 70%;
    height: 100vh;
    overflow: auto;
    margin: 0 auto;
    background-color: white;
    box-sizing: border-box;
    border-radius: 10px;

    .user-detail{
      height: fit-content;
      padding: 15px 40px;
      :deep(.ant-form){
        .ant-form-item{
          margin: 0;
        }
      }
    }
  }
}

</style>