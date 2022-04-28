import { Hooks } from './hooks'
import { VNodeStyle } from './modules/style'
import { On } from './modules/eventListeners'
import { Attrs } from './modules/attributes'
import { Classes } from './modules/class'
import { Props } from './modules/props'
import { Dataset } from './modules/dataset'

export type Key = string | number | symbol

export interface VNode {
  sel: string | undefined
  data: VNodeData | undefined
  children: Array<VNode | string> | undefined
  text: string | undefined
  elm: Node | undefined
  key: Key | undefined
}

export interface VNodeData {
  props?: Props // props 模块插件
  attrs?: Attrs // attributes 模块插件
  class?: Classes // class 模块插件
  style?: VNodeStyle // style 模块插件
  dataset?: Dataset // dataset 模块插件
  on?: On // eventListeners 模块插件
  hook?: Hooks // 生命周期钩子
  key?: Key // 元素唯一标识
  ns?: string // 针对 svg 标签的命名空间
  fn?: () => VNode // thunk 的生成函数
  args?: any[] // thunk 的生成函数的参数
  is?: string // TODO: 暂时不知道他的用法
  [key: string]: any // 第三方模块扩展
}

/**
 * vnode函数的作用是根据传入的信息返回封装好的 VNode 对象
 * 
 * @param sel sel为 selector 的意思，意为 DOM 选择器
 * @param data 属性，对 VNode 的扩展
 * @param children vnode 的子节点，可以为 vnode 数组或 string 数组或 undefined，分别表示 dom 节点、文本节点、无节点
 * @param text 文本节点
 * @param elm // 真实的节点
 * @returns VNode
 */
export function vnode(
  sel: string | undefined,
  data: VNodeData | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | DocumentFragment | Text | undefined
): VNode {
  const key = data === undefined ? undefined : data.key // VNode 的唯一标识

  return {
    sel, data, children, text, elm, key
  }
}
