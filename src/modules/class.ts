/**
 *   class 模块提供了一种简单的方式来动态配置元素的 class 属性，
 * 这个模块值为一个对象形式的 class 数据，对象中类名需要映射为布尔值，
 * 以此来表示该类名是否应该出现在节点上。
 * 
 * js：h("a", { class: { active: true, selected: false } }, "Toggle")
 * 
 * jsx：<div class={{ foo: true, bar: true }} />
 */
import { VNode, VNodeData } from '../vnode'
import { Module } from './module'

export type Classes = Record<string, boolean> // Record<K, T>：相当于 { K: T }

/**
 * module class hook
 * @param oldVnode VNode
 * @param vnode VNode
 * @returns 
 */
function updateClass(oldVnode: VNode, vnode: VNode): void {
  let cur: any
  let name: string
  const elm: Element = vnode.elm as Element
  let oldClass = (oldVnode.data as VNodeData).class // 旧节点的 class 对象
  let klass = (vnode.data as VNodeData).class // 新节点的 class 对象

  if (!oldClass && !klass) return // 如果新旧节点都没有 class 对象，则返回
  if (oldClass === klass) return // 如果新旧节点的 class 对象引用相同，说明两个节点相同，返回
  oldClass = oldClass || {}
  klass = klass || {}

  for (name in oldClass) {
    if (oldClass[name] && !Object.prototype.hasOwnProperty.call(klass, name)) {
      elm.classList.remove(name) // 如果旧节点的当前 class 项为 true，新节点的当前 class 项为 false，则删除当前 class 项
    }
  }

  for (name in klass) {
    cur = klass[name]
    if (cur !== oldClass[name]) { // 如果新旧节点的当前 class 项不相同，根据情况进行操作
      (elm.classList as any)[cur ? 'add' : 'remove'](name)
    }
  }
}

export const classModule: Module = { create: updateClass, update: updateClass }

// END
