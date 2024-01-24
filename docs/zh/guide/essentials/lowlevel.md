<script setup>   
import LowlevelVue from "snippets/lowlevel.vue";
</script>

# 底层渲染

对于很多应用，已有的组件库已经足够使用。

但是仍有小部分情况你需要直接渲染 DOM 元素。

以及，组件库也是通过底层渲染方法来渲染 HTML 或 SVG 元素，以构成组件。

:::info

如果一个现有的组件已经满足你的需要，请使用它，因为底层渲染更冗长并容易写错。

:::

## 例子

```ts
let count = 0;

const app = $app(_ => {
  _._div(
    {
      id: "my-div",
    },
    _ => {
      _._p({}, `Count is: ${count}`);
      _._button(
        {
          onclick: () => {
            count++;
            app.update();
          },
        },
        "Add",
      );
    },
  );
  _._svgSvg(
    {
      width: 100,
      height: 100,
    },
    _ => {
      _._svgPath({
        d: "M 10 10 H 90 V 90 H 10 Z",
        fill: "red",
      });
    },
  );
});
```

**运行结果**

<LowlevelVue />

## 函数名

- 对于 HTML 元素，函数名是标签名加上 `_` 前缀：

  `_._div` 对应 `<div>`。

- 对于 SVG 元素，函数名是标签名加上 `_svg` 前缀：

  `_._svgPath` 对应 `<path>`。

- 对于自定义元素（包括 Web Component)，标签名中的的短横线会被以小驼峰写法代替：

  `_._myCustomElement` 对应 `<my-custom-element>`。

## 函数签名

- 参数：（均为可选参数）
  - `data`: 将被合并到元素实例的对象。
  - `inner`: 元素的内容（即打开、闭合标签之间的东西）。
  - `eventListeners`: 元素的事件侦听器。
- 返回值: `void`

## `data` 参数

**类型**: `Partial<TheElement>`

> 这里的 `TheElement` 指 DOM 元素的实例类型，比如 `HTMLDivElement`、`SVGPathElement`。

通过 `data` 参数传入的对象将被合并到元素实例。合并操作通过以下两种不同的方式完成：

**对于 HTML 元素或自定义元素**：

```ts
for (const key in data) {
  if (data[key] === undefined) {
    // 删除值为 undefined 的属性
    // @ts-ignore
    delete el.node[key];
  } else {
    // 对于 HTM 元素，直接赋值对应的属性
    // @ts-ignore
    el.node[key] = data[key];
  }
}
```

**对于 SVG 元素**：

```ts
for (const key in data) {
  const value = data[key];
  if (value === undefined) {
    el.node.removeAttribute(key);
  } else if (typeof value === "function") {
    // 不能将函数转化为字符串，所以直接赋值
    // @ts-ignore
    el.node[key] = value;
  } else {
    // 对于 SVG 元素，直接赋值不起作用
    el.node.setAttribute(key, String(value));
  }
}
```

## `inner` 参数

**类型**: `D<Content>`

元素的内容（即打开、闭合标签之间的东西）。 它可以是：

- 一个字符串或数字，将被以字符串节点的形式渲染。
- 一个片段，将调用它以渲染内部的元素。
- 一个包裹了上述2种之一的 `PD` 对象。

## `eventListeners` 参数

**类型**: `{ [K in TheEventMap]: ((ev: TheEventMap[K]) => void) | { listener: (ev: TheEventMap[K]) => void), options?:  boolean | AddEventListenerOptions } }`

> 这里的 `TheEventMap` 是元素对应的事件表，比如 `HTMLElementEventMap`、`WebComponentsEventListeners[TagName]`。

传入的值应是一个对象，键为事件名，值为回调函数或回调函数与其他选项组成的对象。

回调函数和其他选项将被传递给元素的 `addEventListener` 方法。

```ts
_._div({}, "", {
  mousemove: {
    listener: ev => {
      // ...
    },
    options: {
      capture: true,
    },
  },
});
```

将会调用：

```ts
divElement.addEventListener(
  "mousemove",
  ev => {
    // ...
  },
  {
    capture: true,
  },
);
```

## 接收事件 {#event-handling}

正如上文所述，底层渲染时有两种接收事件的方式。

- 将回调函数传递给 `data` 参数：
  ```ts
  _._button(
    {
      onclick: () => {
        count++;
        app.update();
      },
    },
    "Add",
  );
  ```
- 将回调函数传递给 `eventListeners` 参数：
  ```ts
  _._button({}, "Add", {
    click: () => {
      count++;
      app.update();
    },
  });
  ```

规则是：\*\*如果将回调函数传递给 `data` 参数能正确工作，那么就不要使用 `eventListeners` 参数。\*\*因为前者更快且更紧凑。

在以下两种情况，将回调函数传递给 `data` 参数不工作：

- 这个事件是一个自定义的事件。
- 需要指定传递给 `addEventListener` 方法的 `options`。

:::warning 在接收事件后触发应用更新

不同于组件函数，底层渲染函数不会再接收到事件后自动更新应用视图。

如果你想要反映状态的更改，你需要手动调用 [`app.update()`](../apis/directives.md#update) 方法以触发应用更新。

:::

## 元素引用 {#ref-element}

你可以使用 [`_.$ref` 指令](../apis/directives.md#ref) 来引用元素。

```ts
import { ref, DOMElementComponent } from "refina";

const iframeRef = ref<DOMElementComponent<"iframe">>();

$app([Basics], _ => {
  _.$ref(iframeRef) &&
    _._iframe({
      src: iframeURL,
    });
  //...
  iframeURL.current?.node.contentWindow?.postMessage("Hello", "*");
});
```
