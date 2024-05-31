<template>
  <main class="publish-table">
    <a-table
      :dataSource="tableList" 
      :columns="columns"
      @change="handleTableChange"
      :pagination="pagination"
      :loading="loading"
      :scroll="{ y: '70vh' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'coverPic'">
          <a-image
            :height="70"
            :src="record.coverPic"
          />
        </template>
        <template v-if="column.key === 'path'">
          <router-link :to="`/works?projectId=${record.projectId}`">
            {{ `${basePath}/#/works?projectId=${record.projectId}` }}
          </router-link>
        </template>
        <template v-else-if="column.key === 'action'">
          <div class="row">
            <a-button type="primary" @click="handleToSetting(record.projectId, record.name)">编辑</a-button>
            <a-button v-if="!isPublished" @click="handlePublish(record.projectId)">发布</a-button>
            <a-button 
              v-if="isPublished" 
              @click="()=>{router.push(`/works?projectId=${record.projectId}`)}"
            >前往</a-button>
            <a-button danger v-if="isPublished" @click="handleUnPublish(record.projectId)">下架</a-button>
          </div>
        </template>
      </template>
    </a-table>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, toRefs } from "vue";
import { cloneDeep } from 'lodash';
import projectManagement from '@api/projectManagement.js';
import moment from 'moment';
import { useStore } from 'vuex';
import eventBus from '@utils/eventBus';
import { RouterLink, useRouter } from 'vue-router';
import { message } from "ant-design-vue";
const store = useStore();
const router = useRouter();

const ProjectStatusMap = {
  Setting: '0',
  Publishing: '1',
  Deleted: '2',
}

const props = defineProps({
  isPublished: {
    type: Boolean,
    default: false
  }
});
const { isPublished } = toRefs(props);

const tableList = ref([]);
const basicColumns = reactive([
  {
    title: '项目名',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: 150
  },
  {
    title: '预览图',
    dataIndex: 'coverPic',
    key: 'coverPic',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: isPublished.value ? 250 : 170,
    fixed: 'right'
  },
])
const columns = computed(() => {
  if(isPublished.value){
    const arr = cloneDeep(basicColumns);
    arr.splice(2, 0, {
      title: '访问路径',
      dataIndex: 'path',
      key: 'path',
    })
    return arr;
  }else{
    return cloneDeep(basicColumns);
  }
});
const loading = ref(false);
const pagination = ref({
  total: 10,
  current: 1,
  pageSize: 10
});

onMounted(() => {
  refreshData();
  eventBus.on('login', refreshData);
  eventBus.on('refreash', refreshData);
});

onUnmounted(() => {
  eventBus.off('login', refreshData);
  eventBus.off('refreash', refreshData);
})

function refreshData(){
  handleTableChange(pagination.value);
}

async function handleTableChange(nextPagination){
  loading.value = true;
  const params = {
    status: isPublished.value ? ProjectStatusMap.Publishing : ProjectStatusMap.Setting,
    pageSize: nextPagination.pageSize,
    pageNumber: nextPagination.current - 1
  }
  const { total, projectList } = await projectManagement.getProjectList(params);
  loading.value = false;
  for (const projectItem of projectList) {
    projectItem.createTime = moment(projectItem.createTime).format('YYYY-MM-DD HH:mm');
    projectItem.updateTime = moment(projectItem.updateTime).format('YYYY-MM-DD HH:mm');
  }
  tableList.value = projectList;
  pagination.value = {
    total,
    current: nextPagination.current,
    pageSize: nextPagination.pageSize
  };
}

const basePath = computed(() => {
  const fullPath = window.location.href;
  const regex = /(.*)\/#/;
  const match = fullPath.match(regex);
  if (match) {
    return match[1];
  }
  return '';
});

async function handlePublish(projectId){
  loading.value = true;
  await projectManagement.publish({
    key: projectId
  });
  message.success('发布成功');
  eventBus.emit('refreash');
}
async function handleUnPublish(projectId){
  loading.value = true;
  await projectManagement.unPublish(projectId);
  message.success('下架成功');
  eventBus.emit('refreash');
}
function handleToSetting(key, name){
  store.commit('setProject', {
    key,
    name,
    status: isPublished.value?ProjectStatusMap.Publishing:ProjectStatusMap.Setting,
  });  
  router.push('/');
}

</script>

<style lang="less" scoped>
.publish-table{
  height: 100%;
  width: 100%;

  .row{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
}
</style>