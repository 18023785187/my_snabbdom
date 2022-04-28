/**
 * eventlisteners 模块提供了一个功能强大的事件监听器
 * 
 * js：h("div", { on: { click: clickHandler } })
 * 
 * jsx：<div on={{ click: clickHandler }} />
 */
import { VNode, VNodeData } from '../vnode'
import { Module } from './module'

type Listener<T> = (this: VNode, ev: T, vnode: VNode) => void

/**
 * {
 *  [key: event]: (this: VNode, ev: T, vnode: VNode) => void | Array<(this: VNode, ev: T, vnode: VNode) => void>
 * }
 */
export type On = { // 该类型的对象的键是事件名，其对应的值可以是单个事件、也可以是事件数组；注意：该事件是经过包装的事件
  [N in keyof HTMLElementEventMap]?:
  | Listener<HTMLElementEventMap[N]>
  | Array<Listener<HTMLElementEventMap[N]>>
} & {
  [event: string]: Listener<any> | Array<Listener<any>>
}

type SomeListener<N extends keyof HTMLElementEventMap> = // 事件处理器单项
  | Listener<HTMLElementEventMap[N]>
  | Listener<any>

/**
 * 调用事件处理器
 * @param handler 包装事件或包装事件数组
 * @param vnode VNode
 * @param event 事件对象
 */
function invokeHandler<N extends keyof HTMLElementEventMap>(
  handler: SomeListener<N> | Array<SomeListener<N>>,
  vnode: VNode,
  event?: Event
): void {
  if (typeof handler === 'function') { // 如果包装事件是函数，则调用该事件
    handler.call(vnode, event, vnode)
  } else if (typeof handler === 'object') { // 如果是数组，则调用每项事件
    for (let i = 0; i < handler.length; ++i) {
      invokeHandler(handler[i], vnode, event)
    }
  }
}

/**
 *  事件监听器触发的处理函数，
 * 负责检测事件监听器绑定的 VNode 中的事件对象中的某事件类型是否符合触发的事件类型，
 * 如果符合，则分发该事件的处理函数。
 * 
 * 视图：
 *  VNode on: {
 *    click: [fn1, fn2, fn3],
 *    change: fn,
 *  }
 * 
 *  触发 DOM click 事件，调用 handleEvent 检测到 Vnode on 对象中有 click 属性，那么依次调用 click 属性中的事件
 * 
 * @param event 事件对象
 * @param vnode VNode
 */
function handleEvent(event: Event, vnode: VNode) {
  const name = event.type // 获取事件类型
  const on = (vnode.data as VNodeData).on

  if (on && on[name]) { // 如果这个类型的包装事件存在，则调用
    invokeHandler(on[name], vnode, event)
  }
}

/**
 * 创建一个事件监听器
 * @returns handler
 */
function createListener() {
  return function handler(event: Event) {
    handleEvent(event, (handler as any).vnode)
  }
}

/**
 * module eventListeners hook
 * 
 *  eventListeners 模块十分巧妙，对于每种事件类型都仅对应一个事件监听器进行分发，
 * 实现一对多。每次更新只需关注事件的类型是否变化来确定增加或移除事件监听器即可，
 * 而对于 on 对象中每个事件类型中的事件处理函数 eventListeners 模块并不需要关心。
 * 
 * 打个比方：
 *  检测 on 对象，如果 on 对象中有 click 事件类型，则为 click 事件类型添加事件监听器 listener，
 * 对于 click 的事件处理函数是什么，怎么变更并不需要关心。在下一次更新时检测 on 对象，发现 click 事件类型被移除，那么只需移除 click 的事件监听器即可。
 * 
 * @param oldVnode VNode
 * @param vnode? VNode | undefined
 * @returns 
 */
function updateEventListeners(oldVnode: VNode, vnode?: VNode): void {
  const oldOn = (oldVnode.data as VNodeData).on
  const oldListener = (oldVnode as any).listener // 旧节点的事件监听器
  const oldElm: Element = oldVnode.elm as Element
  const on = vnode && (vnode.data as VNodeData).on
  const elm: Element = (vnode && vnode.elm) as Element
  let name: string

  if (oldOn === on) { // 如果事件对象的引用没发生改变，说明没有更改的事件，返回
    return
  }

  if (oldOn && oldListener) {
    if (!on) { // 如果 vnode 的事件类型不存在，可能是 vnode 的事件类型被移除，也可能是 oldVnode 被销毁，两种情况都需要移除所有事件监听器
      for (name in oldOn) {
        oldElm.removeEventListener(name, oldListener, false)
      }
    } else { // 如果 vnode 的事件类型存在，那么移除 oldVnode 中存在且 vnode 中不存在的事件监听器
      for (name in oldOn) {
        if (!on[name]) {
          oldElm.removeEventListener(name, oldListener, false)
        }
      }
    }
  }

  if (on) { // 如果 vnode 有事件对象，那么有添加事件的情况
    const listener = ((vnode as any).listener = // 重用旧节点的事件监听器或创建一个新的事件监听器
      (oldVnode as any).listener || createListener())
    listener.vnode = vnode // 事件监听器存储的 VNode 对象指向 vnode

    if (!oldOn) { // 如果旧节点没有事件对象，那么对所有事件类型都需要添加监听器
      for (name in on) {
        elm.addEventListener(name, listener, false)
      }
    } else { // 如果旧节点有事件对象，那么只需对旧节点没有而新节点有的事件类型添加监听器
      for (name in on) {
        if (!oldOn[name]) {
          elm.addEventListener(name, listener, false)
        }
      }
    }
  }
}

export const eventlistenersModule: Module = {
  create: updateEventListeners,
  update: updateEventListeners,
  destroy: updateEventListeners,
}

// END
