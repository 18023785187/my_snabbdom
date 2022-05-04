import { VNode, VNodeData } from './vnode';
export interface ThunkData extends VNodeData {
    fn: () => VNode;
    args: any[];
}
export interface Thunk extends VNode {
    data: ThunkData;
}
export interface ThunkFn {
    (sel: string, fn: (...args: any[]) => any, args: any[]): Thunk;
    (sel: string, key: any, fn: (...args: any[]) => any, args: any[]): Thunk;
}
/**
 *
 * @param sel sel为 selector 的意思，意为 DOM 选择器
 * @param key VNode 的唯一标识
 * @param fn 渲染函数，参数为 args 数组解构，应返回 VNode
 * @param args fn 的参数
 * @returns VNode as ThunkFn
 */
export declare const thunk: ThunkFn;
