<template>
  <article class="menu" :class="isMenuRight ? 'right':'left'">
    <div class="main-icon menu-item">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-caidan"></use>
      </svg>
    </div>
    <div class="menu-horizontal">
      <a-button
        shape="circle"
        v-for="(item, index) in menuHorizontalItemsCmp"
        :key="item.key"
        class="menu-item item-horizontal"
        :style="{
          'background-color': item.color,
          'z-index': 50-index,
          'margin-right': '-60px',
        }"
        @click="item.clicked">
        <a-tooltip :color="item.color">
          <template #title>
            {{ item.hint }}
          </template>
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="item.icon"></use>
          </svg>
        </a-tooltip>
      </a-button>
    </div>
    <div class="menu-vertical">
      <a-button
        shape="circle"
        v-for="(item, index) in menuVerticalItemsCmp" :key="item.key"
        class="menu-item item-vertical"
        :style="{
          'background-color': item.color,
          'z-index': 50-index,
          'margin-Top': '-60px',
        }"
        @click="item.clicked">
        <a-tooltip :color="item.color" placement="left">
          <template #title>
            {{ item.hint }}
          </template>
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="item.icon"></use>
          </svg>
        </a-tooltip>
      </a-button>
    </div>
  </article>
</template>

<style lang="less" scoped>
.right{
  right: 50px;
}
.left{
  right: 320px;
}
.menu{
  position: fixed;
  margin: auto;
  z-index: 100;
  top: 70px;
  transition: all 0.3s ease-in-out;
  .main-icon{
    position: absolute;
    border-radius: 50%;
    background-color: #E0C068;
    z-index: 100;
    right: 0;
    top: 0;
    box-shadow: 3px 2px 5px rgba(0, 0, 0, 0.3);
  }
  .menu-item{
    height: 60px;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all ease-out 250ms;
  }
  .icon{
    font-size: 37px;
    outline: none;
  }

  .menu-horizontal{
    display: flex;
    flex-direction: row-reverse;
    position: absolute;
    top: 0;
    right: 60px;
  }
  .menu-vertical{
    position: absolute;
    right: 0;
    top: 60px;
  }

  :deep(.ant-btn-default){
    border-color: transparent;
  }
}
.menu:hover{
  .menu-item{
    box-shadow: 3px 2px 5px rgba(0, 0, 0, 0.3);
  }
  .main-icon{
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
    transform: translate(3px, 2px);
  }
  .item-horizontal{
    margin-right: 15px !important;
  }
  .item-vertical{
    margin-top: 15px !important;
  }

  .menu-item:hover{
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
    transform: translate(3px, 2px) !important;
  }
}
</style>

<script setup>
import { computed, ref, watch } from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import UserApi from '@api/userApi.js';

const user = computed(() => store.state.user.userData);

const store = useStore();
const router = useRouter();

const MENU_ITEM_STATE = {
  HIDE: 0, // 隐藏
  SHOW: 1, // 显示
}

const isMenuRight = computed(() => store.state.isMenuRight);

// 横向列表
const menuHorizontalItems = ref([
  {
    name: 'back',
    key: 'back',
    hint: '返回',
    color: '#C89838',
    icon: '#icon-rollback',
    show:  MENU_ITEM_STATE.SHOW,
    clicked: () => {
      router.back();
    }
  },
  {
    name: 'home',
    key: 'home',
    hint: '返回主页',
    color: '#A8A8A8',
    icon: '#icon-home',
    show:  MENU_ITEM_STATE.SHOW,
    clicked: () => {
      router.push('/');
    }
  },
]);

// 纵向列表
const menuVerticalItems = ref([
  {
    name: 'personalHomePage',
    key: 'personalHomePage',
    hint: '个人主页/登陆',
    color: '#6587AA',
    icon: '#icon-denglu',
    show: MENU_ITEM_STATE.SHOW,
    clicked: () => {
      if(user.value.userId){
        alert('个人主页');
      }else{
        store.commit('changeLoginWindowState', {openLogin: true});
      }
    }
  },
  {
    name: 'signOut',
    key: 'signOut',
    hint: '退出登录',
    color: '#Ab5A1B',
    icon: '#icon-tuichu',
    show:  user.value.userId ? MENU_ITEM_STATE.SHOW : MENU_ITEM_STATE.HIDE,
    clicked: () => {
      UserApi.logout();
    }
  }
]);


// 通过Computed计算会展示的列表
const menuHorizontalItemsCmp = computed(() => menuHorizontalItems.value.filter((item) => {
  return item.show === MENU_ITEM_STATE.SHOW;
}));
const menuVerticalItemsCmp = computed(() => menuVerticalItems.value.filter((item) => {
  return item.show === MENU_ITEM_STATE.SHOW;
}));

// 检测userId来判断用户是否登录了
watch(
  () => user.value.userId,
  (userId) => {
    const signOutItem = menuVerticalItems.value.find((item) => item.name === 'signOut');
    signOutItem.show = userId ? MENU_ITEM_STATE.SHOW : MENU_ITEM_STATE.HIDE;
  }
)

</script>