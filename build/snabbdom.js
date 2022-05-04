(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["snabbdom"] = factory();
	else
		root["snabbdom"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "array": () => (/* reexport */ array),
  "attributesModule": () => (/* reexport */ attributesModule),
  "classModule": () => (/* reexport */ classModule),
  "datasetModule": () => (/* reexport */ datasetModule),
  "eventListenersModule": () => (/* reexport */ eventListenersModule),
  "fragment": () => (/* reexport */ fragment),
  "h": () => (/* reexport */ h),
  "htmlDomApi": () => (/* reexport */ htmlDomApi),
  "init": () => (/* reexport */ init),
  "primitive": () => (/* reexport */ primitive),
  "propsModule": () => (/* reexport */ propsModule),
  "styleModule": () => (/* reexport */ styleModule),
  "thunk": () => (/* reexport */ thunk),
  "vnode": () => (/* reexport */ vnode)
});

;// CONCATENATED MODULE: ./src/htmldomapi.ts
function createElement(tagName, options) {
    return document.createElement(tagName, options);
}
function createElementNS(namespaceURI, qualifiedName, options) {
    return document.createElementNS(namespaceURI, qualifiedName, options);
}
function createDocumentFragment() {
    return document.createDocumentFragment();
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function createComment(text) {
    return document.createComment(text);
}
/**
 *
 * @param parentNode 父节点
 * @param newNode 要插入的节点
 * @param referenceNode 标杆节点，即在该节点前插入新节点，如果未指定则将新节点插入到父节点末尾
 */
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(elm) {
    return elm.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}
function getTextContent(node) {
    return node.textContent;
}
function isElement(node) {
    return node.nodeType === 1;
}
function isText(node) {
    return node.nodeType === 3;
}
function isComment(node) {
    return node.nodeType === 8;
}
function isDocumentFragment(node) {
    return node.nodeType === 11;
}
const htmlDomApi = {
    createElement,
    createElementNS,
    createTextNode,
    createDocumentFragment,
    createComment,
    insertBefore,
    removeChild,
    appendChild,
    parentNode,
    nextSibling,
    tagName,
    setTextContent,
    getTextContent,
    isElement,
    isText,
    isComment,
    isDocumentFragment,
};
// END

;// CONCATENATED MODULE: ./src/vnode.ts
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
function vnode(sel, data, children, text, elm) {
    const key = data === undefined ? undefined : data.key; // VNode 的唯一标识
    return {
        sel, data, children, text, elm, key
    };
}

;// CONCATENATED MODULE: ./src/is.ts
/**
 * 这个文件暴露类型判断的方法
 */
/**
 * Array.isArray
 */
const array = Array.isArray;
/**
 * 判断 s 是否为数字或布尔值，或他的原始类型是否为数字或布尔值
 * @param s
 * @returns 布尔值
 */
function primitive(s) {
    return (typeof s === "string" ||
        typeof s === "number" ||
        s instanceof String ||
        s instanceof Number);
}
// END

;// CONCATENATED MODULE: ./src/init.ts



/**
 * 判断一个值是否为 undefined
 * @param s
 * @returns 布尔值
 */
function isUndef(s) {
    return s === undefined;
}
/**
 * 判断一个值是否已定义
 * @param s
 * @returns 布尔值
 */
function isDef(s) {
    return s !== undefined;
}
const emptyNode = vnode("", {}, [], undefined, undefined);
/**
 * 判断两个 VNode 的 key、is、sel 是否都相同
 * @param vnode1
 * @param vnode2
 * @returns 布尔值
 */
function sameVnode(vnode1, vnode2) {
    var _a, _b;
    const isSameKey = vnode1.key === vnode2.key;
    const isSameIs = ((_a = vnode1.data) === null || _a === void 0 ? void 0 : _a.is) === ((_b = vnode2.data) === null || _b === void 0 ? void 0 : _b.is);
    const isSameSel = vnode1.sel === vnode2.sel;
    return isSameSel && isSameKey && isSameIs;
}
function documentFragmentIsNotSupported() {
    throw new Error("The document fragment is not supported on this platform.");
}
function init_isElement(api, vnode) {
    return api.isElement(vnode);
}
function init_isDocumentFragment(api, vnode) {
    return api.isDocumentFragment(vnode);
}
/**
 * 创建一个缓存表，用于存储 oldVNodes 中带有 key 值的 VNode 的索引位置
 * @param children VNode 数组
 * @param beginIdx 起始指针
 * @param endIdx 结束指针
 * @returns 缓存表
 */
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var _a;
    const map = {};
    for (let i = beginIdx; i <= endIdx; ++i) {
        const key = (_a = children[i]) === null || _a === void 0 ? void 0 : _a.key;
        if (key !== undefined) {
            map[key] = i;
        }
    }
    return map;
}
const hooks = [
    "create",
    "update",
    "remove",
    "destroy",
    "pre",
    "post",
];
/**
 * init 调用了 init hook、create hook，并将带有 insert hook 的 VNode 推入等待队列。
 *
 * @param modules 每一个 module 都是一个包含 hooks 的对象
 * @param domApi 封装好的 DOM 处理器
 * @param options 实验性 API 的配置
 * @returns patch
 */
