<template>
  <article class="cube-area" :style="cssVars">
    <div class="rotate-cube">
      <ul class="cube-inner" id="innerCube">
        <li class="top"></li>
        <li class="bottom"></li>
        <li class="front"></li>
        <li class="back"></li>
        <li class="right"></li>
        <li class="left"></li>
      </ul>
      <ul class="cube" id="outerCube">
        <li class="top"></li>
        <li class="bottom"></li>
        <li class="front"></li>
        <li class="back"></li>
        <li class="right"></li>
        <li class="left"></li>
      </ul>
    </div>
  </article>
</template>

<style lang="less" scoped>
@rotate-x: -35deg;
@rotate-x-inside: -35deg;
@rotate-y: 45deg;

.cube-area{
  --cubeSize: 200;
  height: calc(var(--cubeSize) * 2px);
  padding-top: calc(var(--cubeSize) * 1px);
  min-width: calc(var(--cubeSize) * 2px);

  .rotate-cube{
    position: relative;

    li{
      list-style: none;
    }

    .cube-inner {
      transform-style: preserve-3d;
      transform: rotateX(@rotate-x-inside) rotateY(@rotate-y);
      animation: fastspin 6s ease-in-out infinite;

      li {
        left: 0; top: 0; right: 0; bottom: 0;
        margin: auto;
        position: absolute;
        width: calc(var(--cubeSize) * 0.5px);
        height: calc(var(--cubeSize) * 0.5px);
        background: var(--innerColor);
        border: 4px solid #fff;
      }

      .top{
        transform: rotateX(90deg) translateZ(calc(var(--cubeSize) * 0.25px));
      }
      .bottom {
        transform: rotateX(-90deg) translateZ(calc(var(--cubeSize) * 0.25px));
      }
      .front {
        transform: translateZ(calc(var(--cubeSize) * 0.25px));
      }
      .back {
        transform: rotateX(-180deg) translateZ(calc(var(--cubeSize) * 0.25px));
      }
      .left {
        transform: rotateY(-90deg) translateZ(calc(var(--cubeSize) * 0.25px));
      }
      .right {
        transform: rotateY(90deg) translateZ(calc(var(--cubeSize) * 0.25px));
      }
    }

    .cube{
      transform-style: preserve-3d;
      transform: rotateX(@rotate-x) rotateY(@rotate-y);
      animation: slowspin 6s ease-in-out infinite;

      li{
        left: 0; top: 0; right: 0; bottom: 0;
        margin: auto;
        position: absolute;
        width: calc(var(--cubeSize) * 1px);
        height: calc(var(--cubeSize) * 1px);
        background: var(--outerColor);
        border: 4px solid #ffffff84;
      }
      .top {
        transform: rotateX(90deg) translateZ(calc(var(--cubeSize) * 0.5px));
      }
      .bottom {
        transform: rotateX(-90deg) translateZ(calc(var(--cubeSize) * 0.5px));
      }
      .front {
        transform: translateZ(calc(var(--cubeSize) * 0.5px));
      }
      .back {
        transform: rotateX(-180deg) translateZ(calc(var(--cubeSize) * 0.5px));
      }
      .left {
        transform: rotateY(-90deg) translateZ(calc(var(--cubeSize) * 0.5px));
      }
      .right {
        transform: rotateY(90deg) translateZ(calc(var(--cubeSize) * 0.5px));
      }
    }
  }
}

@keyframes fastspin {
  0% {
    transform: rotateX(@rotate-x-inside) rotateY(@rotate-y);
  }
  40%,
  to {
    transform: rotateX(-360+@rotate-x-inside) rotateY(360deg-@rotate-y);
  }
}

@keyframes slowspin {
  0% {
    transform: rotateX(@rotate-x) rotateY(@rotate-y);
  }
  40%,
  to {
    transform: rotateX(180+@rotate-x) rotateY(-360deg+@rotate-y);
  }
}
</style>

<script setup>
import { onMounted, nextTick, computed, toRefs } from "vue";

const props = defineProps({
  size: {
    type: String || Number,
    default: 200
  },
  innerColor: {
    type: String,
    default: '#6588aa' // 指定innerColor的默认值为'red'
  },
  outerColor: {
    type: String,
    default: '#6588aa2d'
  }
});
const {size, innerColor, outerColor} = toRefs(props);

const cssVars = computed(() => ({
  '--cubeSize': `${size.value}`,
  '--innerColor': `${innerColor.value || '#6588aa'}`,
  '--outerColor': `${outerColor.value || '#6588aa2d'}`
}))

</script>