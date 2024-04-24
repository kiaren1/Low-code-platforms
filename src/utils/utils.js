import * as imageConversion from 'image-conversion';

export function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

export function $(selector) {
  return document.querySelector(selector)
}

const components = ['VText', 'RectShape', 'CircleShape']
export function isPreventDrop(component) {
  return !components.includes(component) && !component.startsWith('SVG')
}

// 光标插入
export function insertTextAtCaret(text) {
  let sel = null, range = null;
  if (window.getSelection) {
    sel = window.getSelection()
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(text))
    }
  } else if (document.selection && document.selection.createRange) {
    document.selection.createRange().text = text
  }
}

export function compressImage(file) {
  return imageConversion.compressAccurately(file, 80);
}