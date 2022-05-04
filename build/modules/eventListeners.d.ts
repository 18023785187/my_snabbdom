/**
 * eventlisteners 模块提供了一个功能强大的事件监听器
 *
 * js：h("div", { on: { click: clickHandler } })
 *
 * jsx：<div on={{ click: clickHandler }} />
 */
import { VNode } from '../vnode';
import { Module } from './module';
declare type Listener<T> = (this: VNode, ev: T, vnode: VNode) => void;
/**
 * {
 *  [key: event]: (this: VNode, ev: T, vnode: VNode) => void | Array<(this: VNode, ev: T, vnode: VNode) => void>
 * }
 */
export declare type On = {
    [N in keyof HTMLElementEventMap]?: Listener<HTMLElementEventMap[N]> | Array<Listener<HTMLElementEventMap[N]>>;
} & {
    [event: string]: Listener<any> | Array<Listener<any>>;
};
export declare const eventListenersModule: Module;
export {};
