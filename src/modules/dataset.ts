/**
 * dataset 模块允许你在 DOM 元素上设置自定义 data 属性，然后通过 HTMLElement.dataset 来访问这些属性
 * 
 * js：h("button", { dataset: { action: "reset" } }, "Reset")
 * 
 * jsx：<div dataset={{ foo: "bar" }} />
 */
import { VNode, VNodeData } from '../vnode'
import { Module } from './module'

export type Dataset = Record<string, string> // Record<K, T>：相当于 { K: T }

const CAPS_REGEX = /[A-Z]/g

/**
 * module dataset hook
 * 
 * 生成规则：
 *  1、传入 dataset: { aaa: 'bbb' }，生成的属性为 <div data-aaa='bbb'></div>。
 *  2、传入 dataset: { aAa: 'bbb' }，生成的属性为 <div data-a-aa='bbb'></div>。
 * 
 * 使用驼峰命名的属性最终都会被转成 -前缀。
 * 
 * @param oldVnode VNode
 * @param vnode VNode
 * @returns 
 */
function updateDataset(oldVnode: VNode, vnode: VNode): void {
  const elm: HTMLElement = vnode.elm as HTMLElement
  let oldDataset = (oldVnode.data as VNodeData).dataset // 旧节点的 dataset 对象
  let dataset = (vnode.data as VNodeData).dataset // 新节点的 dataset 对象
  let key: string

  if (!oldDataset && !dataset) return // 如果新旧节点都没有 dataset 对象，则返回
  if (oldDataset === dataset) return // 如果新旧节点的 dataset 对象引用相同，说明两者为同一个节点，返回
  oldDataset = oldDataset || {}
  dataset = dataset || {}
  const d = elm.dataset

  for (key in oldDataset) {
    if (!dataset[key]) { // 如果新节点的 dataset 没有当前属性，则向 DOM 元素删除该自定义属性
      if (d) { // 可能存在大小写不一致的情况，如传入 aAa，而 DOM 元素中的 dataset 会转义为 aaa
        if (key in d) {
          delete d[key]
        }
      } else { // 这种情况必定会命中，如传入 aAa，无论设置或者删除我们生成的都是 data-a-aa
        elm.removeAttribute(
          // 对于 key 存在驼峰命名都会转为 -分割，如 fontSize 转为 font-size
          'data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase()
        )
      }
    }
  }
  for (key in dataset) {
    if (oldDataset[key] !== dataset[key]) { // 如果新旧节点的自定义属性不相同，则修改
      if (d) {
        d[key] = dataset[key]
      } else {
        elm.setAttribute(
          'data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(),
          dataset[key]
        )
      }
    }
  }
}

export const datasetModule: Module = {
  create: updateDataset,
  update: updateDataset
}

// END