function init(modules, domApi, options) {
    const cbs = {
        create: [],
        update: [],
        remove: [],
        destroy: [],
        pre: [],
        post: [],
    };
    const api = domApi !== undefined ? domApi : htmlDomApi;
    for (const hook of hooks) { // 遍历 hooks 名单，在 module 中筛选出符合条件的 hook 写进 cbs
        for (const module of modules) {
            const currentHook = module[hook];
            if (currentHook !== undefined) {
                cbs[hook].push(currentHook);
            }
        }
    }
    /**
     * 根据真实 DOM 创建一个空的 VNode，在真实 DOM 与 VNode 进行 patch 就需要把真实 DOM 转为空的 VNode
     * @param elm 真实 DOM
     * @returns VNode
     */
    function emptyNodeAt(elm) {
        const id = elm.id ? "#" + elm.id : ""; // id 选择器，如 #aaa
        const classes = elm.getAttribute("class");
        const c = classes ? "." + classes.split(" ").join(".") : ""; // 类选择器，如 .b.c
        return vnode(api.tagName(elm).toLowerCase() + id + c, // div#a
        {}, [], undefined, elm);
    }
    /**
     * 根据 DocumentFragment 创建空的 VNode
     * @param frag DocumentFragment
     * @returns VNode
     */
    function emptyDocumentFragmentAt(frag) {
        return vnode(undefined, {}, [], undefined, frag);
    }
    /**
     * 返回一个回调函数，每次调用 listeners - 1，当 listeners = 0 时，childElm 节点会被删除
     * @param childElm 儿子节点
     * @param listeners 计数器
     * @returns rmCb
     */
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if (--listeners === 0) { // 如果计数器到零，则删除儿子节点
                const parent = api.parentNode(childElm);
                api.removeChild(parent, childElm);
            }
        };
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
    function createElm(vnode, insertedVnodeQueue) {
        var _a, _b, _c, _d;
        let i;
        let data = vnode.data;
        if (data !== undefined) { // data 不为 undefined，说明有属性值，需要处理 data 属性
            const init = (_a = data.hook) === null || _a === void 0 ? void 0 : _a.init; // VNode 的 init hook，VNode 被添加时执行
            if (isDef(init)) {
                init(vnode);
                data = vnode.data;
            }
        }
        const children = vnode.children;
        const sel = vnode.sel;
        /********************
         * 处理 sel 的情况
         * ***************
         */
        if (sel === '!') { // se l为 !，说明是注释节点
            if (isUndef(vnode.text)) {
                vnode.text = '';
            }
            vnode.elm = api.createComment(vnode.text); // 创建真实的注释节点
        }
        else if (sel !== undefined) { // sel 不为 undefined，说明是一个 DOM 节点
            // 处理选择器
            const hashIdx = sel.indexOf('#');
            const dotIdx = sel.indexOf('.', hashIdx);
            const hash = hashIdx > 0 ? hashIdx : sel.length;
            const dot = dotIdx > 0 ? dotIdx : sel.length;
            const tag = // 标签
             hashIdx !== -1 || dotIdx !== -1
                ? sel.slice(0, Math.min(hash, dot))
                : sel;
            const elm = (vnode.elm = // DOM 元素
                isDef(data) && isDef((i = data.ns))
                    ? api.createElementNS(i, tag, data)
                    : api.createElement(tag, data));
            if (hash < dot) { // 如果有 id，设置 id
                elm.setAttribute('id', sel.slice(hash + 1, dot));
            }
            if (dotIdx > 0) { // 如果有 class，设置 class
                elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
            }
            /******************************
             * 执行 modules 的 create hook
             * **************************
             */
            for (i = 0; i < cbs.create.length; ++i) { // 基于 VNode 的 DOM 元素被创建，把收集的 create hooks 全部执行
                cbs.create[i](emptyNode, vnode);
            }
            /*****************************
             * 下面是处理 children 的情况
             * *************************
             */
            if (array(children)) { // 如果 children 是数组，递归创建 Elm
                for (i = 0; i < children.length; ++i) {
                    const ch = children[i];
                    if (ch !== null) {
                        api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                    }
                }
            }
            else if (primitive(vnode.text)) { // 如果 children 不是一个数组，那么检查 text，如果有 text，那就创建文本节点
                api.appendChild(elm, api.createTextNode(vnode.text));
            }
            const hook = vnode.data.hook;
            if (isDef(hook)) {
                (_b = hook.create) === null || _b === void 0 ? void 0 : _b.call(hook, emptyNode, vnode); // VNode create hook 被调用
                if (hook.insert) { // 如果有 insert hook，那么把 VNode 推入等待队列
                    insertedVnodeQueue.push(vnode);
                }
            }
        }
        else if (((_c = options === null || options === void 0 ? void 0 : options.experimental) === null || _c === void 0 ? void 0 : _c.fragments) && vnode.children) { // 当开启 fragments 并且 sel 为 undefined 并且 children 不为 undefined 时，说明该 VNode 是 DocumentFragment
            const children = vnode.children;
            vnode.elm = ( // 创建 DocumentFragment 作为该 VNode 的真实 DOM 节点
            (_d = api.createDocumentFragment) !== null && _d !== void 0 ? _d : documentFragmentIsNotSupported)();
            /******************************
             * 执行 modules 的 create hook
             * **************************
             */
            for (i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, vnode);
            }
            for (i = 0; i < children.length; ++i) { // 把子节点添加到 DocumentFragment 中，并实现递归添加
                const ch = children[i];
                if (ch !== null) {
                    api.appendChild(vnode.elm, createElm(ch, insertedVnodeQueue));
                }
            }
        }
        else { // 以上条件都不符合，那么一定是文本节点
            vnode.elm = api.createTextNode(vnode.text);
        }
        return vnode.elm;
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
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx];
            if (ch != null) { // 如果当前项不为空，则为 VNode，生成真实 DOM 并插入
                api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
            }
        }
    }
    /**
     * 调用 destroy hook
     * @param vnode VNode
     */
    function invokeDestroyHook(vnode) {
        var _a, _b;
        const data = vnode.data;
        if (data !== undefined) { // 如果 data 不为 undefined，说明 VNode 是 DOM 节点
            (_b = (_a = data === null || data === void 0 ? void 0 : data.hook) === null || _a === void 0 ? void 0 : _a.destroy) === null || _b === void 0 ? void 0 : _b.call(_a, vnode); // 调用 destroy hook
            /*******************************
             * 执行 modules 的 destroy hook
             * ***************************
             */
            for (let i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](vnode);
            }
            if (vnode.children !== undefined) { // 如果有子节点，还需要递归调用 invokeDestroyHook
                for (let j = 0; j < vnode.children.length; ++j) {
                    const child = vnode.children[j];
                    if (child != null && typeof child !== 'string') { // 不为 null 或 string，说明 child 为 VNode
                        invokeDestroyHook(child);
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
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        var _a, _b;
        for (; startIdx <= endIdx; ++startIdx) {
            let listeners; // 计数器
            let rm; // 删除的回调函数，每次调用都会是 listeners - 1，当 listeners = 0 时，触发删除操作
            const ch = vnodes[startIdx];
            if (ch != null) {
                if (isDef(ch.sel)) { // sel 不为 undefined，说明是 DOM 节点
                    invokeDestroyHook(ch);
                    listeners = cbs.remove.length + 1; // 计数器的值 = module remove hook + 1，确保 hook 全部被调用且 rm 也被 hook 调用才触发删除操作
                    rm = createRmCb(ch.elm, listeners);
                    /******************************
                     * 执行 modules 的 remove hook
                     * **************************
                     */
                    for (let i = 0; i < cbs.remove.length; ++i) {
                        cbs.remove[i](ch, rm);
                    }
                    const removeHook = (_b = (_a = ch === null || ch === void 0 ? void 0 : ch.data) === null || _a === void 0 ? void 0 : _a.hook) === null || _b === void 0 ? void 0 : _b.remove;
                    if (isDef(removeHook)) {
                        removeHook(ch, rm);
                    }
                    else {
                        rm(); // 如果 ch 没有 remove hook，那么调用一次 rm 确保删除操作可以触发
                    }
                }
                else { // sel 为 undefined，说明是文本节点，直接删除
                    api.removeChild(parentElm, ch.elm);
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
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
        let oldStartIdx = 0; // 旧节点起始指针
        let newStartIdx = 0; // 新节点起始指针
        let oldEndIdx = oldCh.length - 1; // 旧节点结束指针
        let oldStartVnode = oldCh[0]; // 旧节点当前项
        let oldEndVnode = oldCh[oldEndIdx]; // 旧节点结束项
        let newEndIdx = newCh.length - 1; // 新节点结束指针
        let newStartVnode = newCh[0]; // 新节点当前项
        let newEndVnode = newCh[newEndIdx]; // 新节点结束项
        let oldKeyToIdx; // 缓存带有 key 值的旧节点的索引值
        let idxInOld; // oldKeyToIdx 中查找出来的索引值
        let elmToMove; // oldCh 数组中在 idxInOld 位置的 VNode
        let before;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx];
            }
            else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx];
            }
            else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                /**
                 *   当 oldStartVnode 与 newStartVnode 的标识相同时，
                 * 对两者打补丁，oldStartIdx 和 newStartIdx 往后移
                 */
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                /**
                 *   当 oldEndVnode 与 newEndVnode 的标识相同时，
                 * 对两者打补丁，oldEndIdx 和 newEndIdx 往前移
                 */
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) {
                /**
                 *   当 oldStartVnode 与 newEndVnode 的标识相同时，
                 * 对两者打补丁，把 oldStartVnode.elm 插入到 oldEndVnode.elm 的下一个节点前
                 * oldStartIdx 往后移、newEndIdx 往前移
                 */
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) {
                /**
                 *   当 oldEndVnode 与 newStartVnode 的标识相同时，
                 * 对两者打补丁，把 oldEndVnode.elm 插入到 oldStartVnode.elm 前
                 * oldEndIdx 往前移、newStartIdx 往后移
                 */
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldEndVnode.elm, api.nextSibling(oldStartVnode.elm));
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
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
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (isUndef(idxInOld)) { // 如果新节点的 key 值在旧节点中找不到，那么 newStartVnode.elm 要查到 oldStartVnode.elm 之前
                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                }
                else { // 如果新节点的 key 值与旧节点的 key 值相对应
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.sel !== newStartVnode.sel) { // 如果两者标签不一致，key 缓存失效，暴力插入
                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    }
                    else { // 如果两者 key 值、sel 都一致，说明是同一节点
                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                        oldCh[idxInOld] = undefined; // 该位置已匹配完成，将其置为 undefined 后续会跳过该位置
                        api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                    }
                }
                newStartVnode = newCh[++newStartIdx];
            }
        }
        if (newStartIdx <= newEndIdx) { // 如果旧节点已遍历完成，新节点还有剩余节点，说明对于旧节点新增了若干节点
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        }
        if (oldStartIdx <= oldEndIdx) { // 如果新节点已遍历完成，旧节点还有剩余节点，说明对于旧节点需要删除若干节点
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
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
    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        var _a, _b, _c, _d, _e;
        const hook = (_a = vnode === null || vnode === void 0 ? void 0 : vnode.data) === null || _a === void 0 ? void 0 : _a.hook;
        (_b = hook === null || hook === void 0 ? void 0 : hook.prepatch) === null || _b === void 0 ? void 0 : _b.call(hook, oldVnode, vnode);
        const elm = (vnode.elm = oldVnode.elm); // 把 oldVnode.elm 赋值给 vnode.elm
        const oldCh = oldVnode.children;
        const ch = vnode.children;
        if (oldVnode === vnode)
            return;
        if (vnode.data !== undefined) { // data 不为 undefined，说明是 DOM 节点
            /******************************
             * 执行 modules 的 update hook
             * **************************
             */
            for (let i = 0; i < cbs.update.length; ++i) {
                cbs.update[i](oldVnode, vnode);
            }
            (_d = (_c = vnode.data.hook) === null || _c === void 0 ? void 0 : _c.update) === null || _d === void 0 ? void 0 : _d.call(_c, oldVnode, vnode); // 执行 updatre hook
        }
        if (isUndef(vnode.text)) { // 如果新节点没有文本的前提下
            if (isDef(oldCh) && isDef(ch)) { // 如果都有子节点，并且都不相同
                if (oldCh !== ch) {
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue); // 执行 diff 算法
                }
            }
            else if (isDef(ch)) { // 如果新节点有子节点，旧节点没有子节点
                if (isDef(oldVnode.text)) { // 如果旧节点有文本，那么需要置空
                    api.setTextContent(elm, '');
                }
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue); // 向 DOM 节点添加新节点中的子节点
            }
            else if (isDef(oldCh)) { // 如果旧节点有子节点，新节点没有子节点
                removeVnodes(elm, oldCh, 0, oldCh.length - 1); // 把旧节点的所有子节点都删除
            }
            else if (isDef(oldVnode.text)) { // 如果旧节点有文本，那么需要置空
                api.setTextContent(elm, '');
            }
        }
        else if (oldVnode.text !== vnode.text) { // 新节点有文本的前提下
            if (isDef(oldCh)) { // 如果旧节点有子节点，新节点没有子节点，则删除旧节点的所有子节点
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            api.setTextContent(elm, vnode.text);
        }
        (_e = hook === null || hook === void 0 ? void 0 : hook.postpatch) === null || _e === void 0 ? void 0 : _e.call(hook, oldVnode, vnode); // 执行 postPatch hook
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
    return function patch(oldVnode, vnode) {
        let i;
        let elm;
        let parent;
        const insertedVnodeQueue = [];
        /****************************
         * 执行 modules 的 pre hook
         * ************************
         */
        for (i = 0; i < cbs.pre.length; ++i) {
            cbs.pre[i]();
        }
        if (init_isElement(api, oldVnode)) { // oldVnode 是 Element，那么创建一个空的 VNode 并赋给 oldVnode
            oldVnode = emptyNodeAt(oldVnode);
        }
        else if (init_isDocumentFragment(api, oldVnode)) { // 同理
            oldVnode = emptyDocumentFragmentAt(oldVnode);
        }
        if (sameVnode(oldVnode, vnode)) { // 如果对比的节点为同一节点，执行 patchVnode 对比
            patchVnode(oldVnode, vnode, insertedVnodeQueue);
        }
        else { // 如果不是同一节点，则把新节点插入，老节点移除
            elm = oldVnode.elm;
            parent = api.parentNode(elm);
            createElm(vnode, insertedVnodeQueue);
            if (parent !== null) {
                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
                removeVnodes(parent, [oldVnode], 0, 0);
            }
        }
        /*****************************
         * 执行 vnode 的 insert hook
         * *************************
         */
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        /*****************************
         * 执行 modules 的 post hook
         * *************************
         */
        for (i = 0; i < cbs.post.length; ++i) {
            cbs.post[i]();
        }
        return vnode;
    };
}
// END

