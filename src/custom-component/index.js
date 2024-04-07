import { defineAsyncComponent } from 'vue';

// import SVGTriangle from './svgs/SVGTriangle';
const components = [
  'CircleShape',
  'Picture',
  'VText',
  'VButton',
  'Group',
  'RectShape',
  'LineShape',
  'VTable',
  'VChart',
];
const svgs = [
  'SVGStar',
  'SVGTriangle',
];

export function initComponent(app) {
  components.forEach((key) => {
    app.component(key, defineAsyncComponent(() => import(`./${key}/Component.vue` /* @vite-ignore */)));
    app.component(key + 'Attr', defineAsyncComponent(() => import(`./${key}/Attr.vue` /* @vite-ignore */)));
  });
  svgs.forEach((key) => {
    app.component(key, defineAsyncComponent(() => import(`./svgs/${key}/Component.vue` /* @vite-ignore */)));
    app.component(key + 'Attr', defineAsyncComponent(() => import(`./svgs/${key}/Attr.vue` /* @vite-ignore */)));
  });
}