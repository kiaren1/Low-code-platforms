<template>
  <div class="self-page" ref="selfPageRef">
    <div class="scrollBar" @scroll="handleScrollShow" :class="scrollBarClass">
      <main class="content">
        <header class="user-detail">
          <a-form>
            <a-space size="large">
              <a-form-item label="昵称">
                <a-input v-model:value="modifyForm.nickName"></a-input>
              </a-form-item>
              <a-form-item label="用户名">
                <a-input v-model:value="userData.userName" disabled placeholder="请登录"></a-input>
              </a-form-item>
              <a-button type="primary" v-if="showSubmit" @click="updateUser">保存修改</a-button>
            </a-space>
          </a-form>
        </header>
        <!-- 已发布 -->
        <a-card title="已发布项目" class="card">
          <ProjectsTable isPublished></ProjectsTable>
        </a-card>
        <!-- 编辑中 -->
        <a-card title="编辑中项目" class="card">
          <ProjectsTable></ProjectsTable>
        </a-card>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import userApi from '@api/userApi.js';
import { message } from 'ant-design-vue';
import ProjectsTable from './components/projectsTable.vue';
import createRibbons from '@components/coloredRibbon.js';

const store = useStore();

const userData = computed(() => store.state.user.userData);

const modifyForm = reactive({
  nickName: '' // 昵称
});

const selfPageRef = ref();
onMounted(() => {
  modifyForm.nickName = userData.value.nickName;
  createRibbons({
    body_: selfPageRef.value,
    color: '#EAE8E9',
    horizontalSpeed: 250,
  });
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

// 处理滚动条隐藏逻辑
const scrollBarClass = ref('hide');
const handleScrollShow = (() => {
  let ticking = null;
  let hideTimer = null;
  return function (){
    if (ticking) {return;}
    ticking = requestAnimationFrame(() => {
      // 思路：每次滚动都会让滚动条显示1s，没滚动时自动就隐藏了
      ticking = null;
      scrollBarClass.value = 'show';
      if(hideTimer) {
        clearTimeout(hideTimer); 
      }
      hideTimer = setTimeout(() => {
        scrollBarClass.value = 'hide';
      }, 1000);
    })
  }
})();
</script>

<style lang="less" scoped>
.self-page{
  .scrollBar{
    width: 100%;
    height: 100vh;
    overflow: auto;

    &::-webkit-scrollbar-thumb{
      background-color:#777777;
      width: 13px;
    }
  }
  .show::-webkit-scrollbar-thumb{
    background-color:#777777;
  }
  .hide::-webkit-scrollbar-thumb{
    background-color:transparent;
  }
  .content{
    width: 70%;
    margin: 0 auto;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;

    .user-detail{
      height: fit-content;
      padding: 15px 40px;
      background-color: #EABCA8;
      border-radius: 18px;
      :deep(.ant-form){
        .ant-form-item{
          margin: 0;
        }
      }
    }

    .card{
      flex: 1;
      margin-top: 10px;
      :deep(.ant-card-body){
        padding: 0 20px;
      }
    }
  }
}

</style>