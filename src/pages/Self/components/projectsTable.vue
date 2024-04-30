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
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="primary">编辑</a-button>
            <a-button v-if="!isPublished">发布</a-button>
            <a-button v-if="isPublished">前往</a-button>
            <a-button danger v-if="isPublished">下架</a-button>
          </a-space>
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
const store = useStore();

const userData = computed(() => store.state.user.userData);

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
});

onMounted(() => {
  refreshData();
  eventBus.on('login', refreshData);
});

onUnmounted(() => {
  eventBus.off('login', refreshData);
})

function refreshData(){
  handleTableChange({
    ...pagination.value,
    pageSize: 10
  });
}

async function handleTableChange(nextPagination){
  const params = {
    status: isPublished.value ? ProjectStatusMap.Publishing : ProjectStatusMap.Setting,
    pageSize: nextPagination.pageSize,
    pageNumber: nextPagination.current - 1
  }
  const { total, projectList } = await projectManagement.getProjectList(params);
  for (const projectItem of projectList) {
    projectItem.createTime = moment(projectItem.createTime).format('YY-MM-DD HH:mm:ss');
    projectItem.updateTime = moment(projectItem.updateTime).format('YY-MM-DD HH:mm:ss');
  }
  tableList.value = projectList;
  pagination.value = {
    total,
    current: nextPagination.current,
  };
}



</script>

<style lang="less" scoped>
.publish-table{
  height: 100%;
  width: 100%;
}
</style>