;// CONCATENATED MODULE: ./src/h.ts


/**
 * 为 svg 元素添加命名空间 http://www.w3.org/2000/svg
 * @param data 属性
 * @param children 子节点
 * @param sel 选择器
 */
function addNS(data, children, sel) {
    data.ns = 'http://www.w3.org/2000/svg';
    if (sel !== 'foreignObject' && children !== undefined) {
        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            if (typeof child === 'string')
                continue;
            const childData = child.data;
            if (childData !== undefined) {
                addNS(childData, child.children, child.sel);
            }
        }
    }
}
function h(sel, b, c) {
    let data = {}; // 属性
    let children; // 子元素，注意 children 的最终形态只能是数组或 undefined
    let text; // 文本
    if (c !== undefined) { // 处理参数 c，当 c 存在，说明有子节点
        if (b !== null) { // b 不为 null，那么 b 只能是 VNodeData 类型的对象
            data = b;
        }
        if (array(c)) {
            children = c;
        }
        else if (primitive(c)) { // 当 c 为数字或字符串时，那么 c 是文本节点
            text = c.toString();
        }
        else if (c && c.sel) { // c 为一个 VNode
            children = [c]; // 为什么是数组，请看 children 的定义注解
        }
    }
    else if (b !== undefined && b !== null) { // 处理参数 b，因为 b 可能是属性，也可能是子节点
        if (array(b)) {
            children = b;
        }
        else if (primitive(b)) {
            text = b.toString();
        }
        else if (b && b.sel) {
            children = [b];
        }
        else { // 以上三种情况都是判断 b 参数是否是子节点的，如果都不满足，那么 b 参数只能是属性
            data = b;
        }
    }
    if (children !== undefined) {
        /**
         *   h 函数子节点传参时可以是一个 Array<number | string>，如 h('div', ['hello', 666])，
         * 而 VNode 是一个对象，所以遍历的目的是把上述类型转换成 VNode
         */
        for (let i = 0; i < children.length; ++i) {
            if (primitive(children[i])) {
                children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
            }
        }
    }
    if ( // 如果 sel === 'svg'，说明该 VNode 是 svg 元素，为其添加命名空间
    sel[0] === "s" &&
        sel[1] === "v" &&
        sel[2] === "g" &&
        (sel.length === 3 || sel[3] === "." || sel[3] === "#")) {
        addNS(data, children, sel);
    }
    return vnode(sel, data, children, text, undefined);
}
/**
 * 创建 DoucmentFragment VNode
 * @param children 虚拟节点数组
 * @returns VNode
 */
