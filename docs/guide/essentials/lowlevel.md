<script setup>   
import LowlevelVue from "../../snippets/lowlevel.vue";
</script>

# Low-level Rendering

For most applications, you can just use the components provided by existing UI libraries.

But there are still some situations in which you need to render elements manually.

Also the components provided by UI libraries are implemented using low-level rendering functions which render intrinsic HTML/SVG elements.

:::info
If a component satisfies your needs, you should use it instead of using low-level rendering functions, as the low-level rendering functions are more verbose and error-prone.
:::

## Example

```ts
let count = 0;

app(_ => {
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
            _.$update();
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

**Result**

<LowlevelVue />

## The Function Name

- For HTML elements, the function name is the tag name with a `_` prefix:

  `_._div` for `<div>`.

- For SVG elements, the function name is the tag name with a `_svg` prefix:

  `_._svgPath` for `<path>`.

- For custom elements, the hyphens in the tag name will become camel case:

  `_._myCustomElement` for `<my-custom-element>`.

## The Signature

- Parameters: (all optional)
  - `data`: an object which will be assigned to the element.
  - `inner`: the content of the element.
  - `eventListeners`: the event listeners of the element.
- Return value: `void`

## The `data` Parameter

**Type**: `Partial<TheElement>`

> `TheElement` above is the type of the element, e.g. `HTMLDivElement` or `SVGPathElement`.

All the properties of the `data` parameter will be assigned to the element in the following two ways:

**For HTML elements (or custom elements):**

```ts
for (const key in data) {
  if (data[key] === undefined) {
    // Delete the property if the value is undefined.
    // @ts-ignore
    delete el.node[key];
  } else {
    // For a HTML element, just assign the value to the property.
    // @ts-ignore
    el.node[key] = data[key];
  }
}
```

**For SVG elements:**

```ts
for (const key in data) {
  const value = data[key];
  if (value === undefined) {
    el.node.removeAttribute(key);
  } else if (typeof value === "function") {
    // Cannot stringify a function, so just assign it.
    // @ts-ignore
    el.node[key] = value;
  } else {
    // For SVG elements, all attributes are string,
    //  and just assign it to the SVGElement does not work.
    el.node.setAttribute(key, String(value));
  }
}
```

## The `inner` Parameter

**Type**: `D<Content>`

The content of the element. It can be:

- A string or a number, which will be rendered as a text node.
- A view function, which will be rendered as the content of the element.
- A `PD` object of the above two types.

## The `eventListeners` Parameter

**Type**: `{ [K in TheEventMap]: ((ev: TheEventMap[K]) => void) | { listener: (ev: TheEventMap[K]) => void), options?:  boolean | AddEventListenerOptions } }`

> `TheEventMap` above is the type of the event map, e.g. `HTMLElementEventMap` or `WebComponentsEventListeners[TagName]`.

An object whose keys are the names of the events, and values are the event listeners or a object which contains the event listener and the options.

The event listener and the options will be passed to the `addEventListener` method of the element:

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

Will call:

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

## Event Handling {#event-handling}

As you can see above, there are two ways to handle events:

- Pass the event listener to the `data` parameter:
  ```ts
  _._button(
    {
      onclick: () => {
        count++;
        _.$update();
      },
    },
    "Add",
  );
  ```
- Pass the event listener to the `eventListeners` parameter:
  ```ts
  _._button({}, "Add", {
    click: () => {
      count++;
      _.$update();
    },
  });
  ```

The rule is: **If passing the event listener to the `data` parameter works, you should use it.** Because this way is faster and more concise.

In the following situations, passing the event listener to the `data` parameter may not work:

- The event is a custom event.
- Want to specify the `options` parameter of the `addEventListener` method.

:::warning Update the app after handling events
Unlike the component functions, the low-level rendering functions will not update the app automatically after handling events.

You should call `_.$update()` manually to update the app if you want to apply the changes of the states to the app.
:::

## Ref a Element {#ref-element}

You can use [the `_.$ref` directive](../apis/directives.md#ref) to ref the element.

```ts
import { ref, DOMElementComponent } from "refina";

const iframeRef = ref<DOMElementComponent<"iframe">>();

app.use(Basics)(_ => {
  _.$ref(iframeRef) &&
    _._iframe({
      src: iframeURL,
    });
  //...
  iframeURL.current?.node.contentWindow?.postMessage("Hello", "*");
});
```

:::tip The usage of `&&`
To let TypeScript check whether you are using the right type of the ref object, you'd better use the `&&` operator to connect the `_.$ref` directive and the low-level rendering function.

Because the `_.$ref` directive always returns `true`, so the component function will always be called. But if the ref object is not the right type, the component function will be of type `never`, and the IDE will report an error.
:::
