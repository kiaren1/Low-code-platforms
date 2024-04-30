<template>
  <article class="menu" :class="{[menuClass]: true, delay: isDelay}">
    <div class="main-icon">
      <div class="content menu-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-caidan"></use>
        </svg>
      </div>
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
          'margin-Top': '-60px'
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

<script setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import UserApi from '@api/userApi.js';
import { message } from 'ant-design-vue';

const user = computed(() => store.state.user.userData);

const store = useStore();
const route = useRoute();
const router = useRouter();

const MENU_ITEM_STATE = {
  HIDE: 0, // 隐藏
  SHOW: 1, // 显示
}

const isMenuRight = computed(() => store.state.isMenuRight);

const isDelay = ref(false);
let rememberPath = '';
const menuClass = ref('');
watch([() => route.path, isMenuRight], ([newPath, isMenuRightValue]) => {
  isDelay.value = false;
  if(rememberPath !== route.path){
    // 是换页，需要设置延迟
    isDelay.value = true;
    rememberPath = route.path;
  }
  if(route.path === '/'){
    menuClass.value = isMenuRight.value ? 'right':'left';
  }else{menuClass.value = '';}
}, {immediate: true})

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
    hint: user.value.userId? '个人主页': '登录',
    color: '#6587AA',
    icon: '#icon-denglu',
    show: MENU_ITEM_STATE.SHOW,
    clicked: () => {
      if(user.value.userId){
        router.push('/self');
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
      message.success('退出成功');
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

    const personalHomePageItem = menuVerticalItems.value.find((item) => item.name === 'personalHomePage');
    personalHomePageItem.hint = userId? '个人主页': '登录';
  }
)

</script>

<style lang="less" scoped>
.menu{
  position: fixed;
  margin: auto;
  z-index: 100;
  top: 40px;
  right: 50px;
  transition: right 0.5s ease-in-out, top 0.5s ease-in-out;

  .menu-item{
    height: 60px;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all ease-out 250ms;
    border: 0;
  }
  .icon{
    font-size: 37px;
    outline: none;
  }
  .main-icon{
    position: absolute;
    z-index: 100;
    right: -1px;
    top: -1px;

    .content{
      border-radius: 50%;
      background-color: #E0C068;
      box-shadow: 3px 2px 5px rgba(0, 0, 0, 0.3);
    }
    .menu-item{
      height: 62px;
      width: 62px;
    }
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
.right{
  right: 50px;
  top: 70px;
}
.left{
  right: 320px;
  top: 70px;
}
.delay{
  transition: all 1s ease-in-out 0.5s;
}
.menu:hover{
  .menu-item{
    box-shadow: 3px 2px 5px rgba(0, 0, 0, 0.3);
  }
  .main-icon{
    .content{
      box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
      transform: translate(3px, 2px);
    }
  }
  .menu-horizontal{
    margin-right: -3px;
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