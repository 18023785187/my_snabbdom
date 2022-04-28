/**
 *  props 模块允许你设置 DOM 元素的属性。
 * props 添加的属性只能被设置不能被移除，即使浏览器允许自定义添加或删除属性，该模块也不会尝试删除。
 * 这是因为原生 DOM 的属性也同样不支持被移除
 * 
 * js：h("a", { props: { href: "/foo" } }, "Go to Foo")
 * 
 * jsx：<input props={{ name: "foo" }} />
 */
import { VNode, VNodeData } from '../vnode'
import { Module } from './module'

export type Props = Record<string, any> // Record<K, T>：相当于 { K: T }

/**
 * module props hook
 * @param oldVnode VNode
 * @param vnode VNode
 * @returns 
 */
function updateProps(oldVnode: VNode, vnode: VNode): void {
  let key: string
  let cur: any
  let old: any
  const elm = vnode.elm
  let oldProps = (oldVnode.data as VNodeData).props // 旧节点的 props 对象
  let props = (vnode.data as VNodeData).props // 新节点的 props 对象

  if (!oldProps && !props) return // 如果新旧节点都没有 props 对象，则返回
  if (oldProps === props) return // 如果新旧节点的 props 对象引用相同，说明两者为同一个节点，返回
  oldProps = oldProps || {}
  props = props || {}

  for (key in props) { // 只遍历 props，所以只是添加或修改属性，不能删除属性
    cur = props[key] // 新节点的当前属性的值
    old = oldProps[key] // 旧节点的当前属性的值
    if (old !== cur && (key !== 'value' || (elm as any)[key] !== cur)) {
      /**
       * 如果新旧节点的属性值不相等，并且 DOM 元素的属性值和新节点的属性值不一致，则修改 DOM 元素的属性值
       * 
       * 注意，如果有 value 值，那么需要验证 DOM 元素的 value 值是否不一致
       */
      (elm as any)[key] = cur
    }
  }
}

export const propsModule: Module = { create: updateProps, update: updateProps }

// END
