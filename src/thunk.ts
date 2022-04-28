import { VNode, VNodeData } from './vnode'
import { h, addNS } from './h'

export interface ThunkData extends VNodeData { // 声明 Thunk VNode 的属性，这里表明这两个属性为 Thunk VNode 专属
  fn: () => VNode
  args: any[]
}

export interface Thunk extends VNode { // 声明 Thunk VNode 的类型
  data: ThunkData
}

export interface ThunkFn { // 声明 Thunk 方法的类型
  (sel: string, fn: (...args: any[]) => any, args: any[]): Thunk
  (sel: string, key: any, fn: (...args: any[]) => any, args: any[]): Thunk
}

function copyToThunk(vnode: VNode, thunk: VNode): void {
  const ns = thunk.data?.ns;
  (vnode.data as VNodeData).fn = (thunk.data as VNodeData).fn;
  (vnode.data as VNodeData).args = (thunk.data as VNodeData).args
  thunk.data = vnode.data
  thunk.children = vnode.children
  thunk.text = vnode.text
  thunk.elm = vnode.elm
  if (ns) addNS(thunk.data, thunk.children, thunk.sel)
}

function init(thunk: VNode): void {
  const cur = thunk.data as VNodeData
  const vnode = (cur.fn as any)(...cur.args!)
  copyToThunk(vnode, thunk)
}

function prepatch(oldVnode: VNode, thunk: VNode): void {
  let i: number
  const old = oldVnode.data as VNodeData
  const cur = thunk.data as VNodeData
  const oldArgs = old.args
  const args = cur.args
  if (old.fn !== cur.fn || (oldArgs as any).length !== (args as any).length) {
    copyToThunk((cur.fn as any)(...args!), thunk)
  }
  for (i = 0; i < (args as any).length; ++i) {
    if ((oldArgs as any)[i] !== (args as any)[i]) {
      copyToThunk((cur.fn as any)(...args!), thunk)
      return
    }
  }
  copyToThunk(oldVnode, thunk)
}

/**
 * 
 * 
 * @param sel sel为 selector 的意思，意为 DOM 选择器
 * @param key 属性，对 VNode 的扩展
 * @param fn vnode 的子节点，可以为 vnode 数组或 string 数组或 undefined，分别表示 dom 节点、文本节点、无节点
 * @param args 文本节点
 * @returns VNode as ThunkFn
 */
export const thunk = function thunk(
  sel: string,
  key?: any,
  fn?: any,
  args?: any
): VNode {
  if (args === undefined) {
    args = fn
    fn = key
    key = undefined
  }
  return h(sel, {
    key: key,
    hook: { init, prepatch },
    fn: fn,
    args: args,
  })
} as ThunkFn
