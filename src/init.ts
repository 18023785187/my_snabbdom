import { Module } from './modules/module'
import { vnode, VNode } from './vnode'
import * as is from './is'
import { htmlDomApi, DOMAPI } from './htmldomapi'

type NonUndefined<T> = T extends undefined ? never : T // 非 undefined 类型

/**
 * 判断一个值是否为 undefined
 * @param s 
 * @returns 布尔值
 */
function isUndef(s: any): boolean {
  return s === undefined
}

/**
 * 判断一个值是否已定义
 * @param s 
 * @returns 布尔值
 */
function isDef<A>(s: A): s is NonUndefined<A> {
  return s !== undefined
}

type VNodeQueue = VNode[]

const emptyNode = vnode("", {}, [], undefined, undefined)

/**
 * 判断两个 VNode 的 key、is、sel 是否都相同
 * @param vnode1 
 * @param vnode2 
 * @returns 布尔值
 */
function sameVnode(vnode1: VNode, vnode2: VNode): boolean {
  const isSameKey = vnode1.key === vnode2.key
  const isSameIs = vnode1.data?.is === vnode2.data?.is
  const isSameSel = vnode1.sel === vnode2.sel

  return isSameSel && isSameKey && isSameIs
}

function documentFragmentIsNotSupported(): never {
  throw new Error("The document fragment is not supported on this platform.")
}

function isElement(
  api: DOMAPI,
  vnode: Element | DocumentFragment | VNode
): vnode is Element {
  return api.isElement(vnode as any)
}

function isDocumentFragment(
  api: DOMAPI,
  vnode: DocumentFragment | VNode
): vnode is DocumentFragment {
  return api.isDocumentFragment!(vnode as any)
}

type KeyToIndexMap = { [key: string]: number }

type ArraysOf<T> = {
  [K in keyof T]: Array<T[K]>
}

type ModuleHooks = ArraysOf<Required<Module>> // Required 泛型：泛型中的所有属性都必须是必选项

/**
 * 创建一个缓存表，用于存储 oldVNodes 中带有 key 值的 VNode 的索引位置
 * @param children VNode 数组
 * @param beginIdx 起始指针
 * @param endIdx 结束指针
 * @returns 缓存表
 */
function createKeyToOldIdx(
  children: VNode[],
  beginIdx: number,
  endIdx: number
): KeyToIndexMap {
  const map: KeyToIndexMap = {}
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i]?.key
    if (key !== undefined) {
      map[key as string] = i
    }
  }
  return map
}

const hooks: Array<keyof Module> = [
  "create",
  "update",
  "remove",
  "destroy",
  "pre",
  "post",
]

export type Options = { // 处理一些实验性 api 的配置
  experimental?: {
    fragments?: boolean // 是否开启 fragment
  }
}

/**
 * init 调用了 init hook、create hook，并将带有 insert hook 的 VNode 推入等待队列。
 * 
 * @param modules 每一个 module 都是一个包含 hooks 的对象
 * @param domApi 封装好的 DOM 处理器
 * @param options 实验性 API 的配置
 * @returns patch
 */
