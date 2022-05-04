import { Hooks } from './hooks';
import { VNodeStyle } from './modules/style';
import { On } from './modules/eventListeners';
import { Attrs } from './modules/attributes';
import { Classes } from './modules/class';
import { Props } from './modules/props';
import { Dataset } from './modules/dataset';
export declare type Key = string | number | symbol;
export interface VNode {
    sel: string | undefined;
    data: VNodeData | undefined;
    children: Array<VNode | string> | undefined;
    text: string | undefined;
    elm: Node | undefined;
    key: Key | undefined;
}
export interface VNodeData {
    props?: Props;
    attrs?: Attrs;
    class?: Classes;
    style?: VNodeStyle;
    dataset?: Dataset;
    on?: On;
    hook?: Hooks;
    key?: Key;
    ns?: string;
    fn?: () => VNode;
    args?: any[];
    is?: string;
    [key: string]: any;
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
export declare function vnode(sel: string | undefined, data: VNodeData | undefined, children: Array<VNode | string> | undefined, text: string | undefined, elm: Element | DocumentFragment | Text | undefined): VNode;
