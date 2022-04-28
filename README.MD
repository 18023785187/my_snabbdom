# mySnabbdom

---

## 介绍

对 snabbdom 源码重新编写，并注有大量解释。

通过学习 snabbdom 源码，我们可以深入理解 Virtual DOM 的底层工作原理，从而更好地去 Vue 等框架的工作原理。

---

## 学习前提

1. 学习 snabbdom 源码前需要了解 Virtual DOM ，并对 snabbdom 有一定的认识，了解过 snabbdom 的工作原理，如果尚未了解过 snabbdom 可以先阅读 [官方文档](./docs/README-zh_CN.md) 进行初步了解。
2. 有一定的编程功底，熟悉 DOM API。
3. 了解过 Typescript，如果未了解过 Typescript 也不会有什么影响，但是结合 Typescript 会更清楚地知道某些变量或函数的类型，从而更好地理解。

---

## 参考

snabbdom 官方文档

[English](./docs/README-en.md) | [简体中文](./docs/README-zh_CN.md)

---

## 目录

```

|-- undefined
    |-- mySnabbdom
        |-- .editorconfig
        |-- .gitignore
        |-- package-lock.json
        |-- package.json
        |-- README.MD
        |-- tsconfig.json
        |-- docs
        |   |-- README-en.md
        |   |-- readme-title.svg
        |   |-- README-zh_CN.md
        |-- public
        |   |-- index.html
        |-- scripts
        |   |-- build.js
        |   |-- common.js
        |   |-- start.js
        |-- src
            |-- h.ts             h函数模块
            |-- hooks.ts         声明周期钩子类型声明
            |-- htmldomapi.ts    原生DOM API封装
            |-- index.ts         入口文件
            |-- init.ts          init函数模块
            |-- is.ts            类型判断函数
            |-- tovnode.ts       
            |-- vnode.ts         vnode函数模块
            |-- modules          存放模块插件集合的文件
                |-- attributes.ts         属性模块
                |-- class.ts              类模块
                |-- dataset.ts            自定义属性模块
                |-- eventListeners.ts     事件模块
                |-- module.ts             init函数调用的钩子函数类型声明
                |-- props.ts              原生DOM属性模块
                |-- style.ts              内联样式模块

```
