<template>
  <a-modal v-model:open="openLogin" @cancel="handleCancel" :footer="null" >
    <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" />
    <article class="content">
      <section class="cube">
        <RotateCube 
          size="80" 
          :innerColor="current[0] === 'signup' && '#E59B8B'" 
          :outerColor="current[0] === 'signup' && '#C4AF9B2d'"/>
      </section>
      <section class="form">
        <Login v-if="current[0] === 'login'"></Login>
        <Signup v-if="current[0] === 'signup'"></Signup>
      </section>
    </article>
  </a-modal>
</template>

<script setup>
import { h, ref, computed } from 'vue';
import {useStore} from 'vuex';
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';
import RotateCube from '@components/RotateCube.vue'
import { UserOutlined, AppstoreAddOutlined } from '@ant-design/icons-vue';
const store = useStore();
const openLogin = computed(() => store.state.openLogin);

const current = ref(['login']);
const items = ref([{
  key: 'login',
  icon: () => h(UserOutlined),
  label: '登录',
  title: '登录',
},
{
  key: 'signup',
  icon: () => h(AppstoreAddOutlined),
  label: '注册',
  title: '注册',
}]);

function handleCancel(){
  store.commit('changeLoginWindowState', {openLogin: false});
}
</script>

<style lang="less" scoped>
.content{
  padding: 30px 0;
  display: flex;
  flex-direction: row;
  // align-items: center;
  .cube{
    margin-left: -20px;
  }
  .form{
    flex: 1;
  }
}
</style>