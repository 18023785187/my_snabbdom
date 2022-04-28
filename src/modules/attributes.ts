/**
 * attributes 模块支持增删改查，支持各种属性
 * 
 * js：h("a", { attrs: { href: "/foo" } }, "Go to Foo")
 * 
 * jsx：<div attrs={{ "aria-label": "I'm a div" }} />
 */
import { VNode, VNodeData } from '../vnode'
import { Module } from './module'

export type Attrs = Record<string, string | number | boolean> // Record<K, T>：相当于 { K: T }

const xlinkNS = 'http://www.w3.org/1999/xlink'
const xmlNS = 'http://www.w3.org/XML/1998/namespace'
const colonChar = 58 // : code
const xChar = 120 // x code

/**
 * module attrs hook
 * @param oldVnode VNode
 * @param vnode VNode
 * @returns 
 */
function updateAttrs(oldVnode: VNode, vnode: VNode): void {
  let key: string
  const elm: Element = vnode.elm as Element
  let oldAttrs = (oldVnode.data as VNodeData).attrs // 旧节点的 attrs 对象
  let attrs = (vnode.data as VNodeData).attrs // 新节点的 attrs 对象

  if (!oldAttrs && !attrs) return // 如果新旧节点都没有 attrs 对象，则返回
  if (oldAttrs === attrs) return // 如果新旧节点的 attrs 对象引用相同，说明两者为同一个节点，返回
  oldAttrs = oldAttrs || {}
  attrs = attrs || {}

  // update modified attributes, add new attributes
  for (key in attrs) {
    const cur = attrs[key]
    const old = oldAttrs[key]
    if (old !== cur) { // 新旧节点属性值不相等时，才进行属性修改
      if (cur === true) { // 如果是布尔属性，当 cur 为 true 时，设置该属性，如 <button disabled></button>
        elm.setAttribute(key, '')
      } else if (cur === false) { // 如果是布尔属性，当 cur 为 false 时，移除该属性
        elm.removeAttribute(key)
      } else { // 处理不是布尔属性的情况
        /**
         * TODO: 对属性前缀带 x 的不熟悉，该段会在查阅资料后再添加解释注释
         */
        if (key.charCodeAt(0) !== xChar) { // 属性前缀带 x 的将另行处理
          elm.setAttribute(key, cur as any)
        } else if (key.charCodeAt(3) === colonChar) {
          // Assume xml namespace
          elm.setAttributeNS(xmlNS, key, cur as any)
        } else if (key.charCodeAt(5) === colonChar) {
          // Assume xlink namespace
          elm.setAttributeNS(xlinkNS, key, cur as any)
        } else {
          elm.setAttribute(key, cur as any)
        }
      }
    }
  }

  for (key in oldAttrs) {
    if (!(key in attrs)) { // 如果当前属性在 attrs 中不存在，则删除该属性
      elm.removeAttribute(key)
    }
  }
}

export const attributesModule: Module = {
  create: updateAttrs,
  update: updateAttrs,
}

// END
