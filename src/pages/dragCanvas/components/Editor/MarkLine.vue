<template>
  <div class="mark-line">
    <div
      v-for="line in lines"
      v-show="lineStatus[line] || false"
      :key="line"
      ref="lineListRef"
      class="line"
      :class="line.includes('x')? 'xline' : 'yline'"
    ></div>
  </div>
</template>

<script setup>
import eventBus from '@/utils/eventBus'
import { getComponentRotatedStyle } from '@/utils/style'
import { useStore } from 'vuex';
import { computed, onMounted, reactive, ref } from 'vue';

const store = useStore();

const curComponent = computed(() => store.state.curComponent);
const componentData = computed(() => store.state.componentData);

const lines = reactive(['xt', 'xc', 'xb', 'yl', 'yc', 'yr']); // 对应三条横线和三条竖线
const diff = 3; // 相距 dff 像素将自动吸附
const lineStatus = reactive({
  xt: false,
  xc: false,
  xb: false,
  yl: false,
  yc: false,
  yr: false,
});

const lineListRef = ref();

const lineNodeMap = computed(() => {
  const lineNodeList = lineListRef.value;
  const ans = {};
  for (let index = 0; index < lineNodeList.length; index++) {
    ans[lines[index]] = lineNodeList[index];
  }
  return ans;
})

onMounted(() => {
  // 监听元素移动和不移动的事件
  eventBus.on('move', (isDownward, isRightward) => {
    showLine(isDownward, isRightward);
  })

  eventBus.on('unmove', () => {
    hideLine();
  })
});

function hideLine() {
  Object.keys(lineStatus).forEach((line) => {
    lineStatus[line] = false;
  })
}

function showLine(isDownward, isRightward) {
  const components = componentData.value;
  const curComponentStyle = getComponentRotatedStyle(curComponent.value.style);
  const curComponentHalfwidth = curComponentStyle.width / 2;
  const curComponentHalfHeight = curComponentStyle.height / 2;

  hideLine();
  components.forEach((component) => {
    if (component === curComponent.value) { return }
    const componentStyle = getComponentRotatedStyle(component.style);
    const { top, left, bottom, right } = componentStyle;
    const componentHalfwidth = componentStyle.width / 2;
    const componentHalfHeight = componentStyle.height / 2;

    // 计算标线偏移
    const conditions = {
      top: [
        {
          isNearly: isNearly(curComponentStyle.top, top),
          lineNode: lineNodeMap.value.xt, // xt
          line: 'xt',
          dragShift: top,
          lineShift: top,
        },
        {
          isNearly: isNearly(curComponentStyle.bottom, top),
          lineNode: lineNodeMap.value.xt, // xt
          line: 'xt',
          dragShift: top - curComponentStyle.height,
          lineShift: top,
        },
        {
          // 组件与拖拽节点的中间是否对齐
          isNearly: isNearly(curComponentStyle.top + curComponentHalfHeight, top + componentHalfHeight),
          lineNode: lineNodeMap.value.xc, // xc
          line: 'xc',
          dragShift: top + componentHalfHeight - curComponentHalfHeight,
          lineShift: top + componentHalfHeight,
        },
        {
          isNearly: isNearly(curComponentStyle.top, bottom),
          lineNode: lineNodeMap.value.xb, // xb
          line: 'xb',
          dragShift: bottom,
          lineShift: bottom,
        },
        {
          isNearly: isNearly(curComponentStyle.bottom, bottom),
          lineNode: lineNodeMap.value.xb, // xb
          line: 'xb',
          dragShift: bottom - curComponentStyle.height,
          lineShift: bottom,
        },
      ],
      left: [
        {
          isNearly: isNearly(curComponentStyle.left, left),
          lineNode: lineNodeMap.value.yl, // yl
          line: 'yl',
          dragShift: left,
          lineShift: left,
        },
        {
          isNearly: isNearly(curComponentStyle.right, left),
          lineNode: lineNodeMap.value.yl, // yl
          line: 'yl',
          dragShift: left - curComponentStyle.width,
          lineShift: left,
        },
        {
          // 组件与拖拽节点的中间是否对齐
          isNearly: isNearly(curComponentStyle.left + curComponentHalfwidth, left + componentHalfwidth),
          lineNode: lineNodeMap.value.yc, // yc
          line: 'yc',
          dragShift: left + componentHalfwidth - curComponentHalfwidth,
          lineShift: left + componentHalfwidth,
        },
        {
          isNearly: isNearly(curComponentStyle.left, right),
          lineNode: lineNodeMap.value.yr, // yr
          line: 'yr',
          dragShift: right,
          lineShift: right,
        },
        {
          isNearly: isNearly(curComponentStyle.right, right),
          lineNode: lineNodeMap.value.yr, // yr
          line: 'yr',
          dragShift: right - curComponentStyle.width,
          lineShift: right,
        },
      ],
    }

    const needToShow = []
    const { rotate } = curComponent.value.style
    Object.keys(conditions).forEach((key) => {
      // 遍历符合的条件并处理
      conditions[key].forEach((condition) => {
        if (!condition.isNearly) {return}
        // 修改当前组件位移
        store.commit('setShapeSingleStyle', {
          key,
          value: rotate !== 0 ? translatecurComponentShift(key, condition, curComponentStyle) : condition.dragShift,
        })

        condition.lineNode.style[key] = `${condition.lineShift}px`
        needToShow.push(condition.line)
      })
    })

    // 同一方向上同时显示三条线可能不太美观，因此才有了这个解决方案
    // 同一方向上的线只显示一条，例如多条横条只显示一条横线
    if (needToShow.length) {
      chooseTheTureLine(needToShow, isDownward, isRightward)
    }
  })
}

