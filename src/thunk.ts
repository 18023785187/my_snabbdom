import { VNode, VNodeData } from './vnode'
import { h, addNS } from './h'

export interface ThunkData extends VNodeData {
  fn: () => VNode
  args: any[]
}

export interface Thunk extends VNode {
  data: ThunkData
}

export interface ThunkFn {
  (sel: string, fn: (...args: any[]) => any, args: any[]): Thunk
  (sel: string, key: any, fn: (...args: any[]) => any, args: any[])
}
