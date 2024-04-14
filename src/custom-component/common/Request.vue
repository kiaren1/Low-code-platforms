<template>
  <div class="request-container">
    <a-form layout="vertical">
      <a-form-item label="请求地址">
        <a-input v-model:value.trim="request.url" @blur="validateURL" addon-before="Https://" />
      </a-form-item>
      <a-form-item label="请求方法">
        <a-select v-model:value="request.method">
          <a-select-option v-for="item in methodOptions" :key="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="请求参数">
        <a-select v-model:value="request.paramType" placeholder="参数类型" @change="onChnage">
          <a-select-option v-for="item in dataOptions" :key="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
        <div v-if="request.paramType === 'array'" class="param-container">
          <p>数据项</p>
          <div v-for="(item, index) in request.data" :key="index" class="div-delete">
            <a-input
              v-model:value="request.data[index]"
              placeholder="请输入参数值"
            />
            <DeleteOutlined class="icon-shanchu" @click="deleteData(index)" />
            <!-- <span class="iconfont icon-shanchu" @click="deleteData(index)"></span> -->
          </div>

          <el-button @click="addArrayData">添加</el-button>
        </div>
        <div v-else-if="request.paramType === 'string' || request.paramType === 'object'" class="param-container">
          <p>数据项</p>
          <div v-for="(item, index) in request.data" :key="index" class="param-object-container">
            <a-input-group compact>
              <a-input v-model:value="item[0]" placeholder="参数名" style="width: 50%"></a-input>
              <a-input v-model:value="item[1]" placeholder="参数值" style="width: 50%"></a-input>
            </a-input-group>
            <DeleteOutlined class="icon-shanchu" @click="deleteData(index)" />
            <!-- <span class="iconfont icon-shanchu" @click="deleteData(index)"></span> -->
          </div>
          <a-button @click="addData">添加</a-button>
        </div>
      </a-form-item>
      <a-form-item label="定时触发">
        <a-switch v-model:checked="request.series"></a-switch>
      </a-form-item>
      <div v-if="request.series" class="timer">
        <div style="margin-top:5px">触发间隔（毫秒）</div>
        <a-input v-model:value="request.time" type="number"></a-input>
        <div style="margin-top:5px">触发次数（0 为无限）</div>
        <a-input v-model:value="request.requestCount" type="number"></a-input>
      </div>
    </a-form>
  </div>
</template>

<script setup>
import { urlRE, getURL } from '@/utils/request';
import { computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
const store = useStore();

const request = computed(() => store.state.curComponent.request);
const methodOptions = reactive([
  'GET',
  'POST',
  'PUT',
  'DELETE',
]);
const dataOptions = reactive([
  'object',
  'array',
  'string',
]);

function addArrayData() {
  request.value.data.push('');
}

function addData() {
  request.value.data.push(['', '']);
}

function deleteData(index) {
  request.value.data.splice(index, 1);
}

function onChnage() {
  if (request.value.paramType === 'array') {
    request.value.data = [''];
  } else {
    request.value.data = [['', '']];
  }
}

function validateURL() {
  const url = request.value.url;
  if (url && /^\d+$/.test(url) || !urlRE.test(getURL(url))) {
    message.error('请输入正确的 URL');
  }
}
</script>

<style lang="scss" scoped>
.request-container {
  .param-container {
    margin-top: 10px;

    .ant-btn {
      margin-top: 10px;
    }

    .param-object-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;

      .ant-btn {
        margin: 0;
        margin-left: 8px;
      }
    }

    .div-delete {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;

      .ant-btn {
        margin: 0;
        margin-left: 8px;
      }
    }
  }

  .icon-shanchu {
    cursor: pointer;
    margin-left: 10px;
  }
  .timer{
    margin-top: -10px;
  }
}
</style>
