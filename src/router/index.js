import { createRouter, createWebHashHistory } from "vue-router";
import routes from './moduleRoutes';

export default createRouter({
  routes,
  history: createWebHashHistory(),
})