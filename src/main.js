import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import router from './router';
import 'normalize.css/normalize.css';
import to from 'await-to-js';
import store from './store/vuexStore.js'

import { initComponent } from '@/custom-component' // 注册自定义组件

import '@/styles/animate.scss'
import '@/styles/reset.css'
import '@/styles/global.scss'
import '@/styles/dark.scss'

const app = createApp(App);
app.use(Antd)
  .use(router)
  .use(store);
initComponent(app);
app.mount('#app');

// let [err, data] = await $to(Promise);
window.$to = to;
// 异常兜底
window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  console.log("==== 兜底，有异常未捕获 ====")
  console.error(event.reason);
})