// 通过检测移动的px返回来实现吸附
function isNearly(dragValue, targetValue) {
  return Math.abs(dragValue - targetValue) <= diff;
}

function translatecurComponentShift(key, condition, curComponentStyle) {
  const { width, height } = curComponent.value.style
  if (key === 'top') {
    return Math.round(condition.dragShift - (height - curComponentStyle.height) / 2)
  }

  return Math.round(condition.dragShift - (width - curComponentStyle.width) / 2)
}

function chooseTheTureLine(needToShow, isDownward, isRightward) {
  // 如果鼠标向右移动 则按从右到左的顺序显示竖线 否则按相反顺序显示
  // 如果鼠标向下移动 则按从下到上的顺序显示横线 否则按相反顺序显示
  if (isRightward) {
    if (needToShow.includes('yr')) {
      lineStatus.yr = true
    } else if (needToShow.includes('yc')) {
      lineStatus.yc = true
    } else if (needToShow.includes('yl')) {
      lineStatus.yl = true
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (needToShow.includes('yl')) {
      lineStatus.yl = true
    } else if (needToShow.includes('yc')) {
      lineStatus.yc = true
    } else if (needToShow.includes('yr')) {
      lineStatus.yr = true
    }
  }

  if (isDownward) {
    if (needToShow.includes('xb')) {
      lineStatus.xb = true
    } else if (needToShow.includes('xc')) {
      lineStatus.xc = true
    } else if (needToShow.includes('xt')) {
      lineStatus.xt = true
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (needToShow.includes('xt')) {
      lineStatus.xt = true
    } else if (needToShow.includes('xc')) {
      lineStatus.xc = true
    } else if (needToShow.includes('xb')) {
      lineStatus.xb = true
    }
  }
}
</script>

<style lang="scss" scoped>
.mark-line {
  height: 100%;
}

.line {
  background: #ff7c7ed0;
  position: absolute;
  z-index: 1000;
}

.xline {
  width: 100%;
  height: 1px;
}

.yline {
  width: 1px;
  height: 100%;
}
</style>
