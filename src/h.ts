import { vnode, VNode, VNodeData } from './vnode'
import * as is from './is'

export type VNodes = VNode[]
export type VNodeChildrenElement = // VNode 的子元素可以是一些这些类型
  | VNode
  | string
  | number
  | String
  | Number
  | undefined
  | null
export type ArrayOfElement<T> = T | T[]
export type VNodeChildren = ArrayOfElement<VNodeChildrenElement> // VNodeChildren 可以是单个 VNode 或 VNode 数组

/**
 * 为 svg 元素添加命名空间 http://www.w3.org/2000/svg
 * @param data 属性
 * @param children 子节点
 * @param sel 选择器
 */
export function addNS(
  data: any,
  children: Array<VNode | string> | undefined,
  sel: string | undefined
) {
  data.ns = 'http://www.w3.org/2000/svg'
  if (sel !== 'foreignObject' && children !== undefined) {
    for (let i = 0; i < children.length; ++i) {
      const child = children[i]
      if (typeof child === 'string') continue
      const childData = child.data
      if (childData !== undefined) {
        addNS(childData, child.children as VNodes, child.sel)
      }
    }
  }
}

/**
 * h 函数的作用是对数据进行处理，最终得到 VNode
 * 
 * h 函数具有四种用法：
 * 
 *  1、单纯的空标签，如 <span></span>
 *  2、具有属性的空标签，如 <span id='text'></span>
 *  3、没有属性，具有子元素，如 <span> hello </span>
 *  4、具有属性，具有子元素，如 <span id='text'> hello </span>
 * 
 *  @param sel DOM 选择器
 *  @param b 根据四种情况进行确定的值
 *  @param c 根据四种情况进行确定的值
 *  @return VNode
 */
export function h(sel: string): VNode
export function h(sel: string, data: VNodeData | null): VNode
export function h(sel: string, children: VNodeChildren): VNode
export function h(
  sel: string,
  data: VNodeData | null,
  children: VNodeChildren,
): VNode
export function h(sel: any, b?: any, c?: any): VNode {

  let data: VNodeData = {} // 属性
  let children: any // 子元素，注意 children 的最终形态只能是数组或 undefined
  let text: any // 文本

  if (c !== undefined) { // 处理参数 c，当 c 存在，说明有子节点
    if (b !== null) { // b 不为 null，那么 b 只能是 VNodeData 类型的对象
      data = b
    }
    if (is.array(c)) {
      children = c
    } else if (is.primitive(c)) { // 当 c 为数字或字符串时，那么 c 是文本节点
      text = c.toString()
    } else if (c && c.sel) { // c 为一个 VNode
      children = [c] // 为什么是数组，请看 children 的定义注解
    }
  } else if (b !== undefined && b !== null) { // 处理参数 b，因为 b 可能是属性，也可能是子节点
    if (is.array(b)) {
      children = b
    } else if (is.primitive(b)) {
      text = b.toString()
    } else if (b && b.sel) {
      children = [b]
    } else { // 以上三种情况都是判断 b 参数是否是子节点的，如果都不满足，那么 b 参数只能是属性
      data = b
    }
  }

  if (children !== undefined) {
    /**
     *   h 函数子节点传参时可以是一个 Array<number | string>，如 h('div', ['hello', 666])，
     * 而 VNode 是一个对象，所以遍历的目的是把上述类型转换成 VNode
     */
    for (let i = 0; i < children.length; ++i) {
      if (is.primitive(children[i])) {
        children[i] = vnode(
          undefined,
          undefined,
          undefined,
          children[i],
          undefined,
        )
      }
    }
  }
  if ( // 如果 sel === 'svg'，说明该 VNode 是 svg 元素，为其添加命名空间
    sel[0] === "s" &&
    sel[1] === "v" &&
    sel[2] === "g" &&
    (sel.length === 3 || sel[3] === "." || sel[3] === "#")
  ) {
    addNS(data, children, sel)
  }
  return vnode(sel, data, children, text, undefined)
}

/**
 * 创建 DoucmentFragment VNode
 * @param children 虚拟节点数组
 * @returns VNode
 */
export function fragment(children: VNodeChildren): VNode {
  let c: any
  let text: any

  if (is.array(children)) { // 只能命中 children 为数组的情况，下面两种貌似不会触发
    c = children
  } else if (is.primitive(c)) {
    text = children
  } else if (c && c.sel) {
    c = [children]
  }

  if (c !== undefined) {
    for (let i = 0; i < c.length; ++i) {
      if (is.primitive(c[i])) { // 把文本节点转为 VNode
        c[i] = vnode(undefined, undefined, undefined, c[i], undefined)
      }
    }
  }

  return vnode(undefined, {}, c, text, undefined)
}

// END