function fragment(children) {
    let c;
    let text;
    if (array(children)) { // 只能命中 children 为数组的情况，下面两种貌似不会触发
        c = children;
    }
    else if (primitive(c)) {
        text = children;
    }
    else if (c && c.sel) {
        c = [children];
    }
    if (c !== undefined) {
        for (let i = 0; i < c.length; ++i) {
            if (primitive(c[i])) { // 把文本节点转为 VNode
                c[i] = vnode(undefined, undefined, undefined, c[i], undefined);
            }
        }
    }
    return vnode(undefined, {}, c, text, undefined);
}
// END

;// CONCATENATED MODULE: ./src/thunk.ts

/**
 * 把 vnode 的各项属性复制到 thunk 中
 * @param vnode VNode
 * @param thunk VNode
 */
function copyToThunk(vnode, thunk) {
    var _a;
    const ns = (_a = thunk.data) === null || _a === void 0 ? void 0 : _a.ns;
    vnode.data.fn = thunk.data.fn;
    vnode.data.args = thunk.data.args;
    thunk.data = vnode.data;
    thunk.children = vnode.children;
    thunk.text = vnode.text;
    thunk.elm = vnode.elm;
    if (ns)
        addNS(thunk.data, thunk.children, thunk.sel);
}
/**
 *
 * @param thunk VNode
 */
