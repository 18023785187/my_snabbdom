import { Module } from './modules/module';
import { VNode } from './vnode';
import { DOMAPI } from './htmldomapi';
export declare type Options = {
    experimental?: {
        fragments?: boolean;
    };
};
/**
 * init 调用了 init hook、create hook，并将带有 insert hook 的 VNode 推入等待队列。
 *
 * @param modules 每一个 module 都是一个包含 hooks 的对象
 * @param domApi 封装好的 DOM 处理器
 * @param options 实验性 API 的配置
 * @returns patch
 */
export declare function init(modules: Array<Partial<Module>>, domApi?: DOMAPI, options?: Options): (oldVnode: VNode | Element | DocumentFragment, vnode: VNode) => VNode;
