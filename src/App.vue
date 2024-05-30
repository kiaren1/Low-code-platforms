<template>
  <div class="app">
    <router-view />
    <FSA v-if="showFsa" @animationEnd="closeFsa"></FSA>
    <Menu v-if="showMenu"></Menu>
    <LoginWindow></LoginWindow>
  </div>
</template>

<script setup>
import FSA from '@components/FSA.vue';
import LoginWindow from '@components/LoginWindow/index.vue'
import { onMounted, ref, watch, computed } from 'vue';
import Menu from '@components/MenuCircle.vue';
import UserApi from '@api/userApi.js';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();

const showMenu = ref(false);

const projectKey = computed(() => store.state.projectKey);

const showFsa = ref(false);

onMounted(() => {
  const fullPath = window.location.href;
  const regex = /\/#\/works/;
  if(!regex.test(fullPath)) { // 是内容页
    showFsa.value = true;
    showMenu.value = true;
  }else{ // 是展示页
    showMenu.value = false;
  }
});
watch(() => route.path, (newValue) => {
  if(newValue !== '/works') {
    showMenu.value = true;
  }
})

function closeFsa(){
  showFsa.value = false;
}

onMounted(() => {
  if(localStorage.getItem('token')) {UserApi.switch();}
})

// 记录下最近浏览的项目key，下次打开的时候拉这个
watch(projectKey, (newKey) => {
  if(newKey){
    localStorage.setItem('currentProjectKey', newKey);
  }else{
    localStorage.removeItem('currentProjectKey')
  }
});

</script>

<style lang="less">

</style>
