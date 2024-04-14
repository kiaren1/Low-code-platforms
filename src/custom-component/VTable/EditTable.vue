<template>
  <div class="edit-table">
    <table @dblclick="onDblclick">
      <tbody>
        <tr v-for="(item, row) in tableData" :key="row">
          <td
            v-for="(e, col) in item"
            :key="col"
            :class="{ selected: curTd === row + ',' + col }"
            @click="onClick(row, col)"
          >
            <a-input
              v-if="canEdit && curTd === row + ',' + col"
              v-model:value="tableData[row][col]"
              v-focus
              @blur="onBlur"
            ></a-input>
            <span v-else>{{ e }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <a-button @click="addRow">添加新行</a-button>
      <a-button @click="addCol">添加新列</a-button>
      <a-button @click="deleteRow">删除行</a-button>
      <a-button @click="deleteCol">删除列</a-button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';

const store = useStore();

const curProperty = ref('');
const curTd = ref('');
const canEdit = ref(false);
const preCurTd = ref(''); // 失焦时 curTd 值为空，这时删除会读不到值，因此用这个变量来代替，用于删除行列

const tableData = computed(() => store.state.curComponent.propValue.data);

const vFocus = {
  inserted(el) {
    // 聚焦元素
    el.querySelector('input').focus();
  },
}

function onDblclick() {
  canEdit.value = true;
}

function onClick(row, col) {
  curTd.value = row + ',' + col;
  preCurTd.value = curTd.value;
}

function onBlur() {
  canEdit.value = false;
  curTd.value = '';
}

function deleteRow() {
  if (!preCurTd.value) {
    message.error('请先选择要删除的行');
    return;
  }

  const row = preCurTd.value.split(',')[0];
  tableData.value.splice(row, 1);
}

function addRow() {
  tableData.value.push(new Array(tableData.value[0]?.length || 1).fill(' '));
}

function addCol() {
  if (tableData.value.length) {
    tableData.value.forEach((item) => item.push(' '));
  } else {
    tableData.value.push([' ']);
  }
}

function deleteCol() {
  if (!preCurTd.value) {
    message.error('请先选择要删除的列');
    return;
  }

  const col = preCurTd.value.split(',')[1];
  tableData.value.forEach((item) => {
    item.splice(col, 1);
  })
}
</script>

<style lang="scss" scoped>
.edit-table {
  overflow: auto;
  margin-bottom: 8px;

  & > div {
    margin-top: 18px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    button {
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      text-align: center;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      font-weight: 500;
      padding: 4px 10px;
      font-size: 14px;
      border-radius: 4px;
      margin-bottom: 10px;

      &:hover {
        background: #ecf5ff;
        color: #409eff;
      }
    }
  }

  table {
    border-collapse: collapse;
    word-break: break-all;
    word-wrap: break-word;
    text-align: center;
    font-size: 12px;

    td {
      border: 1px solid #ebeef5;
      height: 40px;
      min-width: 60px;
      max-width: 80px;
    }
  }

  .selected {
    background: #ecf5ff;
    color: #409eff;
  }
}

</style>
