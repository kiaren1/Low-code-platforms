<template>
  <article class="cube-area">
    <div class="rotate-cube">
      <ul class="cube-inner">
        <li class="top"></li>
        <li class="bottom"></li>
        <li class="front"></li>
        <li class="back"></li>
        <li class="right"></li>
        <li class="left"></li>
      </ul>
      <ul class="cube">
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
  height: 400px;
  padding-top: 200px;
}

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
      width: 100px;
      height: 100px;
      background: #6588aa;
      border: 6px solid #fff;
    }

    .top{
      transform: rotateX(90deg) translateZ(50px);
    }
    .bottom {
      transform: rotateX(-90deg) translateZ(50px);
    }
    .front {
      transform: translateZ(50px);
    }
    .back {
      transform: rotateX(-180deg) translateZ(50px);
    }
    .left {
      transform: rotateY(-90deg) translateZ(50px);
    }
    .right {
      transform: rotateY(90deg) translateZ(50px);
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
      width: 200px;
      height: 200px;
      background: #6588aa2d;
      border: 4px solid #ffffff84;
    }
    .top {
      transform: rotateX(90deg) translateZ(100px);
    }
    .bottom {
      transform: rotateX(-90deg) translateZ(100px);
    }
    .front {
      transform: translateZ(100px);
    }
    .back {
      transform: rotateX(-180deg) translateZ(100px);
    }
    .left {
      transform: rotateY(-90deg) translateZ(100px);
    }
    .right {
      transform: rotateY(90deg) translateZ(100px);
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

</script>