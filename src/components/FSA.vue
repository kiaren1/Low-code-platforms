<template>
  <div class="FSA-area" ref="fsa" @animationend="handleAnimationEnd">
    <article class="text">
      <RotateCube></RotateCube>
      <div class="title">
        <h1>MK-blog</h1>
        <span>一款可私有化部署的博客</span>
      </div>
      <div class="hint">
        <span>Nightglow —— 夜气辉，一种光学现象，它使得在背向太阳的夜空即使在排除了星光和扩散的阳光也不会完全黑暗</span>
      </div>
    </article>
    <article class="author">
      <section>By: Moming Kiaren</section>
      <nav>
        <a href="https://github.com/XiaMingYu77/Mk-markdown-blog" target="_blank">
          <svg class="icon" aria-hidden="true" font-size="25px">
            <use xlink:href="#icon-githublogo"></use>
          </svg>
          Mk-markdown-blog
        </a>
      </nav>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import createRibbons from '@components/coloredRibbon.js';
import RotateCube from './RotateCube.vue';
// eslint-disable-next-line
const emit = defineEmits(["animationEnd"]);
const fsa = ref();

onMounted(() => {
  // 生成背景
  createRibbons({
    body_: fsa.value,
    color: '#EAE8E9',
    horizontalSpeed: 250,
  })
})

function handleAnimationEnd(){
  emit("animationEnd");
}

</script>

<style lang="less" scoped>
.FSA-area{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  animation: fadeAway 1.5s ease-in 2.5s;

  .text{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 800px;
  }

  .title{
    color: #1B1F31, #d6d2d483;
    text-align: center;
  }

  .hint{
    margin-top: 50px;
    padding: 0 150px;
    color: #A096B0;
    text-align: center;
  }

  .author{
    position: absolute;
    right: 20px;
    bottom: 20px;
    margin: auto;
    text-align: center;
    color: #AB5A1B;

    a{
      color: #6587AA;
    }
  }

  @keyframes fadeAway{
    0%{
      opacity: 1;
    }
    100%{
      opacity: 0;
    }
  }
}
</style>
