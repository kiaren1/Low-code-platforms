<template>
  <div class="login">
    <a-form  
      :model="modifyForm"
      name="basic"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 15 }"
      @finish="onFinish"
      :rules="rules"
      labelAlign="left"
    >
      <a-form-item
        label="用户名"
        name="username"
        :validate-status="usernameStatus.status"
        :help="usernameStatus.help"
      >
        <a-input v-model:value="modifyForm.username" :bordered="false" @change="handleUsernameChange"/>
      </a-form-item>
      <a-form-item
        label="密码"
        name="password"
      >
        <a-input-password v-model:value="modifyForm.password" :bordered="false" />
      </a-form-item>
      <a-form-item
        label="确认密码"
        name="rePassword"
      >
        <a-input-password :disabled="!modifyForm.password" v-model:value="modifyForm.rePassword" :bordered="false" />
      </a-form-item>

      <div class="btn-area">
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" html-type="submit">注册</a-button>
      </div>
    </a-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from 'vuex';
import UserApi from '@api/userApi.js';
import { message } from 'ant-design-vue';
import eventBus from '@utils/eventBus';
const store = useStore();

const modifyForm = ref({
  username: '',
  password: '',
  rePassword: '',
});

const rules = ref({
  username: [{
    type: 'string',
    required: true,
    message: '请输入用户名'
  }],
  password: [{
    type: 'string',
    required: true,
    message: '请输入密码'
  }],
  rePassword: [{
    type: 'string',
    required: true,
    message: '请输入再次密码'
  }, 
  {
    validator(rule, value, callback) {
      if(value !== modifyForm.value.password) {callback('第二次输入与第一次密码不同');}
      callback();
    },
  }]
})

const usernameStatus = ref({
  status: undefined,
  help: null
});

function cancel(){
  store.commit('changeLoginWindowState', {openLogin: false});
}
function handleUsernameChange(){
  usernameStatus.value = {
    status: undefined,
    help: null
  }
}
// 提交注册信息
async function onFinish(){
  try{
    await UserApi.signup(modifyForm.value.username, modifyForm.value.password);
    message.success({
      content: '注册成功',
      duration: 2,
    })
    store.commit('changeLoginWindowState', { openLogin: false });
    eventBus.emit('login');
  }catch(e){
    usernameStatus.value = {
      status: 'error',
      help: '用户名已被占用'
    }
  }
}
</script>

<style lang="less" scoped>
.login{
  :deep(.ant-form-item-control-input-content) {
    border-bottom: 1px solid var(--border-color);
  }
  .btn-area{
    width: fit-content;
    margin: 40px 0 0 auto;
    button{
      margin-left: 10px;
    }
  }

}
</style>