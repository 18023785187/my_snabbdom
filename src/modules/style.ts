/**
 * style 模块用于让动画更加平滑，它的核心是允许你再元素上设置 CSS 属性。
 * 
 * 特性：
 *  1、自定义属性(CSS 变量)：属性名需要以 -- 为前缀，如：style: { "--warnColor": "yellow" }。
 *  2、delayed：延迟参数，每当这些属性变动时需要到下一帧之后才会应用更改。
 *  3、remove：在元素即将从 DOM 中移除时生效，应用的样式应该通过 CSS transition 设置，只有当所有动画执行完成后元素才会从 DOM 中移除。
 *  4、destroy：
 * 
 * js：h(
        "span",
        {
          style: {
            border: "1px solid #bada55",
            color: "#c0ffee",
            fontWeight: "bold",
          },
        },
        "Say my name, and every colour illuminates"
      )

 * jsx：<div
          style={{
            border: "1px solid #bada55",
            color: "#c0ffee",
            fontWeight: "bold",
          }}
        />
 */
import { VNode, VNodeData } from '../vnode'
import { Module } from './module'

export type VNodeStyle = Record<string, string> & { // Record<K, T>：相当于 { K: T }，& 对类型进行扩展
  delayed?: Record<string, string>
  remove?: Record<string, string>
}

const raf = // 动画帧函数优雅降级
  (typeof window !== 'undefined' &&
    window.requestAnimationFrame.bind(window)) ||
  setTimeout
const nextFrame = function (fn: any) { // 下一帧调用函数
  raf(function () { // 当前帧
    raf(fn) // 下一帧
  })
}
let reflowForced = false

/**
 * 在下一帧设置对象中的属性的值
 * @param obj 对象
 * @param prop 属性
 * @param val 属性值
 */
function setNextFrame(obj: any, prop: string, val: any): void {
  nextFrame(function () {
    obj[prop] = val
  })
}

/**
 * 在 create、update 生命周期时调用。
 * 
 * 对 DOM 元素的样式表进行修改或删除，触发 delayed 延迟函数。
 * 
 * @param oldVnode VNode
 * @param vnode VNode
 * @returns 
 */
function updateStyle(oldVnode: VNode, vnode: VNode): void {
  let cur: any
  let name: string
  const elm = vnode.elm
  let oldStyle = (oldVnode.data as VNodeData).style // 旧节点的 style 对象
  let style = (vnode.data as VNodeData).style // 新节点的 style 对象

  if (!oldStyle && !style) return // 如果新旧节点都没有 style 对象，则返回
  if (oldStyle === style) return // 如果新旧节点的 style 对象引用相同，说明两个节点相同，返回
  oldStyle = oldStyle || {}
  style = style || {}
  const oldHasDel = 'delayed' in oldStyle // 旧节点是否存在 delayed 对象

  for (name in oldStyle) { // 如果该属性在旧节点有而在新节点没有，则删除
    if (!style[name]) {
      if (name[0] === '-' && name[1] === '-') { // 对于自定义属性，需要在样式表中移除属性
        (elm as any).style.removeProperty(name)
      } else { // 其余属性则置空即可
        (elm as any).style[name] = ''
      }
    }
  }
  for (name in style) {
    cur = style[name]
    if (name === 'delayed' && style.delayed) { // 检测是否存在 delayed 对象
      for (const name2 in style.delayed) { // 如果存在，那么应用动画帧
        cur = style.delayed[name2]
        if (!oldHasDel || cur !== (oldStyle.delayed as any)[name2]) {
          /**
           * 如果旧节点不存在 delayed 对象，或者新节点的 delayed 对象的当前属性值不等于旧节点的 delayed 对象的当前属性值，
           * 那么需要在下一帧改变属性。
           */
          setNextFrame((elm as any).style, name2, cur)
        }
      }
    } else if (name !== 'remove' && cur !== oldStyle[name]) { // 排除 remove 属性，并且当前属性不相同，则修改
      if (name[0] === '-' && name[1] === '-') {
        (elm as any).style.setProperty(name, cur)
      } else {
        (elm as any).style[name] = cur
      }
    }
  }
}

/**
 * 在 destroy 生命周期时调用。
 * 
 * 在 destroy 生命周期触发时设置 DOM 元素的样式表。
 * 
 * @param vnode VNode
 * @returns 
 */
function applyDestroyStyle(vnode: VNode): void {
  let style: any
  let name: string
  const elm = vnode.elm
  const s = (vnode.data as VNodeData).style
  if (!s || !(style = s.destroy)) return // 如果没有 style 对象或者 style 对象中没有 destroy 对象，返回
  for (name in style) { // 把 destroy 对象中的属性应用到 DOM 元素的样式表中
    (elm as any).style[name] = style[name]
  }
}

/**
 * 在 remove 生命周期时调用。
 * 
 * 在元素被删除时执行动画，被执行的动画属性应存在于 remove 对象中，且 transition 也应设置过渡属性。
 * 
 * 如：
 *  style: {
      opacity: "1",
      transition: "opacity 1s",
      remove: { opacity: "0" },
    }

    transition 属性指定了 opacity 为过渡属性，且 remove 也指定了 opacity，那么 opacity 属性符合执行删除动画的条件。
 * 
 * @param vnode VNode
 * @param rm 计时回调函数，init 模块中有声明，rm 调用一次表示有一个 remove hook 被调用，当所有 remove hook 被调用完毕，触发删除 DOM 操作
 * @returns 
 */
function applyRemoveStyle(vnode: VNode, rm: () => void): void {
  const s = (vnode.data as VNodeData).style
  if (!s || !s.remove) { // 如果没有 style 对象或者 style 对象中没有remove 对象，返回
    rm()
    return
  }
  if (!reflowForced) { // 强制回流一次，暂未知有什么用途，猜测是强制刷新当前元素的状态
    (vnode.elm as any).offsetLeft
    reflowForced = true
  }
  let name: string
  const elm = vnode.elm
  let i = 0
  const style = s.remove
  let amount = 0 // 计数器，用于统计需要转换的属性
  const applied: string[] = []
  for (name in style) {
    applied.push(name); // 存储 vnode 中的 style 中的 remove 对象中的属性标记
    (elm as any).style[name] = style[name] // 把 remove 对象中的属性应用到 DOM 样式表中
  }
  const compStyle = getComputedStyle(elm as Element) // 获取样式表
  const props = (compStyle as any)['transition-property'].split(', ') // 获取样式表中记录的过渡转换属性表
  for (; i < props.length; ++i) {
    if (applied.indexOf(props[i]) !== -1) { // 累计 applied 和 transition-property 都存在的属性总数
      amount++
    }
  }
  (elm as Element).addEventListener(
    'transitionend', // css 在转换完成后触发
    function (ev: TransitionEvent) {
      if (ev.target === elm) --amount // 目标元素完成转换，计数器 - 1
      if (amount === 0) rm() // 所有元素完成转换，执行 rm 表示当前 hook 已调用完毕
    }
  )
}

/**
 * 在 pre 生命周期时调用。
 * 
 * 重置 回流阀。
 */
function forceReflow() {
  reflowForced = false
}

export const styleModule: Module = {
  pre: forceReflow,
  create: updateStyle,
  update: updateStyle,
  destroy: applyDestroyStyle,
  remove: applyRemoveStyle,
}

// END