function thunk_init(thunk) {
    const cur = thunk.data;
    const vnode = cur.fn(...cur.args);
    copyToThunk(vnode, thunk);
}
/**
 *
 * @param oldVnode VNode
 * @param thunk VNode
 * @returns
 */
function prepatch(oldVnode, thunk) {
    let i;
    const old = oldVnode.data;
    const cur = thunk.data;
    const oldArgs = old.args;
    const args = cur.args;
    if (old.fn !== cur.fn || oldArgs.length !== args.length) {
        copyToThunk(cur.fn(...args), thunk);
    }
    for (i = 0; i < args.length; ++i) {
        if (oldArgs[i] !== args[i]) {
            copyToThunk(cur.fn(...args), thunk);
            return;
        }
    }
    copyToThunk(oldVnode, thunk);
}
/**
 *
 * @param sel sel为 selector 的意思，意为 DOM 选择器
 * @param key VNode 的唯一标识
 * @param fn 渲染函数，参数为 args 数组解构，应返回 VNode
 * @param args fn 的参数
 * @returns VNode as ThunkFn
 */
const thunk = function thunk(sel, key, fn, args) {
    if (args === undefined) {
        args = fn;
        fn = key;
        key = undefined;
    }
    return h(sel, {
        key: key,
        hook: { init: thunk_init, prepatch },
        fn: fn,
        args: args,
    });
};

;// CONCATENATED MODULE: ./src/modules/attributes.ts
const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';
const colonChar = 58; // : code
const xChar = 120; // x code
/**
 * module attrs hook
 * @param oldVnode VNode
 * @param vnode VNode
 * @returns
 */
