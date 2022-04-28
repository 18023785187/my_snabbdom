/**
 * hooks 是 snabbdom 提供的一系列生命周期函数
 */
import { VNode } from './vnode'

export type PreHook = () => any // patch 开始执行
export type InitHook = (vNode: VNode) => any // vnode 被添加
export type CreateHook = (emptyVNode: VNode, vNode: VNode) => any // 一个基于 vnode 的 DOM 元素被创建
export type InsertHook = (vNode: VNode) => any // 元素 被插入到 DOM
export type PrePatchHook = (oldVNode: VNode, vNode: VNode) => any // 元素 即将 patch
export type UpdateHook = (oldVNode: VNode, vNode: VNode) => any // 元素 已更新
export type PostPatchHook = (oldVNode: VNode, vNode: VNode) => any // 元素 已被 patch
export type DestroyHook = (vNode: VNode) => any // 元素 被直接或间接得移除
export type RemoveHook = (vNode: VNode, removeCallback: () => void) => any // 元素 已从 DOM 中移除
export type PostHook = () => any // 已完成 patch 过程

/**
    适用于模块：pre, create, update, destroy, remove, post

    适用于单个元素：init, create, insert, prepatch, update, postpatch, destroy, remove
 */
export interface Hooks {
  pre?: PreHook
  init?: InitHook
  create?: CreateHook
  insert?: InsertHook
  prepatch?: PrePatchHook
  update?: UpdateHook
  postpatch?: PostPatchHook
  destroy?: DestroyHook
  remove?: RemoveHook
  post?: PostHook
}

// END
