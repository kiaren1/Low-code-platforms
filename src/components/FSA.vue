<template>
  <div class="FSA-area" ref="fsa" @animationend="handleAnimationEnd">
    <article class="text">
      <RotateCube size="200"></RotateCube>
      <div class="title">
        <h1>KK低代码平台</h1>
        <span>一款可视化前端编程平台</span>
      </div>
      <div class="hint">
        <span
          >Nightglow ——
          夜气辉，一种光学现象，它使得在背向太阳的夜空即使在排除了星光和扩散的阳光也不会完全黑暗</span
        >
      </div>
    </article>
    <article class="author">
      <section>By: Kiaren(刘俊豪)</section>
      <nav>
        <a href="https://github.com/XiaMingYu77/LowCodeWebPage" target="_blank">
          <svg class="icon" aria-hidden="true" font-size="25px">
            <use xlink:href="#icon-githublogo"></use>
          </svg>
          kiaren-Lowcode
        </a>
      </nav>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import createRibbons from "@components/coloredRibbon.js";
import RotateCube from "./RotateCube.vue";
// eslint-disable-next-line
const emit = defineEmits(["animationEnd"]);
const fsa = ref();

onMounted(() => {
  // 生成背景
  createRibbons({
    body_: fsa.value,
    color: "#EAE8E9",
    horizontalSpeed: 250,
  });
});

function handleAnimationEnd() {
  emit("animationEnd");
}
</script>

<style lang="less" scoped>
.FSA-area {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  animation: fadeAway 1.5s ease-in 2.5s;

  z-index: 9999;

  .text {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 800px;
  }

  .title {
    color: #1b1f31, #d6d2d483;
    text-align: center;
  }

  .hint {
    margin-top: 50px;
    padding: 0 150px;
    color: #a096b0;
    text-align: center;
  }

  .author {
    position: absolute;
    right: 20px;
    bottom: 20px;
    margin: auto;
    text-align: center;
    color: #ab5a1b;

    a {
      color: #6587aa;
    }
  }

  @keyframes fadeAway {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
}
</style>
