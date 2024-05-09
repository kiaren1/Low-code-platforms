<template>
  <main class="work-page">
    <div class="content">
      <Canvas></Canvas>
    </div>
  </main>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import ProjectManagement from '@api/projectManagement.js';
import { useStore } from 'vuex';
import Canvas from './components/canvas.vue';

const store = useStore();
const route = useRoute();

onMounted(() => {
  store.commit('setEditMode', 'preview');
  refreash();
})
onUnmounted(() => {
  store.commit('setEditMode', 'edit');
})

async function refreash(){
  await ProjectManagement.getProjectData(route.query.projectId, false);
}

</script>

<style lang="less" scoped>
.work-page{
  width: 100%;
  min-height: 100vh;
  background-color: white;
  .content{
    width: fit-content;
    margin: 0 auto;
  }
}
</style>
