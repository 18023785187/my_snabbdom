/**
 * hooks 是 snabbdom 提供的一系列生命周期函数
 */
import { VNode } from './vnode';
export declare type PreHook = () => any;
export declare type InitHook = (vNode: VNode) => any;
export declare type CreateHook = (emptyVNode: VNode, vNode: VNode) => any;
export declare type InsertHook = (vNode: VNode) => any;
export declare type PrePatchHook = (oldVNode: VNode, vNode: VNode) => any;
export declare type UpdateHook = (oldVNode: VNode, vNode: VNode) => any;
export declare type PostPatchHook = (oldVNode: VNode, vNode: VNode) => any;
export declare type DestroyHook = (vNode: VNode) => any;
export declare type RemoveHook = (vNode: VNode, removeCallback: () => void) => any;
export declare type PostHook = () => any;
/**
    适用于模块：pre, create, update, destroy, remove, post

    适用于单个元素：init, create, insert, prepatch, update, postpatch, destroy, remove
 */
export interface Hooks {
    pre?: PreHook;
    init?: InitHook;
    create?: CreateHook;
    insert?: InsertHook;
    prepatch?: PrePatchHook;
    update?: UpdateHook;
    postpatch?: PostPatchHook;
    destroy?: DestroyHook;
    remove?: RemoveHook;
    post?: PostHook;
}
