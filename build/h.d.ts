import { VNode, VNodeData } from './vnode';
export declare type VNodes = VNode[];
export declare type VNodeChildElement = VNode | string | number | String | Number | undefined | null;
export declare type ArrayOrElement<T> = T | T[];
export declare type VNodeChildren = ArrayOrElement<VNodeChildElement>;
/**
 * 为 svg 元素添加命名空间 http://www.w3.org/2000/svg
 * @param data 属性
 * @param children 子节点
 * @param sel 选择器
 */
export declare function addNS(data: any, children: Array<VNode | string> | undefined, sel: string | undefined): void;
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
export declare function h(sel: string): VNode;
export declare function h(sel: string, data: VNodeData | null): VNode;
export declare function h(sel: string, children: VNodeChildren): VNode;
export declare function h(sel: string, data: VNodeData | null, children: VNodeChildren): VNode;
/**
 * 创建 DoucmentFragment VNode
 * @param children 虚拟节点数组
 * @returns VNode
 */
export declare function fragment(children: VNodeChildren): VNode;