function updateAttrs(oldVnode, vnode) {
    let key;
    const elm = vnode.elm;
    let oldAttrs = oldVnode.data.attrs; // 旧节点的 attrs 对象
    let attrs = vnode.data.attrs; // 新节点的 attrs 对象
    if (!oldAttrs && !attrs)
        return; // 如果新旧节点都没有 attrs 对象，则返回
    if (oldAttrs === attrs)
        return; // 如果新旧节点的 attrs 对象引用相同，说明两者为同一个节点，返回
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};
    // update modified attributes, add new attributes
    for (key in attrs) {
        const cur = attrs[key];
        const old = oldAttrs[key];
        if (old !== cur) { // 新旧节点属性值不相等时，才进行属性修改
            if (cur === true) { // 如果是布尔属性，当 cur 为 true 时，设置该属性，如 <button disabled></button>
                elm.setAttribute(key, '');
            }
            else if (cur === false) { // 如果是布尔属性，当 cur 为 false 时，移除该属性
                elm.removeAttribute(key);
            }
            else { // 处理不是布尔属性的情况
                /**
                 * TODO: 对属性前缀带 x 的不熟悉，该段会在查阅资料后再添加解释注释
                 */
                if (key.charCodeAt(0) !== xChar) { // 属性前缀带 x 的将另行处理
                    elm.setAttribute(key, cur);
                }
                else if (key.charCodeAt(3) === colonChar) {
                    // Assume xml namespace
                    elm.setAttributeNS(xmlNS, key, cur);
                }
                else if (key.charCodeAt(5) === colonChar) {
                    // Assume xlink namespace
                    elm.setAttributeNS(xlinkNS, key, cur);
                }
                else {
                    elm.setAttribute(key, cur);
                }
            }
        }
    }
    for (key in oldAttrs) {
        if (!(key in attrs)) { // 如果当前属性在 attrs 中不存在，则删除该属性
            elm.removeAttribute(key);
        }
    }
}
const attributesModule = {
    create: updateAttrs,
    update: updateAttrs,
};
// END

;// CONCATENATED MODULE: ./src/modules/class.ts
/**
 * module class hook
 * @param oldVnode VNode
 * @param vnode VNode
 * @returns
 */
function updateClass(oldVnode, vnode) {
    let cur;
    let name;
    const elm = vnode.elm;
    let oldClass = oldVnode.data.class; // 旧节点的 class 对象
    let klass = vnode.data.class; // 新节点的 class 对象
    if (!oldClass && !klass)
        return; // 如果新旧节点都没有 class 对象，则返回
    if (oldClass === klass)
        return; // 如果新旧节点的 class 对象引用相同，说明两个节点相同，返回
    oldClass = oldClass || {};
    klass = klass || {};
    for (name in oldClass) {
        if (oldClass[name] && !Object.prototype.hasOwnProperty.call(klass, name)) {
            elm.classList.remove(name); // 如果旧节点的当前 class 项为 true，新节点的当前 class 项为 false，则删除当前 class 项
        }
    }
    for (name in klass) {
        cur = klass[name];
        if (cur !== oldClass[name]) { // 如果新旧节点的当前 class 项不相同，根据情况进行操作
            elm.classList[cur ? 'add' : 'remove'](name);
        }
    }
}
const classModule = { create: updateClass, update: updateClass };
// END

;// CONCATENATED MODULE: ./src/modules/dataset.ts
const CAPS_REGEX = /[A-Z]/g;
/**
 * module dataset hook
 *
 * 生成规则：
 *  1、传入 dataset: { aaa: 'bbb' }，生成的属性为 <div data-aaa='bbb'></div>。
 *  2、传入 dataset: { aAa: 'bbb' }，生成的属性为 <div data-a-aa='bbb'></div>。
 *
 * 使用驼峰命名的属性最终都会被转成 -前缀。
 *
 * @param oldVnode VNode
 * @param vnode VNode
 * @returns
 */
function updateDataset(oldVnode, vnode) {
    const elm = vnode.elm;
    let oldDataset = oldVnode.data.dataset; // 旧节点的 dataset 对象
    let dataset = vnode.data.dataset; // 新节点的 dataset 对象
    let key;
    if (!oldDataset && !dataset)
        return; // 如果新旧节点都没有 dataset 对象，则返回
    if (oldDataset === dataset)
        return; // 如果新旧节点的 dataset 对象引用相同，说明两者为同一个节点，返回
    oldDataset = oldDataset || {};
    dataset = dataset || {};
    const d = elm.dataset;
    for (key in oldDataset) {
        if (!dataset[key]) { // 如果新节点的 dataset 没有当前属性，则向 DOM 元素删除该自定义属性
            if (d) { // 可能存在大小写不一致的情况，如传入 aAa，而 DOM 元素中的 dataset 会转义为 aaa
                if (key in d) {
                    delete d[key];
                }
            }
            else { // 这种情况必定会命中，如传入 aAa，无论设置或者删除我们生成的都是 data-a-aa
                elm.removeAttribute(
                // 对于 key 存在驼峰命名都会转为 -分割，如 fontSize 转为 font-size
                'data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase());
            }
        }
    }
    for (key in dataset) {
        if (oldDataset[key] !== dataset[key]) { // 如果新旧节点的自定义属性不相同，则修改
            if (d) {
                d[key] = dataset[key];
            }
            else {
                elm.setAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(), dataset[key]);
            }
        }
    }
}
const datasetModule = {
    create: updateDataset,
    update: updateDataset
};
// END

