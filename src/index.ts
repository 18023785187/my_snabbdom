import { init } from "./init";
import { h } from './h'
import { propsModule } from './modules/props'
import { attributesModule } from './modules/attributes'
import { datasetModule } from './modules/dataset'
import { eventlistenersModule } from './modules/eventListeners'
import { thunk } from './thunk'

const patch = init([
  attributesModule,
  propsModule,
  datasetModule,
  eventlistenersModule,
])

const container = document.getElementById("container")!

const on = {
  click: [(a: any, b: any) => { console.log(a, b) }]
}

const vnode = h("div#container.two.classes",
  [
    h("input", {
      on: on
    }),
  ]
)
// 传入一个空的元素节点 - 将产生副作用（修改该节点）
patch(container, vnode);

const t = thunk('div.class', function numberView(n) {
  return h("num", [
    "Number is: " + n,
    h('div', '66666')
  ]);
}, [1])

console.log(t)

patch(vnode, t);

// on.click = []

// const vnode1 = h("div#container.two.classes",
//   [
//     h("input", {
//       on: on
//     }),
//   ]
// )

// // 再次调用 `patch`
// patch(vnode, vnode1); // 将旧节点更新为新节点

// const vnode2 = h("div#container.two.classes",
//   [
//     h("input", { props: { value: '6666666' } }),
//   ]
// )

// // 再次调用 `patch`
// patch(vnode1, vnode2); // 将旧节点更新为新节点
