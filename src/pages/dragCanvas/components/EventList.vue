<template>
  <div class="event-list">
    <div class="div-events">
      <a-button @click="()=>{isShowEvent = true; isUpdate = false;}">添加事件</a-button>
      <div>
        <a-tag
          v-for="event in Object.keys(curComponent.events)"
          :key="event"
          closable
          @close="removeEvent(event)"
          color="cyan"
          class="tag"
        >
          <div style="margin-right:auto">{{ event }}</div>
          <SettingOutlined class="cursor" @click="handleRequestSetting(event)" />
        </a-tag>
      </div>
    </div>

    <!-- 选择事件 -->
    <a-modal v-model:open="isShowEvent" :footer="null">
      <a-tabs v-model:activeKey="eventActiveName">
        <a-tab-pane
          v-for="item in eventListRef"
          :key="item.key"
          :tab="item.label"
          style="padding: 20px 20px 0;"
        >
          <a-input
            v-if="item.key == 'redirect'"
            v-model:value="item.param"
            type="textarea"
            placeholder="请输入完整的 URL"
            @keydown.native.stop
          />
          <a-input
            v-if="item.key == 'alert'"
            v-model:value="item.param"
            type="textarea"
            placeholder="请输入要 alert 的内容"
            @keydown.native.stop
          />
          <a-button 
            type="primary"
            @click="()=>{ isUpdate ? updateEvent(item.key, item.param) : addEvent(item.key, item.param)}"
            style="margin-top:10px; float: right;"
          >
            确认
          </a-button>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { eventList } from '@/utils/events';
import { computed, ref, toRef } from 'vue';
import { SettingOutlined } from '@ant-design/icons-vue';

const store = useStore();

const curComponent = computed(() => store.state.curComponent);
const isShowEvent = ref(false);
const eventActiveName = ref('redirect');
const eventListRef = toRef(eventList);
const isUpdate = ref(false); // 弹出框模式 更新/新建

function addEvent(event, param) {
  isShowEvent.value = false;
  store.commit('addEvent', { event, param });
}
function removeEvent(event) {
  store.commit('removeEvent', event);
}
function updateEvent(event, param){
  isShowEvent.value = false;
  store.commit('updateEvent', { event, param });
}
function handleRequestSetting(event){
  isShowEvent.value = true;
  isUpdate.value = true; // 弹出框模式设置为更新模式
  eventActiveName.value = event;
  eventListRef[event] = curComponent.value.events[event];
}
</script>

<style lang="scss" scoped>
.event-list {
  .div-events {
    text-align: center;
    padding: 0 20px;

    .a-button {
      display: inline-block;
      margin-bottom: 10px;
    }
    .tag{
      margin: 10px auto 0 auto;
      width: 100px;

      display: flex;
      align-items: center;
      .cursor{
        cursor: pointer;
      }
      .anticon{
        height: fit-content;
      }
    }
  }
}
</style>