;// CONCATENATED MODULE: ./src/modules/eventlisteners.ts
/**
 * 调用事件处理器
 * @param handler 包装事件或包装事件数组
 * @param vnode VNode
 * @param event 事件对象
 */
function invokeHandler(handler, vnode, event) {
    if (typeof handler === 'function') { // 如果包装事件是函数，则调用该事件
        handler.call(vnode, event, vnode);
    }
    else if (typeof handler === 'object') { // 如果是数组，则调用每项事件
        for (let i = 0; i < handler.length; ++i) {
            invokeHandler(handler[i], vnode, event);
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
function handleEvent(event, vnode) {
    const name = event.type; // 获取事件类型
    const on = vnode.data.on;
    if (on && on[name]) { // 如果这个类型的包装事件存在，则调用
        invokeHandler(on[name], vnode, event);
    }
}
/**
 * 创建一个事件监听器
 * @returns handler
 */
function createListener() {
    return function handler(event) {
        handleEvent(event, handler.vnode);
    };
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
function updateEventListeners(oldVnode, vnode) {
    const oldOn = oldVnode.data.on;
    const oldListener = oldVnode.listener; // 旧节点的事件监听器
    const oldElm = oldVnode.elm;
    const on = vnode && vnode.data.on;
    const elm = (vnode && vnode.elm);
    let name;
    if (oldOn === on) { // 如果事件对象的引用没发生改变，说明没有更改的事件，返回
        return;
    }
    if (oldOn && oldListener) {
        if (!on) { // 如果 vnode 的事件类型不存在，可能是 vnode 的事件类型被移除，也可能是 oldVnode 被销毁，两种情况都需要移除所有事件监听器
            for (name in oldOn) {
                oldElm.removeEventListener(name, oldListener, false);
            }
        }
        else { // 如果 vnode 的事件类型存在，那么移除 oldVnode 中存在且 vnode 中不存在的事件监听器
            for (name in oldOn) {
                if (!on[name]) {
                    oldElm.removeEventListener(name, oldListener, false);
                }
            }
        }
    }
    if (on) { // 如果 vnode 有事件对象，那么有添加事件的情况
        const listener = (vnode.listener = // 重用旧节点的事件监听器或创建一个新的事件监听器
            oldVnode.listener || createListener());
        listener.vnode = vnode; // 事件监听器存储的 VNode 对象指向 vnode
        if (!oldOn) { // 如果旧节点没有事件对象，那么对所有事件类型都需要添加监听器
            for (name in on) {
                elm.addEventListener(name, listener, false);
            }
        }
        else { // 如果旧节点有事件对象，那么只需对旧节点没有而新节点有的事件类型添加监听器
            for (name in on) {
                if (!oldOn[name]) {
                    elm.addEventListener(name, listener, false);
                }
            }
        }
    }
}
const eventListenersModule = {
    create: updateEventListeners,
    update: updateEventListeners,
    destroy: updateEventListeners,
};
// END

;// CONCATENATED MODULE: ./src/modules/props.ts
/**
 * module props hook
 * @param oldVnode VNode
 * @param vnode VNode
 * @returns
 */
function updateProps(oldVnode, vnode) {
    let key;
    let cur;
    let old;
    const elm = vnode.elm;
    let oldProps = oldVnode.data.props; // 旧节点的 props 对象
    let props = vnode.data.props; // 新节点的 props 对象
    if (!oldProps && !props)
        return; // 如果新旧节点都没有 props 对象，则返回
    if (oldProps === props)
        return; // 如果新旧节点的 props 对象引用相同，说明两者为同一个节点，返回
    oldProps = oldProps || {};
    props = props || {};
    for (key in props) { // 只遍历 props，所以只是添加或修改属性，不能删除属性
        cur = props[key]; // 新节点的当前属性的值
        old = oldProps[key]; // 旧节点的当前属性的值
        if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
            /**
             * 如果新旧节点的属性值不相等，并且 DOM 元素的属性值和新节点的属性值不一致，则修改 DOM 元素的属性值
             *
             * 注意，如果有 value 值，那么需要验证 DOM 元素的 value 值是否不一致
             */
            elm[key] = cur;
        }
    }
}
const propsModule = { create: updateProps, update: updateProps };
// END

;// CONCATENATED MODULE: ./src/modules/style.ts
const raf = // 动画帧函数优雅降级
 (typeof window !== 'undefined' &&
    window.requestAnimationFrame.bind(window)) ||
    setTimeout;
const nextFrame = function (fn) {
    raf(function () {
        raf(fn); // 下一帧
    });
};
let reflowForced = false;
/**
 * 在下一帧设置对象中的属性的值
 * @param obj 对象
 * @param prop 属性
 * @param val 属性值
 */
function setNextFrame(obj, prop, val) {
    nextFrame(function () {
        obj[prop] = val;
    });
}
/**
 * 在 create、update 生命周期时调用。
 *
 * 对 DOM 元素的样式表进行修改或删除，触发 delayed 延迟函数。
 *
 * @param oldVnode VNode
 * @param vnode VNode
 * @returns
 */
function updateStyle(oldVnode, vnode) {
    let cur;
    let name;
    const elm = vnode.elm;
    let oldStyle = oldVnode.data.style; // 旧节点的 style 对象
    let style = vnode.data.style; // 新节点的 style 对象
    if (!oldStyle && !style)
        return; // 如果新旧节点都没有 style 对象，则返回
    if (oldStyle === style)
        return; // 如果新旧节点的 style 对象引用相同，说明两个节点相同，返回
    oldStyle = oldStyle || {};
    style = style || {};
    const oldHasDel = 'delayed' in oldStyle; // 旧节点是否存在 delayed 对象
    for (name in oldStyle) { // 如果该属性在旧节点有而在新节点没有，则删除
        if (!style[name]) {
            if (name[0] === '-' && name[1] === '-') { // 对于自定义属性，需要在样式表中移除属性
                elm.style.removeProperty(name);
            }
            else { // 其余属性则置空即可
                elm.style[name] = '';
            }
        }
    }
    for (name in style) {
        cur = style[name];
        if (name === 'delayed' && style.delayed) { // 检测是否存在 delayed 对象
            for (const name2 in style.delayed) { // 如果存在，那么应用动画帧
                cur = style.delayed[name2];
                if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                    /**
                     * 如果旧节点不存在 delayed 对象，或者新节点的 delayed 对象的当前属性值不等于旧节点的 delayed 对象的当前属性值，
                     * 那么需要在下一帧改变属性。
                     */
                    setNextFrame(elm.style, name2, cur);
                }
            }
        }
        else if (name !== 'remove' && cur !== oldStyle[name]) { // 排除 remove 属性，并且当前属性不相同，则修改
            if (name[0] === '-' && name[1] === '-') {
                elm.style.setProperty(name, cur);
            }
            else {
                elm.style[name] = cur;
            }
        }
    }
}
/**
 * 在 destroy 生命周期时调用。
 *
 * 在 destroy 生命周期触发时设置 DOM 元素的样式表。
 *
 * @param vnode VNode
 * @returns
 */
function applyDestroyStyle(vnode) {
    let style;
    let name;
    const elm = vnode.elm;
    const s = vnode.data.style;
    if (!s || !(style = s.destroy))
        return; // 如果没有 style 对象或者 style 对象中没有 destroy 对象，返回
    for (name in style) { // 把 destroy 对象中的属性应用到 DOM 元素的样式表中
        elm.style[name] = style[name];
    }
}
/**
 * 在 remove 生命周期时调用。
 *
 * 在元素被删除时执行动画，被执行的动画属性应存在于 remove 对象中，且 transition 也应设置过渡属性。
 *
 * 如：
 *  style: {
      opacity: "1",
      transition: "opacity 1s",
      remove: { opacity: "0" },
    }

    transition 属性指定了 opacity 为过渡属性，且 remove 也指定了 opacity，那么 opacity 属性符合执行删除动画的条件。
 *
 * @param vnode VNode
 * @param rm 计时回调函数，init 模块中有声明，rm 调用一次表示有一个 remove hook 被调用，当所有 remove hook 被调用完毕，触发删除 DOM 操作
 * @returns
 */
function applyRemoveStyle(vnode, rm) {
    const s = vnode.data.style;
    if (!s || !s.remove) { // 如果没有 style 对象或者 style 对象中没有remove 对象，返回
        rm();
        return;
    }
    if (!reflowForced) { // 强制回流一次，暂未知有什么用途，猜测是强制刷新当前元素的状态
        vnode.elm.offsetLeft;
        reflowForced = true;
    }
    let name;
    const elm = vnode.elm;
    let i = 0;
    const style = s.remove;
    let amount = 0; // 计数器，用于统计需要转换的属性
    const applied = [];
    for (name in style) {
        applied.push(name); // 存储 vnode 中的 style 中的 remove 对象中的属性标记
        elm.style[name] = style[name]; // 把 remove 对象中的属性应用到 DOM 样式表中
    }
    const compStyle = getComputedStyle(elm); // 获取样式表
    const props = compStyle['transition-property'].split(', '); // 获取样式表中记录的过渡转换属性表
    for (; i < props.length; ++i) {
        if (applied.indexOf(props[i]) !== -1) { // 累计 applied 和 transition-property 都存在的属性总数
            amount++;
        }
    }
    elm.addEventListener('transitionend', // css 在转换完成后触发
    function (ev) {
        if (ev.target === elm)
            --amount; // 目标元素完成转换，计数器 - 1
        if (amount === 0)
            rm(); // 所有元素完成转换，执行 rm 表示当前 hook 已调用完毕
    });
}
/**
 * 在 pre 生命周期时调用。
 *
 * 重置 回流阀。
 */
function forceReflow() {
    reflowForced = false;
}
const styleModule = {
    pre: forceReflow,
    create: updateStyle,
    update: updateStyle,
    destroy: applyDestroyStyle,
    remove: applyRemoveStyle,
};
// END

;// CONCATENATED MODULE: ./src/index.ts
// core




// helpers
// export { AttachData, attachTo } from "./helpers/attachto";

// export { toVNode } from "./tovnode";

// types

// modules






// // JSX
// export {
//   JsxVNodeChild,
//   JsxVNodeChildren,
//   FunctionComponent,
//   jsx,
//   Fragment,
// } from "./jsx";

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=snabbdom.js.map