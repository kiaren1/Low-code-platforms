import { sin, cos, toPercent } from '@/utils/translate'

export function getShapeStyle(style) {
  const result = {};
  ['width', 'height', 'top', 'left', 'rotate'].forEach((attr) => {
    if (attr !== 'rotate') {
      result[attr] = style[attr] + 'px'
    } else {
      result.transform = 'rotate(' + style[attr] + 'deg)'
    }
  })

  return result
}

const needUnit = [
  'fontSize',
  'width',
  'height',
  'top',
  'left',
  'borderWidth',
  'letterSpacing',
  'borderRadius',
]

export function getSVGStyle(style, filter = []) {
  const result = {};

  [
    'opacity',
    'width',
    'height',
    'top',
    'left',
    'rotate',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'textAlign',
    'color',
  ].forEach((key) => {
    if (!filter.includes(key)) {
      if (key !== 'rotate') {
        if (style[key] !== '') {
          result[key] = style[key]

          if (needUnit.includes(key)) {
            result[key] += 'px'
          }
        }
      } else {
        result.transform = key + '(' + style[key] + 'deg)'
      }
    }
  })

  return result
}

export function getStyle(style, filter = []) {
  const result = {}
  Object.keys(style).forEach((key) => {
    if (!filter.includes(key)) {
      if (key !== 'rotate') {
        if (style[key] !== '') {
          result[key] = style[key]

          if (needUnit.includes(key)) {
            result[key] += 'px'
          }
        }
      } else {
        result.transform = key + '(' + style[key] + 'deg)'
      }
    }
  })

  return result
}

// 获取一个组件旋转 rotate 后的样式
export function getComponentRotatedStyle(style) {
  const styleObj = { ...style };
  if (styleObj.rotate !== 0) {
    const newWidth = styleObj.width * cos(styleObj.rotate) + styleObj.height * sin(styleObj.rotate);
    const diffX = (styleObj.width - newWidth) / 2; // 旋转后范围变小是正值，变大是负值
    styleObj.left += diffX;
    styleObj.right = styleObj.left + newWidth;

    const newHeight = styleObj.height * cos(styleObj.rotate) + styleObj.width * sin(styleObj.rotate);
    const diffY = (newHeight - styleObj.height) / 2; // 始终是正
    styleObj.top -= diffY;
    styleObj.bottom = styleObj.top + newHeight;

    styleObj.width = newWidth;
    styleObj.height = newHeight;
  } else {
    styleObj.bottom = styleObj.top + styleObj.height;
    styleObj.right = styleObj.left + styleObj.width;
  }

  return styleObj;
}

const filterKeys = ['width', 'height', 'scale']
export function getCanvasStyle(canvasStyleData) {
  const result = {}
  Object.keys(canvasStyleData).filter((key) => !filterKeys.includes(key)).forEach((key) => {
    result[key] = canvasStyleData[key]
    if (key === 'fontSize') {
      result[key] += 'px'
    }
  })

  return result
}

export function createGroupStyle(groupComponent) {
  const parentStyle = groupComponent.style
  groupComponent.propValue.forEach((component) => {
    // component.groupStyle 的 top left 是相对于 group 组件的位置
    // 如果已存在 component.groupStyle，说明已经计算过一次了。不需要再次计算
    if (!Object.keys(component.groupStyle).length) {
      const style = { ...component.style }
      if (component.component.startsWith('SVG')) {
        component.groupStyle = getSVGStyle(style)
      } else {
        component.groupStyle = getStyle(style)
      }

      component.groupStyle.left = toPercent((style.left - parentStyle.left) / parentStyle.width)
      component.groupStyle.top = toPercent((style.top - parentStyle.top) / parentStyle.height)
      component.groupStyle.width = toPercent(style.width / parentStyle.width)
      component.groupStyle.height = toPercent(style.height / parentStyle.height)
    }
  })
}