export function init(
  modules: Array<Partial<Module>>,
  domApi?: DOMAPI,
  options?: Options
) {
  const cbs: ModuleHooks = { // 整理 hooks 列表
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: [],
  }

  const api: DOMAPI = domApi !== undefined ? domApi : htmlDomApi

  for (const hook of hooks) { // 遍历 hooks 名单，在 module 中筛选出符合条件的 hook 写进 cbs
    for (const module of modules) {
      const currentHook = module[hook]
      if (currentHook !== undefined) {
        (cbs[hook] as any[]).push(currentHook)
      }
    }
  }

  /**
   * 根据真实 DOM 创建一个空的 VNode，在真实 DOM 与 VNode 进行 patch 就需要把真实 DOM 转为空的 VNode
   * @param elm 真实 DOM
   * @returns VNode
   */
  function emptyNodeAt(elm: Element): VNode {
    const id = elm.id ? "#" + elm.id : "" // id 选择器，如 #aaa

    const classes = elm.getAttribute("class")

    const c = classes ? "." + classes.split(" ").join(".") : "" // 类选择器，如 .b.c
    return vnode(
      api.tagName(elm).toLowerCase() + id + c, // div#a
      {},
      [],
      undefined,
      elm
    )
  }

  /**
   * 根据 DocumentFragment 创建空的 VNode
   * @param frag DocumentFragment
   * @returns VNode 
   */
  function emptyDocumentFragmentAt(frag: DocumentFragment): VNode {
    return vnode(undefined, {}, [], undefined, frag)
  }

  /**
   * 返回一个回调函数，每次调用 listeners - 1，当 listeners = 0 时，childElm 节点会被删除
   * @param childElm 儿子节点
   * @param listeners 计数器
   * @returns rmCb
   */
  function createRmCb(childElm: Node, listeners: number) {
    return function rmCb() {
      if (--listeners === 0) { // 如果计数器到零，则删除儿子节点
        const parent = api.parentNode(childElm) as Node
        api.removeChild(parent, childElm)
      }
    }
  }

  /**
   * 根据 VNode 创建真实 DOM，并绑定在 VNode.elm 上，返回 Node。
   * 
   * createElm 会根据以下情况创建节点：
   *  1、当 sel 为 ! 时，此时 VNode 为注释节点，创建注释节点。
   *  2、当 sel 不为 undefined 时，此时 VNode 为 DOM 节点，创建 DOM 节点：
   *    i、当 children 为数组时，递归创建 Elm 并添加到父节点中。
   *    ii、当 children 不为数组时，根据 text 创建文本节点并添加到父节点中。
   *  3、当 sel 为 undefined 且 fragments 选项开启、且 children 为数组时，创建 DocumentFragment，递归创建 Elm 并添加到 DocumentFragment 中。
   *  4、当 sel、children 为 undefined 时，此时 VNode 为文本节点，创建文本节点。
   * 
   * @param vnode VNode
   * @param insertedVnodeQueue VNode 等待队列，里面的 VNode 在挂载完毕后将被处理
   * @returns Node
   */
  function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {
    let i: any
    let data = vnode.data
    if (data !== undefined) { // data 不为 undefined，说明有属性值，需要处理 data 属性
      const init = data.hook?.init // VNode 的 init hook，VNode 被添加时执行
      if (isDef(init)) {
        init(vnode)
        data = vnode.data
      }
    }
    const children = vnode.children
    const sel = vnode.sel
    /********************
     * 处理 sel 的情况
     * ***************
     */
    if (sel === '!') { // se l为 !，说明是注释节点
      if (isUndef(vnode.text)) {
        vnode.text = ''
      }
      vnode.elm = api.createComment(vnode.text!) // 创建真实的注释节点
    } else if (sel !== undefined) { // sel 不为 undefined，说明是一个 DOM 节点
      // 处理选择器
      const hashIdx = sel.indexOf('#')
      const dotIdx = sel.indexOf('.', hashIdx)
      const hash = hashIdx > 0 ? hashIdx : sel.length
      const dot = dotIdx > 0 ? dotIdx : sel.length
      const tag = // 标签
        hashIdx !== -1 || dotIdx !== -1
          ? sel.slice(0, Math.min(hash, dot))
          : sel
      const elm = (vnode.elm = // DOM 元素
        isDef(data) && isDef((i = data.ns))
          ? api.createElementNS(i, tag, data)
          : api.createElement(tag, data))
      if (hash < dot) { // 如果有 id，设置 id
        elm.setAttribute('id', sel.slice(hash + 1, dot))
      }
      if (dotIdx > 0) { // 如果有 class，设置 class
        elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '))
      }
      /******************************
       * 执行 modules 的 create hook
       * **************************
       */
      for (i = 0; i < cbs.create.length; ++i) { // 基于 VNode 的 DOM 元素被创建，把收集的 create hooks 全部执行
        cbs.create[i](emptyNode, vnode)
      }
      /*****************************
       * 下面是处理 children 的情况
       * *************************
       */
      if (is.array(children)) { // 如果 children 是数组，递归创建 Elm
        for (i = 0; i < children.length; ++i) {
          const ch = children[i]
          if (ch !== null) {
            api.appendChild(elm, createElm(ch as VNode, insertedVnodeQueue))
          }
        }
      } else if (is.primitive(vnode.text)) { // 如果 children 不是一个数组，那么检查 text，如果有 text，那就创建文本节点
        api.appendChild(elm, api.createTextNode(vnode.text))
      }
      const hook = vnode.data!.hook
      if (isDef(hook)) {
        hook.create?.(emptyNode, vnode) // VNode create hook 被调用
        if (hook.insert) { // 如果有 insert hook，那么把 VNode 推入等待队列
          insertedVnodeQueue.push(vnode)
        }
      }
    } else if (options?.experimental?.fragments && vnode.children) { // 当开启 fragments 并且 sel 为 undefined 并且 children 不为 undefined 时，说明该 VNode 是 DocumentFragment
      const children = vnode.children
      vnode.elm = ( // 创建 DocumentFragment 作为该 VNode 的真实 DOM 节点
        api.createDocumentFragment ?? documentFragmentIsNotSupported
      )()
      /******************************
       * 执行 modules 的 create hook
       * **************************
       */
      for (i = 0; i < cbs.create.length; ++i) {
        cbs.create[i](emptyNode, vnode)
      }
      for (i = 0; i < children.length; ++i) { // 把子节点添加到 DocumentFragment 中，并实现递归添加
        const ch = children[i]
        if (ch !== null) {
          api.appendChild(
            vnode.elm,
            createElm(ch as VNode, insertedVnodeQueue)
          )
        }
      }
    } else { // 以上条件都不符合，那么一定是文本节点
      vnode.elm = api.createTextNode(vnode.text!)
    }
    return vnode.elm
  }

  /**
   * 从 vnodes 中取 startIdx 到 endIdx 区间的节点插入到 before 前
   * @param parentElm 父节点
   * @param before 标杆节点
   * @param vnodes VNode 数组
   * @param startIdx 插入的起始指针
   * @param endIdx 插入的结束指针
   * @param insertedVnodeQueue VNode 等待队列，里面的 VNode 在挂载完毕后将被处理
   */
  function addVnodes(
    parentElm: Node,
    before: Node | null,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number,
    insertedVnodeQueue: VNodeQueue
  ): void {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]
      if (ch != null) { // 如果当前项不为空，则为 VNode，生成真实 DOM 并插入
        api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before)
      }
    }
  }

  /**
   * 调用 destroy hook
   * @param vnode VNode
   */
  function invokeDestroyHook(vnode: VNode): void {
    const data = vnode.data
    if (data !== undefined) { // 如果 data 不为 undefined，说明 VNode 是 DOM 节点
      data?.hook?.destroy?.(vnode) // 调用 destroy hook
      /*******************************
       * 执行 modules 的 destroy hook
       * ***************************
       */
      for (let i = 0; i < cbs.destroy.length; ++i) {
        cbs.destroy[i](vnode)
      }
      if (vnode.children !== undefined) { // 如果有子节点，还需要递归调用 invokeDestroyHook
        for (let j = 0; j < vnode.children.length; ++j) {
          const child = vnode.children[j]
          if (child != null && typeof child !== 'string') { // 不为 null 或 string，说明 child 为 VNode
            invokeDestroyHook(child)
          }
        }
      }
    }
  }

  /**
   * 从 vnodes 中取 startIdx 到 endIdx 区间的节点删除
   * 
   * removeVnode 执行了 destroy hook、remove hook。
   * 
   * @param parentElm 父节点
   * @param vnodes VNode 数组
   * @param startIdx 删除的起始指针
   * @param endIdx 删除的结束指针
   */
  function removeVnodes(
    parentElm: Node,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number
  ): void {
    for (; startIdx <= endIdx; ++startIdx) {
      let listeners: number // 计数器
      let rm: () => void // 删除的回调函数，每次调用都会是 listeners - 1，当 listeners = 0 时，触发删除操作
      const ch = vnodes[startIdx]
      if (ch != null) {
        if (isDef(ch.sel)) { // sel 不为 undefined，说明是 DOM 节点
          invokeDestroyHook(ch)
          listeners = cbs.remove.length + 1 // 计数器的值 = module remove hook + 1，确保 hook 全部被调用且 rm 也被 hook 调用才触发删除操作
          rm = createRmCb(ch.elm!, listeners)
          /******************************
           * 执行 modules 的 remove hook
           * **************************
           */
          for (let i = 0; i < cbs.remove.length; ++i) {
            cbs.remove[i](ch, rm)
          }
          const removeHook = ch?.data?.hook?.remove
          if (isDef(removeHook)) {
            removeHook(ch, rm)
          } else {
            rm() // 如果 ch 没有 remove hook，那么调用一次 rm 确保删除操作可以触发
          }
        } else { // sel 为 undefined，说明是文本节点，直接删除
          api.removeChild(parentElm, ch.elm!)
        }
      }
    }
  }

  /**
   * 更新新老子节点策略。
   * 
   *   diff 算法采用四指针 + 旧节点 key 缓存的方法进行高效命中，
   * 当新旧节点命中，说明这两个节点为同一个节点，根据新节点对旧节点进行打补丁，
   * 并根据新节点的位置调整旧节点的位置。
   * 
   * 四指针：
   *  新前 -> 旧前
   *  新后 -> 旧后
   *  新后 -> 旧前
   *  新前 -> 旧后
   * 
   * 旧节点缓存：
   *  遍历旧节点，把旧节点中所有带有 key 值的节点的下标进行缓存，
   *  取新前节点对比缓存节点，如果命中，则打补丁并调整位置，如果未命中，说明新前节点为全新的 DOM 元素，直接暴力插入。
   * 
   * 新节点有剩余，往旧节点添加剩余新节点。
   * 旧节点有剩余，往旧节点删除剩余旧节点。
   * 
   * @param parentElm 父节点
   * @param oldCh 旧节点 VNode 数组
   * @param newCh 新节点 Vnode 数组
   * @param insertedVnodeQueue VNode 等待队列，里面的 VNode 在挂载完毕后将被处理
   */
  function updateChildren(
    parentElm: Node,
    oldCh: VNode[],
    newCh: VNode[],
    insertedVnodeQueue: VNodeQueue
  ) {
    let oldStartIdx = 0 // 旧节点起始指针
    let newStartIdx = 0 // 新节点起始指针
    let oldEndIdx = oldCh.length - 1 // 旧节点结束指针
    let oldStartVnode = oldCh[0] // 旧节点当前项
    let oldEndVnode = oldCh[oldEndIdx] // 旧节点结束项
    let newEndIdx = newCh.length - 1 // 新节点结束指针
    let newStartVnode = newCh[0] // 新节点当前项
    let newEndVnode = newCh[newEndIdx] // 新节点结束项
    let oldKeyToIdx: KeyToIndexMap | undefined // 缓存带有 key 值的旧节点的索引值
    let idxInOld: number // oldKeyToIdx 中查找出来的索引值
    let elmToMove: VNode // oldCh 数组中在 idxInOld 位置的 VNode
    let before: any

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx]
      } else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx]
      } else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        /**
         *   当 oldStartVnode 与 newStartVnode 的标识相同时，
         * 对两者打补丁，oldStartIdx 和 newStartIdx 往后移
         */
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        /**
         *   当 oldEndVnode 与 newEndVnode 的标识相同时，
         * 对两者打补丁，oldEndIdx 和 newEndIdx 往前移
         */
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        /**
         *   当 oldStartVnode 与 newEndVnode 的标识相同时，
         * 对两者打补丁，把 oldStartVnode.elm 插入到 oldEndVnode.elm 的下一个节点前
         * oldStartIdx 往后移、newEndIdx 往前移
         */
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
        api.insertBefore(
          parentElm,
          oldStartVnode.elm!,
          api.nextSibling(oldEndVnode.elm!)
        )
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        /**
         *   当 oldEndVnode 与 newStartVnode 的标识相同时，
         * 对两者打补丁，把 oldEndVnode.elm 插入到 oldStartVnode.elm 前
         * oldEndIdx 往前移、newStartIdx 往后移
         */
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
        api.insertBefore(
          parentElm,
          oldEndVnode.elm!,
          api.nextSibling(oldStartVnode.elm!)
        )
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        /**
         *   上述四种情况都不匹配，那么需要创建 oldCh 指针缓存，使用 newStartVnode 的 key 匹配缓存表。
         * 
         * - 如果匹配成功，那么对旧节点打补丁，并插入到 oldStartVnode 前。
         * - 如果匹配不成功，那么创建新节点并暴力插入到 oldStartVnode 前。
         * 
         *  对于上述两种情况就指针都不需要移动：
         *    1、对于第一种情况，newStartVnode 插入到 oldStartVnode 前，oldStartIdx 无影响。
         *    2、对于第二种情况，由于指针只能一步一步移动，所以对于跳跃性的位置应对其标记，后续直接跳过该位置。
         *    3、无论哪种情况，newStartIdx 都会后移，因为该判断无论如何都会使 newStartVnode 都会移动。
         */
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        }
        idxInOld = oldKeyToIdx[newStartVnode.key as string]
        if (isUndef(idxInOld)) { // 如果新节点的 key 值在旧节点中找不到，那么 newStartVnode.elm 要查到 oldStartVnode.elm 之前
          api.insertBefore(
            parentElm,
            createElm(newStartVnode, insertedVnodeQueue),
            oldStartVnode.elm!
          )
        } else { // 如果新节点的 key 值与旧节点的 key 值相对应
          elmToMove = oldCh[idxInOld]
          if (elmToMove.sel !== newStartVnode.sel) { // 如果两者标签不一致，key 缓存失效，暴力插入
            api.insertBefore(
              parentElm,
              createElm(newStartVnode, insertedVnodeQueue),
              oldStartVnode.elm!
            )
          } else { // 如果两者 key 值、sel 都一致，说明是同一节点
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
            oldCh[idxInOld] = undefined as any // 该位置已匹配完成，将其置为 undefined 后续会跳过该位置
            api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }

    if (newStartIdx <= newEndIdx) { // 如果旧节点已遍历完成，新节点还有剩余节点，说明对于旧节点新增了若干节点
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
      addVnodes(
        parentElm,
        before,
        newCh,
        newStartIdx,
        newEndIdx,
        insertedVnodeQueue
      )
    }
    if (oldStartIdx <= oldEndIdx) { // 如果新节点已遍历完成，旧节点还有剩余节点，说明对于旧节点需要删除若干节点
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  }

  /**
   * 新旧节点对比，并根据差异对 DOM 节点进行修改，对比规则：
   *  1、当 vnode 没有文本时：
   *    i、当 vnode 和 oldVnode 都有子节点且子节点不相同时，执行 diff 算法比较子节点。
   *    ii、当 vnode 有子节点、oldVnode 没有子节点时，清除 oldVnode 的文本并向 DOM 节点插入 vnode 的子节点。
   *    iii、当 oldVnode 有子节点、vnode 没有子节点时，向 DOM 节点删除所有子节点。
   *    iiii、当 oldVnode 有文本时，将文本内容置空。
   *  2、当 vnode 有文本时：
   *    - 如果 oldVnode 有子节点，则全部删除。
   *    - 将文本内容修改为 vnode 的文本内容
   * 
   * patchVnode 函数执行了 update hook、postPatch hook。
   * 
   * @param oldVnode 旧节点 VNode
   * @param vnode 新节点 VNode
   * @param insertedVnodeQueue VNode 等待队列，里面的 VNode 在挂载完毕后将被处理
   * @returns 
   */
  function patchVnode(
    oldVnode: VNode,
    vnode: VNode,
    insertedVnodeQueue: VNodeQueue
  ) {
    const hook = vnode?.data?.hook
    hook?.prepatch?.(oldVnode, vnode)
    const elm = (vnode.elm = oldVnode.elm)! // 把 oldVnode.elm 赋值给 vnode.elm
    const oldCh = oldVnode.children as VNode[]
    const ch = vnode.children as VNode[]
    if (oldVnode === vnode) return
    if (vnode.data !== undefined) { // data 不为 undefined，说明是 DOM 节点
      /******************************
       * 执行 modules 的 update hook
       * **************************
       */
      for (let i = 0; i < cbs.update.length; ++i) {
        cbs.update[i](oldVnode, vnode)
      }
      vnode.data.hook?.update?.(oldVnode, vnode) // 执行 updatre hook
    }
    if (isUndef(vnode.text)) { // 如果新节点没有文本的前提下
      if (isDef(oldCh) && isDef(ch)) { // 如果都有子节点，并且都不相同
        if (oldCh !== ch) {
          updateChildren(elm, oldCh, ch, insertedVnodeQueue) // 执行 diff 算法
        }
      } else if (isDef(ch)) { // 如果新节点有子节点，旧节点没有子节点
        if (isDef(oldVnode.text)) { // 如果旧节点有文本，那么需要置空
          api.setTextContent(elm, '')
        }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue) // 向 DOM 节点添加新节点中的子节点
      } else if (isDef(oldCh)) { // 如果旧节点有子节点，新节点没有子节点
        removeVnodes(elm, oldCh, 0, oldCh.length - 1) // 把旧节点的所有子节点都删除
      } else if (isDef(oldVnode.text)) { // 如果旧节点有文本，那么需要置空
        api.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) { // 新节点有文本的前提下
      if (isDef(oldCh)) { // 如果旧节点有子节点，新节点没有子节点，则删除旧节点的所有子节点
        removeVnodes(elm, oldCh, 0, oldCh.length - 1)
      }
      api.setTextContent(elm, vnode.text!)
    }
    hook?.postpatch?.(oldVnode, vnode) // 执行 postPatch hook
  }

  /**
   * patch 的作用是对比 oldVnode 和 vnode 的异同，根据情况进行打补丁或替换操作：
   *  1、如果旧节点是 DOM 元素，则创建空的 VNode。
   *  2、如果旧节点与新节点是同一节点，则打补丁。
   *  3、如果旧节点与新节点不是同一节点，则替换。
   * 
   * patch 执行了 modules pre hook、vnode insert hook、modules post hook。
   * 
   * @param oldVnode 旧节点
   * @param vnode 新节点
   * @returns VNode
   */
  return function patch(
    oldVnode: VNode | Element | DocumentFragment,
    vnode: VNode
  ): VNode {
    let i: number
    let elm: Node
    let parent: Node
    const insertedVnodeQueue: VNodeQueue = []
    /****************************
     * 执行 modules 的 pre hook
     * ************************
     */
    for (i = 0; i < cbs.pre.length; ++i) {
      cbs.pre[i]()
    }

    if (isElement(api, oldVnode)) { // oldVnode 是 Element，那么创建一个空的 VNode 并赋给 oldVnode
      oldVnode = emptyNodeAt(oldVnode)
    } else if (isDocumentFragment(api, oldVnode)) { // 同理
      oldVnode = emptyDocumentFragmentAt(oldVnode)
    }

    if (sameVnode(oldVnode, vnode)) { // 如果对比的节点为同一节点，执行 patchVnode 对比
      patchVnode(oldVnode, vnode, insertedVnodeQueue)
    } else { // 如果不是同一节点，则把新节点插入，老节点移除
      elm = oldVnode.elm!
      parent = api.parentNode(elm) as Node

      createElm(vnode, insertedVnodeQueue)

      if (parent !== null) {
        api.insertBefore(parent, vnode.elm!, api.nextSibling(elm))
        removeVnodes(parent, [oldVnode], 0, 0)
      }
    }
    /*****************************
     * 执行 vnode 的 insert hook
     * *************************
     */
    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data!.hook!.insert!(insertedVnodeQueue[i])
    }
    /*****************************
     * 执行 modules 的 post hook
     * *************************
     */
    for (i = 0; i < cbs.post.length; ++i) {
      cbs.post[i]()
    }
    return vnode
  }
}

// END
