<template>
  <div class="app">
    <router-view />
    <FSA v-if="showFsa" @animationEnd="closeFsa"></FSA>
    <Menu></Menu>
    <LoginWindow></LoginWindow>
  </div>
</template>

<script setup>
import FSA from '@components/FSA.vue';
import LoginWindow from '@components/LoginWindow/index.vue'
import { onMounted, ref } from 'vue';
import Menu from '@components/MenuCircle.vue';
import UserApi from '@api/userApi.js';
const showFsa = ref(true);

function closeFsa(){
  showFsa.value = false;
}

onMounted(()=>{
  UserApi.switch();
})

</script>

<style lang="less">

</style>
